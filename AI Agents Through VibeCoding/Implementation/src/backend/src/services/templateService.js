const fs = require('fs');
const path = require('path');

class TemplateService {
  constructor() {
    this.templateDirs = [
      path.resolve(__dirname, '../templates'),
      path.resolve(process.cwd(), 'src/backend/templates'),
      path.resolve(process.cwd(), 'templates'),
      path.resolve(__dirname, '../../../../../Template'),
      path.resolve(__dirname, '../../../../Template'),
      path.resolve(process.cwd(), 'Template'),
      path.resolve(process.cwd(), '../../Template')
    ];
    this.templates = {};
    this.loadTemplates();
  }

  loadTemplates() {
    const templateFiles = {
      'test-plan': 'Master_Test_Plan_Template.md',
      'test-strategy': 'Enterprise_Test_Strategy_Template.md',
      'test-cases': 'Test_Cases_and_RTM_Template.md'
    };

    for (const [key, filename] of Object.entries(templateFiles)) {
      for (const dir of this.templateDirs) {
        const fullPath = path.join(dir, filename);
        if (fs.existsSync(fullPath)) {
          try {
            this.templates[key] = fs.readFileSync(fullPath, 'utf8');
            break;
          } catch (e) {
            console.error(`Error loading template ${filename}:`, e.message);
          }
        }
      }
    }
  }

  getTemplate(type) {
    const key = (type || 'test-plan').toLowerCase().trim();
    if (this.templates[key]) {
      return this.templates[key];
    }
    // Fallback if not loaded
    this.loadTemplates();
    return this.templates[key] || '';
  }

  getMetadataForType(type) {
    const meta = {
      'test-plan': {
        title: 'Master Test Plan',
        standard: 'ISO/IEC/IEEE 29119',
        tagline: 'Scope, gaps, scenarios, risks and a human review gate',
        templateName: 'Master_Test_Plan_Template.md'
      },
      'test-strategy': {
        title: 'Enterprise Test Strategy',
        standard: 'Quality Engineering & Automation Pyramid',
        tagline: 'Enterprise test pyramid, quality gates, non-functional SLAs, and governance metrics',
        templateName: 'Enterprise_Test_Strategy_Template.md'
      },
      'test-cases': {
        title: 'Test Cases & Requirement Traceability Matrix (RTM)',
        standard: 'BDD / Atomic Verification Standards',
        tagline: 'Atomic test cases, positive/negative/boundary/security scenarios, and RTM matrix',
        templateName: 'Test_Cases_and_RTM_Template.md'
      }
    };
    return meta[type] || meta['test-plan'];
  }
}

module.exports = new TemplateService();
