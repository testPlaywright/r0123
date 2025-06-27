```markdown
# orx-cat-automation

This repository contains automation test cases for the CAT Application.

## Instructions to Run the App

### Prerequisites
You will need to start an **elevated** PowerShell or Command Prompt session to install Cypress. Hold the `Shift` key while right-clicking the PowerShell shortcut to bring up the context-sensitive menu.

### Steps
1. Set the npm registry:
    ```bash
    npm config set registry https://repo1.uhc.com/artifactory/api/npm/npm-remote/
    ```
2. Clone the repository:
    ```bash
    git clone https://github.com/optum-rx-pbm/orx-cat-automation.git
    ```
3. Open PowerShell with Administrator access and install Cypress:
    ```bash
    npm install cypress --save-dev
    ```
4. Install project dependencies:
    ```bash
    npm install
    ```
5. Launch Cypress in headless mode:
    ```bash
    npx cypress run
    ```
6. Launch Cypress in headed mode:
    ```bash
    npx cypress open
    ```

### Debugging and GUI Mode
1. After launching Cypress in headed mode, select **E2E Testing**.
2. Choose the browser `Electron`.
3. Start E2E testing in `Electron`.
4. Select a spec file to run (e.g., `CreateTicket.cy.js`). Note: Each spec must be run individually.
5. Wait for the tests to load.

### Running Tests in Headless Mode and Generating Reports
Run the following command to execute all tests and generate a report automatically:
```bash
npm run test
```

## Create a `.env` File
Add the following to a local `.env` file (this file **should not be checked in**) in the root folder:
```
BASE_URL=https://rxc-cat-dev.optum.com/tickets
USERNAME=YOUR MSID #### bypassed in dev env
PASSWORD=YOUR MSID PASSWORD #### bypassed in dev env
```

## Best Practices
Refer to the [Cypress Best Practices Guide](https://docs.cypress.io/guides/references/best-practices).

## Updating Packages
Follow these steps to update dependencies:
1. Log in to the npm registry:
    ```bash
    npm login http://repo1.uhc.com/artifactory/api/npm/npm-virtual
    ```
2. Update dependencies:
    ```bash
    npx npm-check-updates -u
    npm install
    ```
```