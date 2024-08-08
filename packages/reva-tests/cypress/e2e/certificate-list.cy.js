import { stubMutation, stubQuery } from "../utils/graphql";

context("Certificate list", () => {
  beforeEach(() => {
    cy.intercept("POST", "/api/graphql", (req) => {
      stubQuery(req, "getDepartments", "departments.json");
      stubMutation(req, "candidate_login", "candidate1.json");
      stubQuery(req, "getReferential", "referential.json");
      stubQuery(req, "Certifications", "certifications.json");
      stubQuery(req, "activeFeaturesForConnectedUser", "features.json");
      stubMutation(
        req,
        "certification_updateCertification",
        "updated-candidacy1.json",
      );
    });

    cy.login();
    cy.wait("@candidate_login");
    cy.wait("@getReferential");
    cy.wait("@activeFeaturesForConnectedUser");
  });

  it("should show only 2 certifications", function () {
    cy.get('[data-test="project-home-select-certification"]').click();
    cy.get("[name='select_department']").select("2");
    cy.wait("@Certifications");

    cy.get('[data-test="results"]').children("li").should("have.length", 2);

    cy.get('[data-test="results"]')
      .children("li")
      .eq(0)
      .should("have.text", "34691Titre 1");

    cy.get('[data-test="results"]')
      .children("li")
      .eq(1)
      .should("have.text", "34692Titre 2");
  });
});
