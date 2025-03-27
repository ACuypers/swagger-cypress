const SwaggerParser = require('@apidevtools/swagger-parser');
const axios = require('axios');

class SwaggerParserService {
    constructor() {
        this.parser = new SwaggerParser();
    }

    async parseSwaggerFile(filePath) {
        try {
            const api = await this.parser.parse(filePath);
            return api;
        } catch (error) {
            throw new Error(`Failed to parse Swagger file: ${error.message}`);
        }
    }

    async parseSwaggerUrl(url) {
        try {
            const api = await this.parser.parse(url);
            return api;
        } catch (error) {
            throw new Error(`Failed to parse Swagger URL: ${error.message}`);
        }
    }

  extractEndpointDetails(api) {
    const endpoints = [];
    
    for (const [path, pathItem] of Object.entries(api.paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        endpoints.push({
          path,
          method,
          summary: operation.summary,
          parameters: operation.parameters || [],
          responses: operation.responses
        });
      }
    }

    return endpoints;
  }
}

module.exports = new SwaggerParserService();