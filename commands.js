// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
import { BASE_URL, CANCEL, CLICKED, PASSWORD, USERNAME } from "./constants";
require("dotenv").config();

Cypress.Commands.add("loginApi", (msid, password) => {
  
  const appSession = Cypress.env('appSession');
  const cookieTime = Cypress.env('cookieTime');
  const sessionTimeout = 25 * 60 * 1000; // Example: 25 minutes session timeout ( -5 minutes for safety)

  if (appSession && cookieTime) {
    const currentTime = new Date().getTime();
    const sessionAge = currentTime - new Date(cookieTime).getTime();

    // If the session is still valid, skip login
    if (sessionAge < sessionTimeout) {
      console.log('Reusing existing session');
      return;
    }
  }
  cy
    .request({
      method: "GET",
      url: BASE_URL,
      failOnStatusCode: false, 
    })
    .then((response) => {
      const locationUrl = getLocationUrl(response);
      const authVerification = getAuthVerification(response);

      console.log("First location: ", location);
      console.log("First auth_verification: ", authVerification);

      Cypress.env("auth_verification", authVerification);

      cy
        .request({
          method: "GET",
          url: locationUrl,
        })
        .then((response) => {
          const location = getLoc(response);

          console.log("2nd location: ", location);

          cy
            .request({
              method: "POST",
              url: location,
              form: true,
              body: {
                "pf.username": USERNAME,
                "pf.pass": PASSWORD,
                "pf.ok": CLICKED,
                "pf.cancel": CANCEL,
              },
            })
            .then((response) => {
              const redirectUrl = getRedirectUrl(response);

              console.log("redirectUrl: ", redirectUrl);

              cy
                .request({
                  method: "GET",
                  url: redirectUrl,
                  headers: {
                    Cookie: "auth_verification=" + Cypress.env("auth_verification"),
                  },
                })
                .then((response) => {
                  const appSession = getAppSession(response);
                  const date = new Date();
                  Cypress.env("cookieTime", date);
                  Cypress.env("appSession", appSession);
  
                });
            });
        });
    });
});

const getLocationUrl = (response) => {
  const responseHeaders = response.allRequestResponses[0]["Response Headers"];
  const location = responseHeaders["location"];

  return location;
};
//
const getAuthVerification = (response) => {
  const cookieHeader = response.headers["set-cookie"][0];
  const authVerification = extractValueFromCookie(cookieHeader, "auth_verification");

  return authVerification;
};

const getLoc = (response) => {
  const responseHeaders = response.allRequestResponses[0]["Response Headers"];
  const location = responseHeaders["location"];

  return location;
};

const getRedirectUrl = (response) => {
  const redirectRegex = /^\S+ (.+)$/; // Match non-whitespace characters followed by a space and capture the rest
  const match = redirectRegex.exec(response.redirects[0]);

  return match ? match[1] : null; // Return the captured URL or null if not found
};

const getAppSession = (response) => {
  const appSessionHeader = response.headers["set-cookie"];

  return appSessionHeader;
};

const extractValueFromCookie = (cookie, key) => {
  const [value] =
    cookie
      .split(";")
      .find((part) => part.startsWith(`${key}=`))
      ?.split("=") || [];

  return value;
};

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

//This code will ensure that we are able to see logs in Headless Runs
Cypress.Commands.overwrite("log", function (log, ...args) {
  if (Cypress.browser.isHeadless) {
    return cy.task("log", args, { log: false }).then(() => {
      return log(...args);
    });
  } else {
    console.log(...args);
    return log(...args);
  }
});


  
