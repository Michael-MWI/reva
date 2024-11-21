import { stubQuery } from "../../../utils/graphql";
import certificationBPBoucher from "./fixtures/certification-bp-boucher.json";

function interceptCertification({
  withStructure,
}: { withStructure?: boolean } = {}) {
  cy.intercept("POST", "/api/graphql", (req) => {
    stubQuery(
      req,
      "activeFeaturesForConnectedUser",
      "features/active-features.json",
    );
    stubQuery(req, "getOrganismForAAPVisibilityCheck", "visibility/admin.json");
    stubQuery(
      req,
      "getMaisonMereCGUQuery",
      "account/gestionnaire-cgu-accepted.json",
    );
    stubQuery(req, "getCertificationForUpdateCertificationPage", {
      data: {
        getCertification: {
          ...certificationBPBoucher.data.getCertification,
          certificationAuthorityStructure: withStructure
            ? {
                id: "0ec61d50-a202-4222-95ff-d516b9cae503",
                label: "Ministère de l'Education Nationale et de la Jeunesse",
                certificationAuthorities: [
                  {
                    id: "47954f7a-1148-4280-842b-01eecf8ac52d",
                    label:
                      "Ministère de l'Education Nationale et de la Jeunesse - Auvergne - Rhône-Alpes",
                  },
                  {
                    id: "39c45c3d-4785-4745-8f24-5cb11c47896e",
                    label:
                      "Ministère de l'Education Nationale et de la Jeunesse - Bourgogne - Franche-Comté",
                  },
                  {
                    id: "dd2aaae3-3d59-45a0-8448-804d3f713bda",
                    label:
                      "Ministère de l'Education Nationale et de la Jeunesse - Bretagne",
                  },
                ],
              }
            : undefined,
        },
      },
    });
  });
}

