class PageNavigator {
  static visitWithRetry(urlPath, options = {}) {
    const {
      selector = null,
      retries = 3,
      waitMs = 3000
    } = options;

    let attempt = 0;

    const tryVisit = () => {
      cy.log(`Attempt ${attempt + 1} to check rate limit...`);

      cy.request({
        url: urlPath,
        failOnStatusCode: false
      }).then((res) => {
        if (res.status === 429 && attempt < retries) {
          const backoff = waitMs * Math.pow(2, attempt); // ⬅️ Exponential backoff
          cy.log(`🚧 Got 429. Retrying after ${backoff}ms`);
          attempt++;

          cy.wait(backoff).then(tryVisit); // ⬅️ Retry recursively within Cypress chain
        } else if (res.status >= 200 && res.status < 300) {
          cy.log(`✅ Server healthy. Visiting: ${urlPath}`);

          if (selector) {
            cy.get(selector, { timeout: 10000 }).click({ force: true });
          } else {
            cy.visit(urlPath);
          }
        } else {
          throw new Error(`❌ visit failed with status ${res.status}`);
        }
      });
    };

    tryVisit(); // ⬅️ Initial attempt
  }
}

export default PageNavigator;
