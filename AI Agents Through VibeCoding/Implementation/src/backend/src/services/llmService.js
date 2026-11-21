const configService = require('./configService');
const templateService = require('./templateService');

class LlmService {
  async generateDocument({ issue, artifactType, notes, modelOverride }) {
    const llmConfig = configService.getLlmConfig();
    const token = llmConfig.groqToken;
    const model = modelOverride || llmConfig.groqModel || 'openai/gpt-oss-120b';

    if (!token) {
      throw new Error('Groq API Key is not configured on the server. Please visit Settings to load your .env credentials.');
    }

    const templateContent = templateService.getTemplate(artifactType);
    const meta = templateService.getMetadataForType(artifactType);

    const systemPrompt = `You are an expert QA Automation Architect and Principal Quality Engineer.
Your task is to generate a comprehensive, production-grade quality document strictly adhering to the provided template structure.

CRITICAL INSTRUCTIONS & PARAMETERS:
1. STRUCTURE & SECTIONS:
   - You must reproduce the exact section titles, section numbers, order, ASCII diagrams, and markdown table column headers as defined in the TEMPLATE below.
   - Do NOT omit any section, table, or standard field from the template.

2. GROUNDING & FIDELITY:
   - Ground every factual statement directly in the provided JIRA ISSUE DATA and USER NOTES.
   - For any template field, environment, URL, or detail NOT provided in the input, you MUST write exactly:
     "Insufficient information to determine."
   - If you must make an architectural or testing inference, you MUST label it explicitly as:
     "Inference (low confidence): <explanation>"
   - Proposed test activities, test cases, and strategy scopes must be clearly presented as proposals based on the story requirements, NOT confirmed product facts.
   - Do NOT invent unstated APIs, credentials, server IPs, endpoints, or software versions.

3. TEMPLATE TYPE:
   - Generating: ${meta.title} (${meta.standard})
   - Purpose: ${meta.tagline}

TEMPLATE TO FOLLOW STRICTLY:
"""
${templateContent}
"""`;

    const userPrompt = `Generate the ${meta.title} for the following Jira Ticket:

JIRA TICKET INFORMATION:
- Key: ${issue.key}
- Summary: ${issue.summary}
- Issue Type: ${issue.issueType}
- Priority: ${issue.priority}
- Status: ${issue.status}
- Project: ${issue.project?.name || issue.project?.key || 'N/A'} (${issue.project?.key || ''})
- Labels: ${(issue.labels || []).join(', ') || 'None'}
- Components: ${(issue.components || []).join(', ') || 'None'}
- Reporter: ${issue.reporter}
- Assignee: ${issue.assignee}
- Jira URL: ${issue.browseUrl || issue.selfUrl}

DESCRIPTION & ACCEPTANCE CRITERIA:
${issue.description}
${issue.acceptanceCriteria ? `\nADDITIONAL ACCEPTANCE CRITERIA:\n${issue.acceptanceCriteria}` : ''}

${notes ? `TESTER NOTES / ADDITIONAL CONSTRAINTS:\n${notes}\n` : ''}

Generate the complete markdown document now, starting directly with the title and Document ID header as formatted in the template. Populate every section thoughtfully according to the instructions.`;

    const requestBody = JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1,
      max_tokens: 4096
    });

    let response;
    try {
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: requestBody
      });
    } catch (netErr) {
      throw new Error(`Network failure calling Groq AI provider: ${netErr.message}`);
    }

    if (!response.ok) {
      const errText = await response.text();
      let parsed;
      try { parsed = JSON.parse(errText); } catch(e) {}
      const errMsg = parsed?.error?.message || errText;
      throw new Error(`Groq AI API error (${response.status}): ${errMsg}`);
    }

    const result = await response.json();
    const generatedMarkdown = result.choices?.[0]?.message?.content;

    if (!generatedMarkdown) {
      throw new Error('Groq AI returned an empty response.');
    }

    return {
      markdown: generatedMarkdown,
      modelUsed: model,
      artifactType,
      issueKey: issue.key,
      generatedAt: new Date().toISOString()
    };
  }
}

module.exports = new LlmService();
