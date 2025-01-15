import { FastifyInstance } from "fastify";

import { buildApp } from "../../infra/server/app";
import keycloakPluginMock from "../../test/mocks/keycloak-plugin.mock";

import { clearDatabase } from "../../test/jestClearDatabaseBeforeEachTestFile";
import { authorizationHeaderForUser } from "../../test/helpers/authorization-helper";
import { createCandidacyHelper } from "../../test/helpers/entities/create-candidacy-helper";
import { createCertificationHelper } from "../../test/helpers/entities/create-certification-helper";
import { createFeasibilityUploadedPdfHelper } from "../../test/helpers/entities/create-feasibility-uploaded-pdf-helper";
import { injectGraphql } from "../../test/helpers/graphql-helper";
import * as FILE from "../shared/file/file.service";
import * as SEND_NEW_FEASIBILITY_EMAIL from "./emails/sendNewFeasibilitySubmittedEmail";
import { createCertificationAuthorityHelper } from "../../test/helpers/entities/create-certification-authority-helper";

beforeAll(async () => {
  const app = await buildApp({ keycloakPluginMock });
  (global as any).fastify = app;
});

beforeEach(async () => {
  await clearDatabase();
});

afterEach(async () => {
  await jest.clearAllMocks();
});

test("should count all (2) feasibilities for admin user", async () => {
  await createFeasibilityUploadedPdfHelper({
    decision: "PENDING",
  });

  await createFeasibilityUploadedPdfHelper({
    decision: "PENDING",
  });

  const resp = await injectGraphql({
    fastify: (global as any).fastify,
    authorization: authorizationHeaderForUser({
      role: "admin",
      keycloakId: "3c6d4571-da18-49a3-90e5-cc83ae7446bf",
    }),
    payload: {
      requestType: "query",
      endpoint: "feasibilityCountByCategory",
      returnFields: "{ALL}",
    },
  });
  expect(resp.statusCode).toEqual(200);
  const obj = resp.json();
  expect(obj.data.feasibilityCountByCategory).toMatchObject({
    ALL: 2,
  });
});

test("should count all (1) available feasibility for certificator user even if other exists on the same scope", async () => {
  const certification = await createCertificationHelper({});
  const certificationAuthority =
    certification.certificationAuthorityStructure
      ?.certificationAuthorityOnCertificationAuthorityStructure[0]
      ?.certificationAuthority;
  const candidacy = await createCandidacyHelper({
    candidacyArgs: {
      certificationId: certification.id,
      status: "DOSSIER_FAISABILITE_ENVOYE",
    },
  });
  await createFeasibilityUploadedPdfHelper({
    decision: "PENDING",
    certificationAuthorityId: certificationAuthority?.id,
    candidacyId: candidacy.id,
  });
  await createFeasibilityUploadedPdfHelper({
    decision: "PENDING",
  });

  const resp = await injectGraphql({
    fastify: (global as any).fastify,
    authorization: authorizationHeaderForUser({
      role: "manage_certification_authority_local_account",
      keycloakId: certificationAuthority?.Account[0].keycloakId,
    }),
    payload: {
      requestType: "query",
      endpoint: "feasibilityCountByCategory",
      returnFields: "{ALL}",
    },
  });
  expect(resp.statusCode).toEqual(200);
  const obj = resp.json();
  expect(obj.data.feasibilityCountByCategory).toMatchObject({
    ALL: 1,
  });
});

test("should count no available feasibility for certificator user since he doesn't handle the related certifications", async () => {
  const certificationAuthority = await createCertificationAuthorityHelper();

  await createFeasibilityUploadedPdfHelper({
    decision: "PENDING",
  });

  const resp = await injectGraphql({
    fastify: (global as any).fastify,
    authorization: authorizationHeaderForUser({
      role: "manage_certification_authority_local_account",
      keycloakId: certificationAuthority.Account[0].keycloakId,
    }),
    payload: {
      requestType: "query",
      endpoint: "feasibilityCountByCategory",
      returnFields: "{ALL}",
    },
  });
  expect(resp.statusCode).toEqual(200);
  const obj = resp.json();
  expect(obj.data.feasibilityCountByCategory).toMatchObject({
    ALL: 0,
  });
});

