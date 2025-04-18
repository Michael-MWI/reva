import { stubMutation, stubQuery } from "../../utils/graphql";
import candidateDropOut from "./fixtures/candidate-dropped-out.json";

function interceptCandidacy() {
  cy.intercept("POST", "/api/graphql", (req) => {
    stubMutation(
      req,
      "updateCandidateCandidacyDropoutDecision",
      candidateDropOut,
    );
    stubQuery(req, "candidate_getCandidateWithCandidacy", {
      data: {
        candidate_getCandidateWithCandidacy: {
          ...candidateDropOut.data.candidate_getCandidateWithCandidacy,
          candidacy: {
            ...candidateDropOut.data.candidate_getCandidateWithCandidacy
              .candidacy,
            candidacyDropOut: {
              createdAt: "2021-09-01T00:00:00Z",
              dropOutConfirmedByCandidate: true,
            },
          },
        },
      },
    });
    stubQuery(req, "getCandidacyForDropOutDecisionPage", {
      data: {
        candidate_getCandidateWithCandidacy: {
          candidacy: {
            id: "c1",
          },
        },
      },
    });
    stubQuery(req, "activeFeaturesForConnectedUser", "features.json");
  });
}

context("Candidacy dropout decision page", () => {
  it("should let me access the page", function () {
    interceptCandidacy();
    cy.login();

    cy.wait("@candidate_getCandidateWithCandidacy");
    cy.wait("@activeFeaturesForConnectedUser");
    cy.visit("/candidacy-dropout-decision/");
    cy.wait("@getCandidacyForDropOutDecisionPage");
    cy.get('[data-test="candidacy-dropout-decision-page"]').should("exist");
    cy.get("h1").should("contain.text", "Abandon du parcours VAE");
  });
  it("should let me validate my drop out and lead me to the confirmation page", function () {
    interceptCandidacy();
    cy.login();

    cy.wait("@candidate_getCandidateWithCandidacy");
    cy.wait("@activeFeaturesForConnectedUser");
    cy.visit("/candidacy-dropout-decision/");
    cy.wait("@getCandidacyForDropOutDecisionPage");
    cy.get(".drop-out-confirmation-radio-button~label").click();
    cy.get("button[type=submit]").click();
    cy.wait("@updateCandidateCandidacyDropoutDecision");
    cy.url().should(
      "eq",
      Cypress.config().baseUrl +
        "candidacy-dropout-decision/dropout-confirmation/",
    );
  });
  it("should let me cancel my drop out and redirect me to the homepage", function () {
    interceptCandidacy();
    cy.login();

    cy.wait("@candidate_getCandidateWithCandidacy");
    cy.wait("@activeFeaturesForConnectedUser");
    cy.visit("/candidacy-dropout-decision/");
    cy.wait("@getCandidacyForDropOutDecisionPage");
    cy.get(".drop-out-cancelation-radio-button~label").click();
    cy.get("button[type=submit]").click();
    cy.wait("@updateCandidateCandidacyDropoutDecision");
    cy.url().should("eq", Cypress.config().baseUrl);
  });
});
