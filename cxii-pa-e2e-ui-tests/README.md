# Data Driven Playwright Framework

This repository contains an automated data-driven test framework built with Playwright.
It supports modular test design, multi-language validation, reporting, and integration with CI/CD pipelines.

# 📂 Project Structure

```
DATA_DRIVEN/

├── 📁 .github/ # GitHub workflows (CI/CD pipelines)
├── 📊 allure-report/ # Allure report artifacts
├── 📑 allure-results/ # Allure raw test results
├── 📦 modules/ # Business logic modules
│ ├── 🛒 Commerce/ # Commerce-related tests
│ ├── ⚙️ Core/ # Core reusable utilities
│ └── 💼 SalesAndService/ # Sales and service test modules
├── 🎭 playwright/ # Playwright configuration and helpers
├── 📚 resources/ # Test resources (data, configs, assets)
├── 📝 test-results/ # Playwright test results
├── 🧪 tests/ # Automated test cases
│ └── 🖥️ ui/ # UI test specs
├── 👤 user-data/ # User-specific test data
├── ⚙️ .env.* # Environment-specific config files
├── 🐳 Dockerfile # Docker setup for containerized runs
├── 🔧 Jenkinsfile # Jenkins pipeline configuration
├── 🚀 open-Allure.sh # Script to generate & open Allure reports
├── 📦 package.json # Project dependencies & scripts
├── 🎭 playwright.config.ts # Playwright test runner configuration
└── 📘 tsconfig.json # TypeScript configuration
```

# Features

```
Data-Driven Testing → Runs tests with multiple datasets
Playwright Integration → Cross-browser E2E testing
Allure Reporting → Rich HTML reports with test history
Multi-Language Support → Validates in English, German, Spanish, French, Hindi, etc.
CI/CD Ready → Integrated with Jenkins & GitHub Actions
Dockerized → Consistent test execution across environments
```

## 🔄 New Enhancements
```
Path Aliases (tsconfig.json)

Introduced alias imports for cleaner and more readable module references.

Example:

Before: import { LoginPage } from '../modules/Core/login.e2e';

After: import { LoginPage } from '@core/login.e2e';

Transaction Reporter (transaction-reporter.ts)

Generates a unique ID for each test case execution.

Improves traceability and debugging across environments.

Test Data Enhancements

Added new datasets for data-driven execution:

tests/ui/testData.json → Web UI test data

tests/ui/testDataChrome.json → Chrome Extension test data

Enables consistent execution across multiple datasets.

Test Case Updates

Updated: tests/ui/AIToolKit.spec.ts & tests/ui/ChromeExtension.spec.ts.

Introduced forEach loops to dynamically run test cases across datasets.

Environment Flexibility

Framework now runs seamlessly across environments (e.g., Dev, Canary).

Environment configs managed via .env files and playwright.config.ts.

Parallel Execution (playwright.config.ts)

Split execution for AIToolKit and ChromeExtension.

Configured independent workers for true parallel test execution.

Modules Folder Enhancements

Refactored scripts with:

Parameterized flows

Data-driven logic

Conditional branching

Step-level assertions
```

## Setup
# Access for Allure-Report
https://myaccess.microsoft.com/@sap.onmicrosoft.com#/access-packages/d55ad7db-69af-4da5-8520-de187364513d
The access will remain valid for one year and will be auto-approved. Users will receive access within a minute.

## Clone Repository

```
git clone <repo-url>
cd DATA_DRIVEN
```

## Install Dependencies

```
npm install
```

## Run Tests

```
npx playwright test
```

## Run Tests with Allure Reporting

```
npx playwright test --reporter=line,allure-playwright
```

## Generate and open report:
```
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

## Environment Setup

```
The framework supports multiple environments:
.env.dev – Development
.env.canary – Canary / Pre-prod
.env.prod – Production
```

## Set environment before running:

```
export ENV=dev
npx playwright test
```

## Reports

```
Playwright HTML Reports → Default test results
Allure Reports → Advanced visualization with steps, logs, screenshots

Open Allure report manually:
sh open-Allure.sh
```

## CI/CD Integration

```
GitHub Actions → .github/workflows/
Jenkins → Jenkinsfile
Docker → Run tests inside containers for consistency
```

## Contribution Guidelines

```
Fork the repo & create a branch (feature/your-feature)
Commit changes with meaningful messages
Raise a PR for review
Ensure tests are passing before merge
```

## Tech Stack

```
Playwright – Test runner
TypeScript – Test scripting
Allure – Reporting
Jenkins/GitHub Actions – CI/CD
Docker – Containerized execution
cxii-pa-e2e-ui-tests

End-to-end UI and API tests for the CX AI Toolkit.
This extends the framework with API + UI validation for AI-driven business workflows.
```

## Run Locally

```
The easiest way is to use the provided script:
./run.sh
```

## For available options:

./run.sh --help

## Playwright Command Line Options

```
Here are the most common commands:
Run all tests
npx playwright test

Run a single test file
npx playwright test tests/todo-page.spec.ts

Run a set of test files
npx playwright test tests/todo-page/ tests/landing-page/

Run files that have my-spec or my-spec-2 in the filename
npx playwright test my-spec my-spec-2

Run tests at a specific line
npx playwright test my-spec.ts:42

Run a test by title
npx playwright test -g "add a todo item"

Run tests in headed browsers
npx playwright test --headed

Run all tests against a specific project
npx playwright test --project=chromium

Disable parallelization
npx playwright test --workers=1

Choose a reporter
npx playwright test --reporter=dot

Debug mode with Playwright Inspector
npx playwright test --debug

Interactive UI mode (preview)
npx playwright test --ui
```

## Help

```
npx playwright test --help
```

Code generator

```
npx playwright codegen
```

Run Allure Report

```
allure open allure-report
```