test("should return a feasibilty for certificator since he is allowed to handle it", async () => {
  const certification = await createCertificationHelper({});
  const certificationAuthority =
    certification.certificationAuthorityStructure
      ?.certificationAuthorityOnCertificationAuthorityStructure[0]
      ?.certificationAuthority;
  const candidacy = await createCandidacyHelper({
    candidacyArgs: {
      certificationId: certification.id,
    },
  });

  const feasibility = await createFeasibilityUploadedPdfHelper({
    decision: "PENDING",
    certificationAuthorityId: certificationAuthority?.id,
    candidacyId: candidacy.id,
  });

  const resp = await injectGraphql({
    fastify: (global as any).fastify,
    authorization: authorizationHeaderForUser({
      role: "manage_certification_authority_local_account",
      keycloakId: certificationAuthority?.Account[0].keycloakId,
    }),
    payload: {
      requestType: "query",
      endpoint: "feasibility",
      arguments: { feasibilityId: feasibility.id },
      returnFields: "{id}",
    },
  });

  expect(resp.statusCode).toEqual(200);
  const obj = resp.json();
  expect(obj.data?.feasibility).toMatchObject({
    id: feasibility.id,
  });
  expect(resp.json()).not.toHaveProperty("errors");
});

test("should return a feasibility error when accessing it since the certificator doesn't handle it", async () => {
  const certificationAuthority = await createCertificationAuthorityHelper();

  const feasiblity = await createFeasibilityUploadedPdfHelper({
    decision: "PENDING",
  });

  const resp = await injectGraphql({
    fastify: (global as any).fastify,
    authorization: authorizationHeaderForUser({
      role: "manage_certification_authority_local_account",
      keycloakId: certificationAuthority.Account[0].keycloakId,
    }),
    payload: {
      requestType: "query",
      endpoint: "feasibility",
      arguments: { feasibilityId: feasiblity.id },
      returnFields: "{id}",
    },
  });

  expect(resp.json()).toHaveProperty("errors");
});

test("should return all (1) available feasibility for certificateur user", async () => {
  const certification = await createCertificationHelper({});
  const certificationAuthority =
    certification.certificationAuthorityStructure
      ?.certificationAuthorityOnCertificationAuthorityStructure[0]
      ?.certificationAuthority;
  const candidacy = await createCandidacyHelper({
    candidacyArgs: {
      certificationId: certification.id,
    },
    candidacyActiveStatus: "DOSSIER_FAISABILITE_ENVOYE",
  });
  const feasibility = await createFeasibilityUploadedPdfHelper({
    decision: "PENDING",
    certificationAuthorityId: certificationAuthority?.id,
    candidacyId: candidacy.id,
  });

  const resp = await injectGraphql({
    fastify: (global as any).fastify,
    authorization: authorizationHeaderForUser({
      role: "manage_certification_authority_local_account",
      keycloakId: certificationAuthority?.Account[0].keycloakId,
    }),
    payload: {
      requestType: "query",
      endpoint: "feasibilities",
      returnFields:
        "{rows{id},info{totalRows,currentPage,totalPages,pageLength}}",
    },
  });

  expect(resp.statusCode).toEqual(200);
  const obj = resp.json();
  expect(obj.data.feasibilities).toMatchObject({
    rows: [{ id: feasibility.id }],
    info: { currentPage: 1, totalPages: 1, totalRows: 1, pageLength: 10 },
  });
});

