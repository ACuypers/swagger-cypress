const swaggerParser = require('./src/services/swagger-parser');
const aiTestGenerator = require('./src/services/ai-test-generator');
const cypressTestWriter = require('./src/services/cypress-test-writer');
const config = require('./config/config');

async function generateTests() {
    try {
        console.log('Starting test generation process...');
        
        // 1. Parse Swagger specification
        console.log('Parsing Swagger specification...');
        const swaggerSpec = await swaggerParser.parseSwaggerUrl(config.swaggerUrl);
        const endpoints = swaggerParser.extractEndpointDetails(swaggerSpec);
        
        // 2. Generate tests for each endpoint using AI
        console.log('Generating tests using AI...');
        const allTests = [];
        
        for (const endpoint of endpoints) {
            console.log(`Generating tests for ${endpoint.method} ${endpoint.path}`);
            const testCases = await aiTestGenerator.generateTestCases(endpoint);
            allTests.push({
                endpoint,
                testCases
            });
        }
        
        // 3. Write Cypress tests
        console.log('Writing Cypress tests...');
        await cypressTestWriter.writeTests(allTests);
        
        console.log('Test generation completed successfully!');
    } catch (error) {
        console.error('Error generating tests:', error);
        process.exit(1);
    }
}

// Run the generator if this file is executed directly
if (require.main === module) {
    generateTests();
}

module.exports = { generateTests }; 