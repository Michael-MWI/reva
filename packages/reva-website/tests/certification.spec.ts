import {
  expect,
  graphql,
  HttpResponse,
  test,
} from "next/experimental/testmode/playwright/msw";

import certificationBtsChaudronnierData from "./fixtures/certifications/chaudronnier.json";
import articlesForCertificationPageUsefulResources from "./fixtures/strapi/articlesForCertificationPageUsefulResources.json";

const fvae = graphql.link("https://reva-api/api/graphql");
const strapi = graphql.link("https://strapi.vae.gouv.fr/graphql");

const chaudronnier = certificationBtsChaudronnierData.data.getCertification;

test.beforeEach(async ({ page }) => {
  await page.context().addCookies([
    {
      name: "tarteaucitron",
      value: "!matomotm=false!crisp=false",
      path: "/",
      domain: "localhost",
    },
  ]);
});

test.use({
  mswHandlers: [
    [
      fvae.query("activeFeaturesForConnectedUser", () => {
        return HttpResponse.json({
          data: {
            activeFeaturesForConnectedUser: ["WEBSITE_CERTIFICATION_PAGE_V2"],
          },
        });
      }),
      fvae.query("getCertificationForCertificationPage", () => {
        return HttpResponse.json(certificationBtsChaudronnierData);
      }),
      strapi.query("getArticlesForCertificationPageUsefulResources", () => {
        return HttpResponse.json(articlesForCertificationPageUsefulResources);
      }),
    ],
    { scope: "test" },
  ],
});

test("display certification page with correct data info", async ({ page }) => {
  await page.goto("/certifications/610b6e86-9435-4781-abda-4cad3a746f32/");
  await expect(page.getByTestId("certification-label")).toHaveText(
    chaudronnier.label,
  );
});