test("should count 1 pending feasibility for admin user", async () => {
  await createFeasibilityUploadedPdfHelper({
    decision: "PENDING",
  });

  const resp = await injectGraphql({
    fastify: (global as any).fastify,
    authorization: authorizationHeaderForUser({
      role: "admin",
      keycloakId: "3c6d4571-da18-49a3-90e5-cc83ae7446bf",
    }),
    payload: {
      requestType: "query",
      endpoint: "feasibilityCountByCategory",
      returnFields: "{ALL,PENDING,ADMISSIBLE,REJECTED,INCOMPLETE}",
    },
  });
  expect(resp.statusCode).toEqual(200);
  const obj = resp.json();
  expect(obj.data.feasibilityCountByCategory).toMatchObject({
    ALL: 1,
    PENDING: 1,
    ADMISSIBLE: 0,
    REJECTED: 0,
    INCOMPLETE: 0,
  });
});

const postFeasibilityDecision = ({
  feasibilityId,
  decision,
  authorization,
}: {
  feasibilityId: string;
  decision: string;
  authorization: ReturnType<typeof authorizationHeaderForUser>;
}) => {
  const fastify = (global as any).fastify as FastifyInstance;

  return fastify.inject({
    method: "POST",
    url: `/api/feasibility/${feasibilityId}/decision`,
    payload: { decision: { value: decision } },
    headers: {
      authorization,
    },
  });
};

test("should validate a feasibility since certificator is allowed to do so", async () => {
  const certification = await createCertificationHelper({});
  const certificationAuthority =
    certification.certificationAuthorityStructure
      ?.certificationAuthorityOnCertificationAuthorityStructure[0]
      ?.certificationAuthority;
  const candidacy = await createCandidacyHelper({
    candidacyArgs: {
      certificationId: certification.id,
    },
  });
  const feasiblity = await createFeasibilityUploadedPdfHelper({
    decision: "PENDING",
    certificationAuthorityId: certificationAuthority?.id,
    candidacyId: candidacy.id,
  });

  const resp = await postFeasibilityDecision({
    feasibilityId: feasiblity.id,
    decision: "ADMISSIBLE",
    authorization: authorizationHeaderForUser({
      role: "manage_certification_authority_local_account",
      keycloakId: certificationAuthority?.Account[0].keycloakId,
    }),
  });

  expect(resp.statusCode).toEqual(200);
  const obj = JSON.parse(resp.body);

  expect(obj).toMatchObject({
    id: feasiblity.id,
    decision: "ADMISSIBLE",
  });
});

test("should not validate a feasibility since  the certificator doesn't handle it", async () => {
  const certificationAuthority = await createCertificationAuthorityHelper({});

  const feasiblity = await createFeasibilityUploadedPdfHelper({
    decision: "PENDING",
  });

  const resp = await postFeasibilityDecision({
    feasibilityId: feasiblity.id,
    decision: "ADMISSIBLE",
    authorization: authorizationHeaderForUser({
      role: "manage_certification_authority_local_account",
      keycloakId: certificationAuthority.Account[0].keycloakId,
    }),
  });
  expect(resp.statusCode).toBe(500);
});

test("should not validate a feasibility since the certificator doesn't handle it", async () => {
  const certificationAuthority = await createCertificationAuthorityHelper({});

  const feasiblity = await createFeasibilityUploadedPdfHelper({
    decision: "PENDING",
  });

  const resp = await postFeasibilityDecision({
    feasibilityId: feasiblity.id,
    decision: "ADMISSIBLE",
    authorization: authorizationHeaderForUser({
      role: "manage_certification_authority_local_account",
      keycloakId: certificationAuthority.Account[0].keycloakId,
    }),
  });
  expect(resp.statusCode).toBe(500);
});

