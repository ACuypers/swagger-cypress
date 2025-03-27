require('dotenv').config();

module.exports = {
    openaiApiKey: process.env.OPENAI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    swaggerUrl: process.env.SWAGGER_URL,
    outputDir: process.env.OUTPUT_DIR
};