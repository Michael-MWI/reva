import { stubQuery } from "../../../../utils/graphql";
import { DEFAULT_FEASIBILITY_FILE, DF_CERTIFICATION } from "./dff-mocks";

function visitFeasibilityCompetenciesBlock(
  feasibility = DEFAULT_FEASIBILITY_FILE,
) {
  cy.fixture("candidacy/candidacy-dff.json").then((candidacy) => {
    cy.intercept("POST", "/api/graphql", (req) => {
      stubQuery(
        req,
        "activeFeaturesForConnectedUser",
        "features/active-features.json",
      );
      stubQuery(
        req,
        "getMaisonMereCGUQuery",
        "account/head-agency-cgu-accepted.json",
      );
      stubQuery(
        req,
        "getOrganismForAAPVisibilityCheck",
        "visibility/organism.json",
      );
      stubQuery(req, "getAccountInfo", "account/head-agency-info.json");
      candidacy.data.getCandidacyById.feasibility = feasibility;
      candidacy.data.getCandidacyById.certification = DF_CERTIFICATION;

      stubQuery(
        req,
        "getBlocDeCompetencesForCompetenciesBlockPage",
        "bloc-de-competences/bloc-de-competences.json",
      );

      stubQuery(
        req,
        "getCandidacyMenuAndCandidateInfos",
        "candidacy/candidacy-menu-dff.json",
      );
    });
  });

  cy.collaborateur(
    "/candidacies/57bf364b-8c8b-4ff4-889b-66917e26d7d0/feasibility-aap/competencies-blocks/4c06558e-8e3e-4559-882e-321607a6b4e1/",
  );
}

describe("Dematerialized Feasibility File - Competencies Block Page", () => {
  context("Form Initial State", () => {
    it("should display the competencies block form with disabled submit button", function () {
      visitFeasibilityCompetenciesBlock();

      cy.get('[data-test="form-buttons"]')
        .should("exist")
        .within(() => {
          cy.get("button").should("be.disabled");
        });
    });
  });

  context("Block Comment Section", () => {
    it("should enable submit button when adding a valid block comment", function () {
      visitFeasibilityCompetenciesBlock();

      cy.get('[data-test="block-comment-input"]')
        .should("exist")
        .type("Test comment for the block");

      cy.get('[data-test="form-buttons"]')
        .should("exist")
        .within(() => {
          cy.get("button").should("not.be.disabled");
        });
    });

    it("should keep submit button disabled when block comment is empty", function () {
      visitFeasibilityCompetenciesBlock();

      cy.get('[data-test="block-comment-input"]')
        .should("exist")
        .and("have.value", "");

      cy.get('[data-test="form-buttons"]')
        .find('button[type="submit"]')
        .should("be.disabled");
    });
  });

  context("Navigation", () => {
    it("should provide a link back to the feasibility summary page", function () {
      visitFeasibilityCompetenciesBlock();

      cy.get('[data-test="form-buttons"]')
        .find('a[href*="/feasibility-aap"]')
        .should("exist");
    });
  });
});
