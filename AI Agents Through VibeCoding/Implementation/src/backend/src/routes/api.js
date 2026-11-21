const express = require('express');
const router = express.Router();
const configService = require('../services/configService');
const jiraService = require('../services/jiraService');
const llmService = require('../services/llmService');
const templateService = require('../services/templateService');

// Get current masked configuration status
router.get('/config/status', (req, res) => {
  try {
    const status = configService.getStatus();
    res.json({ success: true, data: status });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update configuration from pasted .env text
router.post('/config/load', (req, res) => {
  try {
    const { envContent } = req.body;
    if (!envContent) {
      return res.status(400).json({ success: false, error: 'envContent is required in request body.' });
    }
    const updatedStatus = configService.updateFromPastedEnv(envContent);
    res.json({ success: true, message: 'Configuration loaded successfully.', data: updatedStatus });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Fetch Jira issue metadata
router.get('/jira/issue/:key', async (req, res) => {
  try {
    const rawInput = req.params.key;
    const issue = await jiraService.fetchIssue(rawInput);
    res.json({ success: true, data: issue });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Generate document (Test Plan, Test Strategy, or Test Cases)
router.post('/generate', async (req, res) => {
  try {
    const { ticketInput, artifactType, notes, model } = req.body;

    if (!ticketInput) {
      return res.status(400).json({ success: false, error: 'Jira ticket key or URL is required.' });
    }

    const type = artifactType || 'test-plan';

    // Step 1: Retrieve Jira issue
    const issue = await jiraService.fetchIssue(ticketInput);

    // Step 2: Generate QA Document using LLM
    const generationResult = await llmService.generateDocument({
      issue,
      artifactType: type,
      notes: notes || '',
      modelOverride: model
    });

    res.json({
      success: true,
      data: {
        ...generationResult,
        issueSummary: issue.summary,
        issueType: issue.issueType,
        issuePriority: issue.priority,
        jiraBrowseUrl: issue.browseUrl
      }
    });
  } catch (err) {
    console.error('Generation endpoint error:', err.message);
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
