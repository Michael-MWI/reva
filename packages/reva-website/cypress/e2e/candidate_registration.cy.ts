import { stubMutation, stubQuery } from "../support/graphql";

describe("candidate registration", () => {
  beforeEach(() => {
    cy.intercept("POST", "/api/graphql", (req) => {
      stubQuery(
        req,
        "activeFeaturesForConnectedUser",
        "active_features_empty.json",
      );
    });
  });

  it("should show the certificate selected in the previous screen", () => {
    cy.intercept("POST", "/api/graphql", (req) => {
      stubQuery(req, "getCertification", "certification_bts_chaudronnier.json");
    });

    cy.visit(
      "http://localhost:3002/inscription-candidat/?certificationId=7ad608c2-5a4b-40eb-8ef9-7a85421b40f0",
    );

    cy.get('[data-testid="selected-certificate-label"]').should(
      "have.text",
      "BTS Chaudronnier",
    );
    cy.get('[data-testid="selected-certificate-code-rncp"]').should(
      "have.text",
      "RNCP123",
    );
    cy.get('[data-testid="selected-certificate-type-diplome"]').should(
      "have.text",
      "Titre-BTS",
    );
  });

  it("should have an empty candidate typology at page load", () => {
    cy.intercept("POST", "/api/graphql", (req) => {
      stubQuery(req, "getCertification", "certification_bts_chaudronnier.json");
    });

    cy.visit(
      "http://localhost:3002/inscription-candidat/?certificationId=7ad608c2-5a4b-40eb-8ef9-7a85421b40f0",
    );

    cy.wait("@getCertification");

    cy.get('[data-testid="candidate-typology-select"]')
      .children("select")
      .should("have.value", null);
  });

  it("should show an error panel when i select a disabled candidate typology", () => {
    cy.intercept("POST", "/api/graphql", (req) => {
      stubQuery(req, "getCertification", "certification_bts_chaudronnier.json");
      stubQuery(
        req,
        "getDepartments",
        "candidate_registration_departments.json",
      );
    });

    cy.visit(
      "http://localhost:3002/inscription-candidat/?certificationId=7ad608c2-5a4b-40eb-8ef9-7a85421b40f0",
    );

    cy.wait("@getCertification");

    cy.wait("@getDepartments");

    [
      "SALARIE_PUBLIC",
    ].forEach((typology) => {
      cy.get('[data-testid="candidate-typology-select"]')
        .children("select")
        .select(typology);

      cy.get('[data-testid="candidate-typology-error-panel"]').should(
        "be.visible",
      );
    });
  });

  it("should show a candidate registration form when i select a candidate typology of 'SALARIE_PRIVE', 'DEMANDEUR_EMPLOI' or 'BENEVOLE'  ", () => {
    cy.intercept("POST", "/api/graphql", (req) => {
      stubQuery(req, "getCertification", "certification_bts_chaudronnier.json");
      stubQuery(
        req,
        "getDepartments",
        "candidate_registration_departments.json",
      );
    });

    cy.visit(
      "http://localhost:3002/inscription-candidat/?certificationId=7ad608c2-5a4b-40eb-8ef9-7a85421b40f0",
    );

    cy.wait("@getCertification");

    cy.get('[data-testid="candidate-typology-select"]')
      .children("select")
      .select("SALARIE_PRIVE");

    cy.wait("@getDepartments");

    cy.get('[data-testid="candidate-registration-form"]').should("exist");

    cy.get('[data-testid="candidate-typology-select"]')
      .children("select")
      .select("DEMANDEUR_EMPLOI");

    cy.get('[data-testid="candidate-registration-form"]').should("exist");

    cy.get('[data-testid="candidate-typology-select"]')
      .children("select")
      .select("BENEVOLE");

    cy.get('[data-testid="candidate-registration-form"]').should("exist");
  });

  it("should let me send a valid candidate registration form  ", () => {
    cy.intercept("POST", "/api/graphql", (req) => {
      stubQuery(req, "getCertification", "certification_bts_chaudronnier.json");
      stubQuery(
        req,
        "getDepartments",
        "candidate_registration_departments.json",
      );
      stubMutation(
        req,
        "candidate_askForRegistration",
        "candidate_registration_candidate_ask_for_registration.json",
      );
    });

    cy.visit(
      "http://localhost:3002/inscription-candidat/?certificationId=7ad608c2-5a4b-40eb-8ef9-7a85421b40f0",
    );

    cy.wait("@getCertification");

    cy.get('[data-testid="candidate-typology-select"]')
      .children("select")
      .select("SALARIE_PRIVE");

    cy.wait("@getDepartments");

    cy.get('[data-testid="candidate-registration-form-firstname-input"]').type(
      "Edgar",
    );

    cy.get('[data-testid="candidate-registration-form-lastname-input"]').type(
      "Podovsky",
    );

    cy.get('[data-testid="candidate-registration-form-phone-input"]').type(
      "+33 1 01 01 01 01",
    );

    cy.get('[data-testid="candidate-registration-form-email-input"]')
      .children("input")
      .type("edgar.podovsky@flatmail.com");

    cy.get('[data-testid="candidate-modalite-parcours-radio-buttons"] input[value="ACCOMPAGNE"]~label').click();

      cy.get('[data-testid="candidate-registration-form-department-select"]')
      .children("select")
      .select("department1");


    cy.get('[data-testid="candidate-registration-submit-button"]').click();

    cy.wait("@candidate_askForRegistration");

    cy.url().should(
      "eq",
      "http://localhost:3002/inscription-candidat/confirmation/",
    );
  });
});

it("should show another certificate when i search for another one within the page", () => {
  cy.intercept("POST", "/api/graphql", (req) => {
    stubQuery(req, "getCertification", "certification_bts_chaudronnier.json");
    stubQuery(
      req,
      "searchCertificationsQuery",
      "candidate_certificate_search.json",
    );
    stubQuery(
      req,
      "activeFeaturesForConnectedUser",
      "active_features_empty.json",
    );
    stubQuery(req, "getDepartments", "candidate_registration_departments.json");
  });

  cy.visit(
    "http://localhost:3002/inscription-candidat/?certificationId=7ad608c2-5a4b-40eb-8ef9-7a85421b40f0",
  );

  cy.wait("@getCertification");
  cy.wait("@getDepartments");

  cy.get('[data-testid="autocomplete-input"]').type("ebeniste", {
    delay: 0,
  });

  cy.wait("@searchCertificationsQuery");

  cy.get('[data-testid="autocomplete-options"]').children("div").eq(1).click();

  cy.url().should(
    "eq",
    "http://localhost:3002/inscription-candidat/?certificationId=b8cc6d4b-188d-4d22-86b4-b246cbc6e6ae",
  );
});
