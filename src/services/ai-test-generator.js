const { OpenAI } = require('openai');
const { Anthropic } = require('@anthropic-ai/sdk');
const config = require('../../config/config');

class AITestGenerator {
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey
    });
    this.anthropicClient = new Anthropic({
      apiKey: config.anthropicApiKey
    });
  }

  async generateTests(swaggerSpec) {
    try {
      const endpoints = this.extractEndpoints(swaggerSpec);
      const tests = [];
      
      for (const endpoint of endpoints) {
        const testCases = await this.generateTestCases(endpoint);
        tests.push({ endpoint, testCases });
      }
      
      return tests;
    } catch (error) {
      throw new Error(`Failed to generate tests: ${error.message}`);
    }
  }

  async generateTestCases(endpoint, provider = 'anthropic') {
    const prompt = this.createTestGenerationPrompt(endpoint);
    
    try {
      if (provider === 'anthropic' && config.anthropicApiKey) {
        return await this.generateWithAnthropic(prompt);
      } else if (config.openaiApiKey) {
        return await this.generateWithOpenAI(prompt);
      } else {
        throw new Error('No AI provider API key configured');
      }
    } catch (error) {
      console.error('Error generating tests with AI:', error);
      throw error;
    }
  }

  createTestGenerationPrompt(endpoint) {
    return `Generate Cypress test cases for the following API endpoint:

Endpoint Details:
- Path: ${endpoint.path}
- Method: ${endpoint.method}
- Description: ${endpoint.summary || 'No description available'}

Parameters:
${this.formatParameters(endpoint.parameters)}

Expected Responses:
${this.formatResponses(endpoint.responses)}

Please generate Cypress test cases that cover:
1. Happy path scenarios (successful requests)
2. Error scenarios (invalid inputs, server errors)
3. Edge cases
4. Parameter validation 

Format the output as Cypress test cases using the following structure:
it('should...', () => {
    cy.request({
        method: '${endpoint.method}',
        url: urlRequest + '${endpoint.path}',
        // Add request body/parameters as needed
    }).then((response) => {
        // Add assertions
    });
});

Include multiple test cases with different scenarios.`;
  }

  formatParameters(parameters) {
    if (!parameters || parameters.length === 0) {
      return 'No parameters defined';
    }
    return parameters.map(param => 
      `- ${param.name} (${param.in}): ${param.description || 'No description'}`
    ).join('\n');
  }

  formatResponses(responses) {
    if (!responses) {
      return 'No response definitions available';
    }
    return Object.entries(responses)
      .map(([code, response]) => 
        `- ${code}: ${response.description || 'No description'}`
      )
      .join('\n');
  }

  async generateWithAnthropic(prompt) {
    const response = await this.anthropicClient.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });
    return response.content[0].text;
  }

  async generateWithOpenAI(prompt) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000
    });
    return response.choices[0].message.content;
  }
}

module.exports = new AITestGenerator();