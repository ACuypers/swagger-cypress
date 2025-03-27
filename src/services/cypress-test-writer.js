const fs = require('fs').promises;
const path = require('path');
const config = require('../../config/config');

class CypressTestWriter {
  constructor() {
    this.testsDir = config.outputDir || path.join(process.cwd(), 'cypress', 'e2e');
  }

  async writeTests(tests) {
    try {
      // Ensure the tests directory exists
      await fs.mkdir(this.testsDir, { recursive: true });

      // Write each endpoint's tests to a separate file
      for (const { endpoint, testCases } of tests) {
        const fileName = this.generateFileName(endpoint);
        const filePath = path.join(this.testsDir, fileName);
        
        const testContent = this.generateTestContent(endpoint, testCases);
        await fs.writeFile(filePath, testContent);
        
        console.log(`Created test file: ${fileName}`);
      }
    } catch (error) {
      throw new Error(`Failed to write Cypress tests: ${error.message}`);
    }
  }

  generateFileName(endpoint) {
    const sanitizedPath = endpoint.path
      .replace(/\//g, '-')
      .replace(/[{}]/g, '')
      .replace(/^-+|-+$/g, '');
    return `${sanitizedPath}-${endpoint.method.toLowerCase()}.cy.js`;
  }

  generateTestContent(endpoint, testCases) {
    return `describe('${endpoint.method.toUpperCase()} ${endpoint.path}', () => {
    ${testCases}
});`;
  }
}

module.exports = new CypressTestWriter();