context("when i access the update certification page ", () => {
  it("display the page with a correct title", function () {
    interceptCertification();

    cy.admin("/certifications-v2/bf78b4d6-f6ac-4c8f-9e6b-d6c6ae9e891b");
    cy.wait("@activeFeaturesForConnectedUser");
    cy.wait("@getOrganismForAAPVisibilityCheck");
    cy.wait("@getMaisonMereCGUQuery");
    cy.wait("@getCertificationForUpdateCertificationPage");

    cy.get('[data-test="update-certification-page"]')
      .children("h1")
      .should("have.text", "BP Boucher");
  });

  context("Competence blocs summary card", () => {
    it("display the correct number of competence blocs and competences", function () {
      interceptCertification();

      cy.admin("/certifications-v2/bf78b4d6-f6ac-4c8f-9e6b-d6c6ae9e891b");
      cy.wait("@activeFeaturesForConnectedUser");
      cy.wait("@getOrganismForAAPVisibilityCheck");
      cy.wait("@getMaisonMereCGUQuery");
      cy.wait("@getCertificationForUpdateCertificationPage");

      //2 competence blocs
      cy.get(
        '[data-test="update-certification-page"] [data-test="competence-blocs-list"] [data-test="competence-bloc"]',
      ).should("have.length", 2);

      //4 competence for the first competence bloc
      cy.get(
        '[data-test="update-certification-page"] [data-test="competence-blocs-list"] [data-test="competence-bloc"]:first-child [data-test="competences-list"] > li',
      ).should("have.length", 4);

      //2 competence for the second competence bloc
      cy.get(
        '[data-test="update-certification-page"] [data-test="competence-blocs-list"] [data-test="competence-bloc"]:nth-child(2) [data-test="competences-list"] > li',
      ).should("have.length", 2);
    });

    it("let me click on the 'update competence bloc' button of the first competence bloc and leads me to its update page ", function () {
      interceptCertification();

      cy.admin("/certifications-v2/bf78b4d6-f6ac-4c8f-9e6b-d6c6ae9e891b");
      cy.wait("@activeFeaturesForConnectedUser");
      cy.wait("@getOrganismForAAPVisibilityCheck");
      cy.wait("@getMaisonMereCGUQuery");
      cy.wait("@getCertificationForUpdateCertificationPage");

      cy.get(
        '[data-test="update-certification-page"] [data-test="competence-blocs-list"] [data-test="competence-bloc"]:first-child [data-test="update-competence-bloc-button"]',
      ).click();

      cy.url().should(
        "eq",
        "http://localhost:3003/admin2/certifications-v2/bf78b4d6-f6ac-4c8f-9e6b-d6c6ae9e891b/bloc-competence/008a6fab-55ad-4412-ab17-56bc4b8e2fd0/",
      );
    });

    it("let me click on the 'add competence bloc' button and leads me to the create competence bloc page ", function () {
      interceptCertification();

      cy.admin("/certifications-v2/bf78b4d6-f6ac-4c8f-9e6b-d6c6ae9e891b");
      cy.wait("@activeFeaturesForConnectedUser");
      cy.wait("@getOrganismForAAPVisibilityCheck");
      cy.wait("@getMaisonMereCGUQuery");
      cy.wait("@getCertificationForUpdateCertificationPage");

      cy.get(
        '[data-test="competence-blocs-summary-card"] [data-test="action-button"] ',
      ).click();
      cy.url().should(
        "eq",
        "http://localhost:3003/admin2/certifications-v2/bf78b4d6-f6ac-4c8f-9e6b-d6c6ae9e891b/bloc-competence/add/",
      );
    });
  });

  context("Structure summary card", () => {
    it("display a 'to complete' badge on the certification structure summary card when the certification has no associated structure", function () {
      interceptCertification();

      cy.admin("/certifications-v2/bf78b4d6-f6ac-4c8f-9e6b-d6c6ae9e891b");
      cy.wait("@activeFeaturesForConnectedUser");
      cy.wait("@getOrganismForAAPVisibilityCheck");
      cy.wait("@getMaisonMereCGUQuery");
      cy.wait("@getCertificationForUpdateCertificationPage");

      cy.get(
        '[data-test="certification-structure-summary-card"] [data-test="to-complete-badge"]',
      ).should("exist");
    });

    it("display a 'completed' badge on the certification structure summary card when the certification has an associated structure", function () {
      interceptCertification({ withStructure: true });

      cy.admin("/certifications-v2/bf78b4d6-f6ac-4c8f-9e6b-d6c6ae9e891b");
      cy.wait("@activeFeaturesForConnectedUser");
      cy.wait("@getOrganismForAAPVisibilityCheck");
      cy.wait("@getMaisonMereCGUQuery");
      cy.wait("@getCertificationForUpdateCertificationPage");

      cy.get(
        '[data-test="certification-structure-summary-card"] [data-test="completed-badge"]',
      ).should("exist");
    });

    it("display the structure label when the certification has an associated structure", function () {
      interceptCertification({ withStructure: true });

      cy.admin("/certifications-v2/bf78b4d6-f6ac-4c8f-9e6b-d6c6ae9e891b");
      cy.wait("@activeFeaturesForConnectedUser");
      cy.wait("@getOrganismForAAPVisibilityCheck");
      cy.wait("@getMaisonMereCGUQuery");
      cy.wait("@getCertificationForUpdateCertificationPage");

      cy.get(
        '[data-test="certification-structure-summary-card"] [data-test="certification-authority-structure-label"] dd',
      ).should(
        "have.text",
        "Ministère de l'Education Nationale et de la Jeunesse",
      );
    });

    it("display the list of certification authorities of the structure when the certification has an associated structure", function () {
      interceptCertification({ withStructure: true });

      cy.admin("/certifications-v2/bf78b4d6-f6ac-4c8f-9e6b-d6c6ae9e891b");
      cy.wait("@activeFeaturesForConnectedUser");
      cy.wait("@getOrganismForAAPVisibilityCheck");
      cy.wait("@getMaisonMereCGUQuery");
      cy.wait("@getCertificationForUpdateCertificationPage");

      cy.get(
        '[data-test="certification-structure-summary-card"] [data-test="certification-authority-list"] > li',
      ).should("have.length", 3);
    });

    it("let me click on the 'completer' button and redirect me to the structure page", function () {
      interceptCertification();

      cy.admin("/certifications-v2/bf78b4d6-f6ac-4c8f-9e6b-d6c6ae9e891b");
      cy.wait("@activeFeaturesForConnectedUser");
      cy.wait("@getOrganismForAAPVisibilityCheck");
      cy.wait("@getMaisonMereCGUQuery");
      cy.wait("@getCertificationForUpdateCertificationPage");

      cy.get(
        '[data-test="certification-structure-summary-card"] [data-test="action-button"] ',
      ).click();
      cy.url().should(
        "eq",
        "http://localhost:3003/admin2/certifications-v2/bf78b4d6-f6ac-4c8f-9e6b-d6c6ae9e891b/structure/",
      );
    });
  });
});