test("should reject a feasibility since certificator is allowed to do so", async () => {
  const certification = await createCertificationHelper({});
  const certificationAuthority =
    certification.certificationAuthorityStructure
      ?.certificationAuthorityOnCertificationAuthorityStructure[0]
      ?.certificationAuthority;
  const candidacy = await createCandidacyHelper({
    candidacyArgs: {
      certificationId: certification.id,
    },
  });
  const feasiblity = await createFeasibilityUploadedPdfHelper({
    decision: "PENDING",
    certificationAuthorityId: certificationAuthority?.id,
    candidacyId: candidacy.id,
  });

  const resp = await postFeasibilityDecision({
    feasibilityId: feasiblity.id,
    decision: "REJECTED",
    authorization: authorizationHeaderForUser({
      role: "manage_certification_authority_local_account",
      keycloakId: certificationAuthority?.Account[0].keycloakId,
    }),
  });

  expect(resp.statusCode).toEqual(200);

  const obj = JSON.parse(resp.body);

  expect(obj).toMatchObject({
    id: feasiblity.id,
  });

  expect(obj).toMatchObject({
    id: feasiblity.id,
    decision: "REJECTED",
  });
});

test("should not reject a feasibility since the certificator doesn't handle it", async () => {
  const certificationAuthority = await createCertificationAuthorityHelper();

  const feasiblity = await createFeasibilityUploadedPdfHelper({
    decision: "PENDING",
  });

  const resp = await injectGraphql({
    fastify: (global as any).fastify,
    authorization: authorizationHeaderForUser({
      role: "manage_certification_authority_local_account",
      keycloakId: certificationAuthority.Account[0].keycloakId,
    }),
    payload: {
      requestType: "query",
      endpoint: "rejectFeasibility",
      arguments: { feasibilityId: feasiblity.id },
      returnFields: "{id}",
    },
  });

  expect(resp.json()).toHaveProperty("errors");
});

const postFeasibility = ({
  candidacyId,
  certificationAuthorityId,
  authorization,
}: {
  candidacyId: string;
  certificationAuthorityId: string;
  authorization: ReturnType<typeof authorizationHeaderForUser>;
}) => {
  const formData = new FormData();
  formData.append("candidacyId", candidacyId);
  formData.append("certificationAuthorityId", certificationAuthorityId);

  formData.append(
    "feasibilityFile",
    new File([], "test.pdf", { type: "application/pdf" }),
  );
  formData.append(
    "IDFile",
    new File([], "test.pdf", { type: "application/pdf" }),
  );

  const fastify = (global as any).fastify as FastifyInstance;

  return fastify.inject({
    method: "POST",
    url: `api/feasibility/upload-feasibility-file`,
    headers: {
      authorization,
      "content-type": "multipart/form-data",
    },
    body: formData,
  });
};

test("should validate upload of feasibility file", async () => {
  jest.spyOn(FILE, "uploadFilesToS3").mockImplementation();

  const sendNewFeasibilitySubmittedEmaillMock = jest.spyOn(
    SEND_NEW_FEASIBILITY_EMAIL,
    "sendNewFeasibilitySubmittedEmail",
  );

  const certification = await createCertificationHelper({});
  const certificationAuthority =
    certification.certificationAuthorityStructure
      ?.certificationAuthorityOnCertificationAuthorityStructure[0]
      ?.certificationAuthority;
  const candidacy = await createCandidacyHelper({
    candidacyArgs: {
      certificationId: certification.id,
      status: "PARCOURS_CONFIRME",
    },
    candidacyActiveStatus: "PARCOURS_CONFIRME",
  });

  const resp = await postFeasibility({
    candidacyId: candidacy.id,
    certificationAuthorityId: certificationAuthority!.id,
    authorization: authorizationHeaderForUser({
      role: "manage_candidacy",
      keycloakId: candidacy.organism?.accounts[0].keycloakId,
    }),
  });

  const emails = [];
  if (certificationAuthority?.contactEmail) {
    emails.push(certificationAuthority?.contactEmail);
  }

  expect(
    await sendNewFeasibilitySubmittedEmaillMock.mock.results[0].value,
  ).toBe(`email sent to ${emails.map((email) => email).join(", ")}`);

  expect(resp.statusCode).toEqual(200);
});
