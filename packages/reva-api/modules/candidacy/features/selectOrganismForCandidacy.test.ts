/**
 * @jest-environment ./test/fastify-test-env.ts
 */

import { prismaClient } from "../../../prisma/client";
import { authorizationHeaderForUser } from "../../../test/helpers/authorization-helper";
import { injectGraphql } from "../../../test/helpers/graphql-helper";

import { CandidacyStatusStep } from "@prisma/client";
import { TRAINING_INPUT } from "../../../test/fixtures";
import { createCandidacyHelper } from "../../../test/helpers/entities/create-candidacy-helper";
import { createOrganismHelper } from "../../../test/helpers/entities/create-organism-helper";
import { clearDatabase } from "../../../test/jestClearDatabaseBeforeEachTestFile";

const selectNewOrganism = async ({
  keycloakId,
  organismId,
  candidacyId,
}: {
  keycloakId: string;
  organismId: string;
  candidacyId: string;
}) =>
  await injectGraphql({
    fastify: (global as any).fastify,
    authorization: authorizationHeaderForUser({
      role: "candidate",
      keycloakId,
    }),
    payload: {
      requestType: "mutation",
      endpoint: "candidacy_selectOrganism",
      arguments: {
        candidacyId,
        organismId,
      },
      returnFields: "{id,organismId}",
    },
  });

const submitTraining = async ({
  keycloakId,
  candidacyId,
}: {
  keycloakId: string;
  candidacyId: string;
}) =>
  await injectGraphql({
    fastify: (global as any).fastify,
    authorization: authorizationHeaderForUser({
      role: "manage_candidacy",
      keycloakId,
    }),
    payload: {
      requestType: "mutation",
      endpoint: "training_submitTrainingForm",
      arguments: {
        candidacyId,
        training: TRAINING_INPUT,
      },
      returnFields: "{id,status}",
    },
  });

const confirmTraining = async ({
  keycloakId,
  candidacyId,
}: {
  keycloakId: string;
  candidacyId: string;
}) =>
  await injectGraphql({
    fastify: (global as any).fastify,
    authorization: authorizationHeaderForUser({
      role: "candidate",
      keycloakId,
    }),
    payload: {
      requestType: "mutation",
      endpoint: "training_confirmTrainingForm",
      arguments: {
        candidacyId,
      },
      returnFields: "{id, status}",
    },
  });

afterEach(async () => {
  await clearDatabase();
});

test("a candidate should be able to select a new organism while a training is sent", async () => {
  const candidacy = await createCandidacyHelper({}, CandidacyStatusStep.PROJET);
  const candidacyId = candidacy.id;
  const candidateKeycloakId = candidacy.candidate?.keycloakId ?? "";
  const organismToSelect = await createOrganismHelper();

  await submitTraining({
    keycloakId: candidacy.organism?.accounts[0].keycloakId ?? "",
    candidacyId,
  });
  const resp = await selectNewOrganism({
    keycloakId: candidateKeycloakId,
    organismId: organismToSelect.id,
    candidacyId,
  });

  expect(resp.statusCode).toEqual(200);
  expect(resp.json().data.candidacy_selectOrganism).toMatchObject({
    id: candidacyId,
    organismId: organismToSelect.id,
  });
});

test("a candidate should not be able to select a new organism after the training is confirmed", async () => {
  const candidacy = await createCandidacyHelper();
  const candidacyId = candidacy.id;
  const candidateKeycloakId = candidacy.candidate?.keycloakId ?? "";
  const organismKeycloakId = candidacy.organism?.accounts[0].keycloakId ?? "";

  const organismToSelect = await createOrganismHelper();
  await submitTraining({
    keycloakId: organismKeycloakId,
    candidacyId,
  });
  await confirmTraining({
    keycloakId: candidateKeycloakId,
    candidacyId,
  });
  const resp = await selectNewOrganism({
    keycloakId: candidateKeycloakId,
    organismId: organismToSelect.id,
    candidacyId,
  });

  expect(resp.statusCode).toEqual(200);
  expect(resp.json().errors?.[0].message).toEqual(
    "Impossible de changer d'organisme d'accompagnement après avoir confirmé le parcours",
  );
});

test("should reset the status to validation when selecting a new organism and status is prise_en_charge", async () => {
  const candidacy = await createCandidacyHelper(
    {},
    CandidacyStatusStep.PRISE_EN_CHARGE,
  );
  const candidacyId = candidacy.id;
  const candidateKeycloakId = candidacy.candidate?.keycloakId ?? "";
  const organism = await createOrganismHelper();

  await selectNewOrganism({
    keycloakId: candidateKeycloakId,
    organismId: organism.id,
    candidacyId,
  });

  const candidacyUpdated = await prismaClient.candidacy.findUnique({
    where: { id: candidacyId },
  });

  expect(candidacyUpdated).toMatchObject({
    status: CandidacyStatusStep.VALIDATION,
  });
});

test("should reset the training and update the status when selecting a new organism", async () => {
  const candidacy = await createCandidacyHelper(
    {},
    CandidacyStatusStep.PARCOURS_ENVOYE,
  );
  const candidacyId = candidacy.id;
  const candidateKeycloakId = candidacy.candidate?.keycloakId ?? "";
  const organism = await createOrganismHelper();
  const organismKeycloakId = organism.accounts[0].keycloakId;

  await submitTraining({
    keycloakId: organismKeycloakId,
    candidacyId,
  });
  await selectNewOrganism({
    keycloakId: candidateKeycloakId,
    organismId: organism.id,
    candidacyId,
  });

  const candidacyUpdated = await prismaClient.candidacy.findUnique({
    where: { id: candidacyId },
  });

  const basicSkillsCount = await prismaClient.basicSkillOnCandidacies.count({
    where: { candidacyId },
  });
  const trainingCount = await prismaClient.trainingOnCandidacies.count({
    where: { candidacyId },
  });
  const financingMethodCount =
    await prismaClient.candidacyOnCandidacyFinancingMethod.count({
      where: { candidacyId },
    });

  expect(candidacyUpdated).toMatchObject({
    status: CandidacyStatusStep.VALIDATION,
    certificateSkills: null,
    otherTraining: null,
    individualHourCount: null,
    collectiveHourCount: null,
    additionalHourCount: null,
    isCertificationPartial: null,
    estimatedCost: null,
  });

  expect(basicSkillsCount).toEqual(0);
  expect(trainingCount).toEqual(0);
  expect(financingMethodCount).toEqual(0);
});
