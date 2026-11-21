const configService = require('./configService');

class JiraService {
  parseIssueKey(input) {
    if (!input || typeof input !== 'string') {
      throw new Error('Please enter a Jira issue key or ticket URL.');
    }

    const trimmed = input.trim();

    // Check for browse URL: .../browse/KEY-123
    const browseMatch = trimmed.match(/\/browse\/([A-Z0-9]+-\d+)/i);
    if (browseMatch) {
      return browseMatch[1].toUpperCase();
    }

    // Check for selectedIssue query param: ?selectedIssue=KEY-123
    const queryMatch = trimmed.match(/selectedIssue=([A-Z0-9]+-\d+)/i);
    if (queryMatch) {
      return queryMatch[1].toUpperCase();
    }

    // Direct key format: e.g. PROJ-123, LPT-1, QA-42
    const keyMatch = trimmed.match(/^([A-Z0-9]+-\d+)$/i);
    if (keyMatch) {
      return keyMatch[1].toUpperCase();
    }

    // General substring match for KEY-123
    const generalMatch = trimmed.match(/([A-Z][A-Z0-9]+-\d+)/i);
    if (generalMatch) {
      return generalMatch[1].toUpperCase();
    }

    throw new Error(`Could not parse a valid Jira issue key from: "${input}". Expected format like PROJ-123 or https://your-org.atlassian.net/browse/PROJ-123`);
  }

  adfToPlainText(node) {
    if (!node) return '';
    if (typeof node === 'string') return node;

    let text = '';

    if (node.type === 'text') {
      text = node.text || '';
      if (node.marks) {
        node.marks.forEach(m => {
          if (m.type === 'strong') text = `**${text}**`;
          else if (m.type === 'code') text = `\`${text}\``;
          else if (m.type === 'em') text = `*${text}*`;
        });
      }
      return text;
    }

    if (node.type === 'hardBreak') {
      return '\n';
    }

    if (node.content && Array.isArray(node.content)) {
      const childTexts = node.content.map(child => this.adfToPlainText(child));
      
      if (node.type === 'paragraph') {
        return childTexts.join('') + '\n';
      } else if (node.type === 'heading') {
        const level = node.attrs?.level || 2;
        return `${'#'.repeat(level)} ${childTexts.join('')}\n`;
      } else if (node.type === 'bulletList') {
        return childTexts.map(c => `- ${c.trim()}`).join('\n') + '\n';
      } else if (node.type === 'orderedList') {
        return childTexts.map((c, i) => `${i + 1}. ${c.trim()}`).join('\n') + '\n';
      } else if (node.type === 'listItem') {
        return childTexts.join('').trim();
      } else if (node.type === 'codeBlock') {
        return `\`\`\`${node.attrs?.language || ''}\n${childTexts.join('')}\n\`\`\`\n`;
      }
      return childTexts.join('');
    }

    return '';
  }

  async fetchIssue(input) {
    const issueKey = this.parseIssueKey(input);
    const jiraConfig = configService.getJiraConfig();

    if (!jiraConfig.baseUrl || !jiraConfig.email || !jiraConfig.token) {
      throw new Error('Jira connection is not configured on the server. Please visit Settings to load your .env credentials.');
    }

    const auth = Buffer.from(`${jiraConfig.email}:${jiraConfig.token}`).toString('base64');
    const endpoint = `${jiraConfig.baseUrl}/rest/api/3/issue/${issueKey}`;

    let response;
    try {
      response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json'
        }
      });
    } catch (netErr) {
      throw new Error(`Network failure connecting to Jira (${jiraConfig.baseUrl}): ${netErr.message}`);
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(`Jira authentication failed (401). Verify JIRA_EMAIL and JIRA_TOKEN in Settings.`);
      } else if (response.status === 403) {
        throw new Error(`Jira permission denied (403). The authenticated user does not have permission to view issue ${issueKey}.`);
      } else if (response.status === 404) {
        throw new Error(`Jira issue "${issueKey}" was not found (404) on ${jiraConfig.baseUrl}. Please verify the issue key.`);
      } else {
        const errBody = await response.text();
        throw new Error(`Jira API returned HTTP ${response.status}: ${errBody.substring(0, 200)}`);
      }
    }

    const data = await response.json();
    const fields = data.fields || {};

    // Process Description
    let descriptionText = '';
    if (fields.description) {
      if (typeof fields.description === 'string') {
        descriptionText = fields.description;
      } else if (typeof fields.description === 'object') {
        descriptionText = this.adfToPlainText(fields.description);
      }
    }

    // Extract Acceptance Criteria if present in custom fields or inside description
    let acceptanceCriteria = '';
    for (const [key, val] of Object.entries(fields)) {
      if (key.startsWith('customfield_') && val) {
        const valStr = typeof val === 'object' ? this.adfToPlainText(val) : String(val);
        if (valStr.toLowerCase().includes('acceptance') || valStr.toLowerCase().includes('given') || valStr.toLowerCase().includes('scenario')) {
          acceptanceCriteria += `\n${valStr}`;
        }
      }
    }

    return {
      key: data.key,
      id: data.id,
      selfUrl: data.self,
      browseUrl: `${jiraConfig.baseUrl}/browse/${data.key}`,
      summary: fields.summary || 'No summary provided',
      description: descriptionText.trim() || 'Insufficient information to determine.',
      acceptanceCriteria: acceptanceCriteria.trim() || null,
      issueType: fields.issuetype?.name || 'Story',
      priority: fields.priority?.name || 'Medium',
      status: fields.status?.name || 'Open',
      project: {
        key: fields.project?.key,
        name: fields.project?.name
      },
      labels: fields.labels || [],
      components: (fields.components || []).map(c => c.name),
      reporter: fields.reporter?.displayName || 'Unknown',
      assignee: fields.assignee?.displayName || 'Unassigned'
    };
  }
}

module.exports = new JiraService();
