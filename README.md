# Swagger to Cypress Test Generator
# 

This tool automatically generates Cypress API tests from Swagger/OpenAPI specifications using AI. It supports both OpenAI and Anthropic's Claude for test case generation.

## Features

- Parses Swagger/OpenAPI specifications from URLs
- Generates comprehensive Cypress test cases using AI
- Supports multiple AI providers (OpenAI GPT-4 and Anthropic Claude)
- Creates separate test files for each API endpoint
- Generates tests covering happy paths, error scenarios, edge cases, and parameter validation

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- API key from either OpenAI or Anthropic
- A Swagger/OpenAPI specification URL

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd swagger-cypress
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your configuration:
```env
# Choose one or both AI providers
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Your Swagger/OpenAPI specification URL
SWAGGER_URL=your_swagger_url_here

# Optional: Custom output directory for generated tests
OUTPUT_DIR=cypress/e2e
```

## Usage

1. Generate Cypress tests from your Swagger specification:
```bash
npm run generate-tests
```

## Generated Test Structure

The tool generates separate test files for each API endpoint in your Swagger specification. The files are named according to the endpoint path and method:

- Example: `users-get.cy.js` for a GET request to `/users`

Each test file includes:
- Happy path scenarios
- Error scenarios
- Edge cases
- Parameter validation
- Response validation

## Configuration

### AI Provider Selection

The tool will use:
- Anthropic Claude if `ANTHROPIC_API_KEY` is configured
- OpenAI GPT-4 if `OPENAI_API_KEY` is configured
- Anthropic Claude by default if both are configured

### Output Directory

By default, tests are generated in `cypress/e2e`. You can change this by setting the `OUTPUT_DIR` environment variable.

## Example

Given a Swagger endpoint:
```yaml
/users:
  get:
    summary: Get user by ID
    parameters:
      - name: id
        in: query
        required: true
        schema:
          type: string
    responses:
      200:
        description: Successful response
      404:
        description: User not found
```

The tool will generate a test file like:
```javascript
describe('GET /users', () => {
  it('should return user data for valid ID', () => {
    cy.request({
      method: 'GET',
      url: '/users',
      qs: { id: '123' }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id');
    });
  });

  it('should return 404 for non-existent user', () => {
    cy.request({
      method: 'GET',
      url: '/users',
      qs: { id: '999' },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});
```

## Troubleshooting

1. **API Key Issues**
   - Ensure your API keys are correctly set in the `.env` file
   - Check if your API keys have sufficient credits/permissions

2. **Swagger URL Issues**
   - Verify the Swagger URL is accessible
   - Ensure the URL points to a valid Swagger/OpenAPI specification

3. **Test Generation Issues**
   - Check the console output for detailed error messages
   - Verify your Swagger specification is valid

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Citation 💡

If you use Swagger to Cypress Test Generator in your research or project, please cite:

@software{swagger-cypress,
  author = {Allan Gomes Cuypers},
  title = {Swagger to Cypress Test Generator},
  year = {2025},
  publisher = {GitHub},
  url = {https://github.com/ACuypers/swagger-cypress}
}