import { stubMutation, stubQuery } from "../utils/graphql";

context("Empty candidacy", () => {
  it("prevent organism selection", function () {
    cy.intercept("POST", "/api/graphql", (req) => {
      stubQuery(req, "getDepartments", "departments.json");
      stubMutation(req, "candidate_login", "candidate1.json");
      stubQuery(req, "getReferential", "referential.json");
      stubQuery(req, "activeFeaturesForConnectedUser", "features.json");
    });
    cy.login();
    cy.wait("@candidate_login");
    cy.wait("@getReferential");
    cy.wait("@activeFeaturesForConnectedUser");

    cy.get('[data-test="project-home-edit-organism').should("be.disabled");
  });
});

context("Candidacy with department certification selected", () => {
  it("list all available organisms", function () {
    Cypress.on("uncaught:exception", (err) => {
      // Suppress the error that started occurring after the DSFR update
      if (err.message.includes("this.removeEventListener is not a function")) {
        return false;
      }
    });

    cy.intercept("POST", "/api/graphql", (req) => {
      stubQuery(req, "getDepartments", "departments.json");
      stubMutation(req, "candidate_login", "candidate3.json");
      stubQuery(req, "getReferential", "referential.json");
      stubQuery(req, "getRandomOrganismsForCandidacy", "organism.json");
      stubQuery(req, "activeFeaturesForConnectedUser", "features.json");
    });
    cy.login();
    cy.wait("@candidate_login");
    cy.wait("@getReferential");
    cy.wait("@activeFeaturesForConnectedUser");

    cy.get('[data-test="project-home-edit-organism').click();
    cy.wait("@getRandomOrganismsForCandidacy");

    cy.get('[data-test="project-organisms-organism-o1"]').within(() => {
      cy.get('[data-test="project-organisms-organism-label"]').should(
        "have.text",
        "Architecte 1",
      );
      cy.get('[data-test="project-organisms-organism-email"]').should(
        "have.text",
        "email@exemple.com",
      );
      cy.get('[data-test="project-organisms-organism-phone"]').should(
        "have.text",
        "0111111111",
      );
      cy.get('[data-test="project-organisms-onsite-tag"]').should("exist");
      cy.get('[data-test="project-organisms-remote-tag"]').should("not.exist");
    });

    cy.get('[data-test="project-organisms-organism-o2"]').within(() => {
      cy.get('[data-test="project-organisms-organism-label"]').should(
        "have.text",
        "Architecte 2",
      );
      cy.get('[data-test="project-organisms-organism-email"]').should(
        "have.text",
        "email2@exemple.com",
      );
      cy.get('[data-test="project-organisms-organism-phone"]').should(
        "have.text",
        "0222222222",
      );
      cy.get('[data-test="project-organisms-onsite-tag"]').should("not.exist");
      cy.get('[data-test="project-organisms-remote-tag"]').should("exist");
    });
  });

  it("submit first organism", function () {
    cy.intercept("POST", "/api/graphql", (req) => {
      stubQuery(req, "getDepartments", "departments.json");
      stubMutation(req, "candidate_login", "candidate3.json");
      stubQuery(req, "getReferential", "referential.json");
      stubQuery(req, "getRandomOrganismsForCandidacy", "organism.json");
      stubMutation(req, "candidacy_selectOrganism", "selected-organism.json");
      stubQuery(req, "activeFeaturesForConnectedUser", "features.json");
    });

    cy.login(
      { token: "abc" },
      {
        onBeforeLoad(win) {
          cy.stub(win.Math, "random").returns(0);
        },
      },
    );

    cy.wait("@candidate_login");
    cy.wait("@activeFeaturesForConnectedUser");

    cy.get('[data-test="project-home-edit-organism').click();
    cy.wait("@getRandomOrganismsForCandidacy");

    cy.get('[data-test="project-organisms-submit-organism-o1').click();
    cy.wait("@candidacy_selectOrganism");

    cy.get('[data-test="project-home-organism-label"]').should(
      "have.text",
      "Architecte 1",
    );
    cy.get('[data-test="project-home-organism-email"]').should(
      "have.text",
      "email@exemple.com",
    );
    cy.get('[data-test="project-home-organism-phone"]').should(
      "have.text",
      "0111111111",
    );
  });
});
