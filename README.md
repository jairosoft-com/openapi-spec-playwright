# Playwright Demo

A comprehensive testing framework that combines Playwright for browser automation with custom utilities for API testing against OpenAPI specifications.

## 🎯 Project Overview

This project provides a robust foundation for testing both web applications and APIs with:
- **Playwright** for browser automation and UI testing
- **Custom utilities** for API testing and debugging
- **Type-safe** response validation
- **Built-in debugging** with cURL command generation
- **OpenAPI specification** integration ready

## 📁 Project Structure

```
openapi-spec-playwright/
├── tests/                     # Test files
├── tests-examples/            # Test files examples
│   └── demo-todo-app.spec.ts  # Example TodoMVC test suite
├── api-docs/                 # OpenAPI documentation (ready for use)
├── ai-docs/                  # AI-generated documentation (ready for use)
├── playwright.config.ts      # Playwright configuration
├── package.json             # Dependencies and scripts
├── Taskfile.yaml            # Task management with Task
├── curlHelper.ts            # API debugging utilities
├── responseAsserts.ts       # Type-safe response validation
└── wrapper.ts               # Request wrapper with logging
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Task (optional, for enhanced task management)

### Installation

```bash
# Clone the repository
git clone https://github.com/raseniero/open-api-playwright.git
cd open-api-playwright

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

#### Using npm scripts:
```bash
# Run all tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests with debug mode
npx playwright test --debug
```

#### Using Task (recommended):
```bash
# Run all tests
task test

# Run tests with browser UI visible
task test:headed

# Run tests in debug mode
task test:debug

# Open Playwright UI for interactive testing
task test:ui

# View test reports
task report

# Install Playwright browsers
task install-browsers
```

## 🛠️ Core Components

### 1. API Testing with Prism Mock Server

The project includes **Prism** for creating mock servers from OpenAPI specifications:

#### **Starting the Mock Server**

```bash
# Start Prism mock server
npm run mock:start

# Start with dynamic responses
npm run mock:start:dynamic

# Validate OpenAPI specification
npm run mock:validate
```

#### **Using Task Commands**

```bash
# Start mock server
task mock:start

# Start with dynamic responses
task mock:start:dynamic

# Validate specification
task mock:validate
```

#### **OpenAPI Specification**

The project includes a comprehensive OpenAPI specification at `api-docs/openapi.yaml` with:
- **User management** endpoints (CRUD operations)
- **Todo management** endpoints (CRUD operations)
- **Authentication** with JWT bearer tokens
- **Error handling** with proper status codes
- **Pagination** support for list endpoints

#### **Running API Tests**

```bash
# Run API tests against mock server
npm test tests/api-mock.spec.ts

# Run with specific browser
npm test tests/api-mock.spec.ts --project=chromium
```

### 2. API Testing Utilities

#### `curlHelper.ts`
Converts Axios requests to cURL commands for debugging:

```typescript
import { CurlHelper } from './curlHelper';

const config = {
  method: 'POST',
  url: 'https://api.example.com/users',
  headers: { 'Content-Type': 'application/json' },
  data: { name: 'John Doe' }
};

const curl = new CurlHelper(config);
console.log(curl.generateCommand());
// Output: curl -X POST -H "Content-Type:application/json" --data '{"name":"John Doe"}' "https://api.example.com/users"
```

#### `responseAsserts.ts`
Type-safe assertion utilities for API responses:

```typescript
import { isAxiosResponse, isAxiosErrorResponse } from './responseAsserts';

// Validate successful responses
try {
  const response = await axios.get('/api/users');
  isAxiosResponse(response);
  // response is now typed as AxiosResponse
} catch (error) {
  isAxiosErrorResponse(error);
  // error is now typed as AxiosError with response
}
```

#### `wrapper.ts`
Request wrapper with automatic logging:

```typescript
import { sendRequest } from './wrapper';

// Wraps API calls with logging and error handling
const response = await sendRequest(axios.get, '/api/users');
// Automatically logs cURL command and response
```

### 2. Playwright Configuration

The project is configured for:
- **Multi-browser testing** (Chrome, Firefox, Safari)
- **Parallel test execution**
- **HTML reporting**
- **CI/CD optimizations**
- **Mobile viewport support** (commented out)

### 3. Example Test Suite

The `demo-todo-app.spec.ts` demonstrates:
- **Page Object patterns**
- **Helper functions** for common operations
- **Local storage validation**
- **Cross-browser compatibility**
- **Comprehensive UI testing**

## 📋 Available Scripts

The project includes convenient npm scripts for common testing tasks:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:ui": "playwright test --ui",
    "report": "playwright show-report",
    "install-browsers": "playwright install"
  }
}
```

### Quick Commands

```bash
# Run all tests
npm test

# Run tests with browser UI visible
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Open Playwright UI for interactive testing
npm run test:ui

# View test reports
npm run report

# Install Playwright browsers
npm run install-browsers
```

## 🎯 Task Management

The project includes a `Taskfile.yaml` for enhanced task management using [Task](https://taskfile.dev/). This provides a consistent interface for common development tasks:

### Task Commands

```bash
# Run all tests
task test

# Run tests with browser UI visible
task test:headed

# Run tests in debug mode
task test:debug

# Open Playwright UI for interactive testing
task test:ui

# View test reports
task report

# Install Playwright browsers
task install-browsers
```

### Installing Task

```bash
# macOS
brew install go-task

# Linux
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b ~/.local/bin

# Windows
scoop install task
```

## 🔧 Configuration

### Playwright Configuration

The `playwright.config.ts` includes:

- Test directory: `./tests`
- Test examples directory: `./tests-examples`
- Parallel execution enabled
- HTML reporter
- Trace collection on retry
- Multi-browser projects

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
# API Configuration
API_BASE_URL=https://api.example.com
API_KEY=your-api-key

# Test Configuration
HEADLESS=false
SLOW_MO=1000
```

## 🧪 Writing Tests

### UI Testing Example

```typescript
import { test, expect } from '@playwright/test';

test('should add todo item', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  
  const newTodo = page.getByPlaceholder('What needs to be done?');
  await newTodo.fill('Buy groceries');
  await newTodo.press('Enter');
  
  await expect(page.getByTestId('todo-title')).toHaveText(['Buy groceries']);
});
```

### API Testing Example

```typescript
import { test, expect } from '@playwright/test';
import { sendRequest } from '../wrapper';
import axios from 'axios';

test('should create user', async () => {
  const response = await sendRequest(
    axios.post,
    '/api/users',
    { name: 'John Doe', email: 'john@example.com' }
  );
  
  expect(response.status).toBe(201);
  expect(response.data).toHaveProperty('id');
});
```

## 🔍 Debugging

### Viewing Test Reports

```bash
# Generate HTML report
npx playwright test --reporter=html

# Open the report
npx playwright show-report
```

### Debug Mode

```bash
# Run tests with debug mode
npx playwright test --debug

# Run specific test in debug mode
npx playwright test demo-todo-app.spec.ts --debug
```

### API Request Debugging

The `sendRequest` wrapper automatically logs:
- cURL commands for reproduction
- Request/response data
- Error details with status codes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check the Playwright documentation
- Review the example test suite

---

**Built with ❤️ using Playwright and TypeScript**
