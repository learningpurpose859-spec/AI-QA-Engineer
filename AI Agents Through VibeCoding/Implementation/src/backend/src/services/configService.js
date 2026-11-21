const fs = require('fs');
const path = require('path');

class ConfigService {
  constructor() {
    this.config = {
      jiraBaseUrl: '',
      jiraEmail: '',
      jiraToken: '',
      groqToken: '',
      groqModel: 'openai/gpt-oss-120b',
      ollamaBaseUrl: ''
    };
    this.envFilePaths = [
      path.resolve(process.cwd(), '.env'),
      path.resolve(process.cwd(), '../../.env'),
      path.resolve(__dirname, '../../../../../.env'),
      path.resolve(__dirname, '../../../../.env'),
      path.resolve(__dirname, '../../../.env'),
      path.resolve(__dirname, '../../.env')
    ];
    this.loadInitialConfig();
  }

  loadInitialConfig() {
    // 1. Read from process.env (Vercel serverless environment variables)
    if (process.env.JIRA_BASE_URL || process.env.JIRA_URL) {
      this.config.jiraBaseUrl = process.env.JIRA_BASE_URL || process.env.JIRA_URL;
    }
    if (process.env.JIRA_EMAIL) {
      this.config.jiraEmail = process.env.JIRA_EMAIL;
    }
    if (process.env.JIRA_TOKEN || process.env.JIRA_API_TOKEN) {
      this.config.jiraToken = process.env.JIRA_TOKEN || process.env.JIRA_API_TOKEN;
    }
    if (process.env.GROQ_TOKEN || process.env.GROQ_API_KEY) {
      this.config.groqToken = process.env.GROQ_TOKEN || process.env.GROQ_API_KEY;
    }
    if (process.env.GROQ_MODEL) {
      this.config.groqModel = process.env.GROQ_MODEL;
    }
    if (process.env.OLLAMA_BASE_URL) {
      this.config.ollamaBaseUrl = process.env.OLLAMA_BASE_URL;
    }

    // 2. Read from local .env files if present
    for (const p of this.envFilePaths) {
      if (fs.existsSync(p)) {
        try {
          const content = fs.readFileSync(p, 'utf8');
          this.parseAndApply(content);
          this.activeEnvPath = p;
          break;
        } catch (e) {
          console.error(`Error reading .env at ${p}:`, e.message);
        }
      }
    }
  }

  parseAndApply(content) {
    const lines = content.split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // remove surrounding quotes if any
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }

        if (key === 'JIRA_BASE_URL' || key === 'JIRA_URL') {
          this.config.jiraBaseUrl = value;
        } else if (key === 'JIRA_EMAIL') {
          this.config.jiraEmail = value;
        } else if (key === 'JIRA_TOKEN' || key === 'JIRA_API_TOKEN') {
          this.config.jiraToken = value;
        } else if (key === 'GROQ_TOKEN' || key === 'GROQ_API_KEY') {
          this.config.groqToken = value;
        } else if (key === 'GROQ_MODEL') {
          this.config.groqModel = value;
        } else if (key === 'OLLAMA_BASE_URL') {
          this.config.ollamaBaseUrl = value;
        }
      }
    });
  }

  updateFromPastedEnv(rawContent) {
    if (!rawContent || typeof rawContent !== 'string') {
      throw new Error('No .env content provided');
    }
    this.parseAndApply(rawContent);

    // Save back to active .env path
    const targetPath = this.activeEnvPath || this.envFilePaths[0];
    try {
      fs.writeFileSync(targetPath, rawContent, 'utf8');
      this.activeEnvPath = targetPath;
    } catch (e) {
      console.warn('Could not write updated .env to disk:', e.message);
    }

    return this.getStatus();
  }

  getStatus() {
    const hasJiraToken = !!(this.config.jiraToken && this.config.jiraToken.length > 5);
    const hasJiraEmail = !!(this.config.jiraEmail && this.config.jiraEmail.includes('@'));
    const hasJiraUrl = !!(this.config.jiraBaseUrl && this.config.jiraBaseUrl.startsWith('http'));
    const isJiraReady = hasJiraToken && hasJiraEmail && hasJiraUrl;

    const hasGroqToken = !!(this.config.groqToken && this.config.groqToken.length > 5);

    return {
      jiraBaseUrl: this.config.jiraBaseUrl || 'https://arvindalagesan.atlassian.net/',
      jiraConfigured: isJiraReady,
      jiraCredentialsDisplay: isJiraReady ? 'Configured securely on server' : 'Not configured',
      jiraStatusText: isJiraReady ? 'Ready' : 'Incomplete configuration',
      optionalProvider: hasGroqToken ? 'Groq configured on server' : 'Not configured',
      groqConfigured: hasGroqToken,
      groqModel: this.config.groqModel || 'openai/gpt-oss-120b',
      localOllama: 'Insufficient information to determine.',
      llmStatusText: 'Server-only configuration'
    };
  }

  getJiraConfig() {
    return {
      baseUrl: this.config.jiraBaseUrl.replace(/\/+$/, ''),
      email: this.config.jiraEmail,
      token: this.config.jiraToken
    };
  }

  getLlmConfig() {
    return {
      groqToken: this.config.groqToken,
      groqModel: this.config.groqModel || 'openai/gpt-oss-120b',
      ollamaBaseUrl: this.config.ollamaBaseUrl
    };
  }
}

module.exports = new ConfigService();
