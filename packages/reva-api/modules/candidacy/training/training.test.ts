import { CandidacyStatusStep } from "@prisma/client";

import { CANDIDACY_FINANCING_METHOD_OTHER_SOURCE_ID } from "@/modules/referential/referential.types";
import { TRAINING_INPUT } from "@/test/fixtures";
import { authorizationHeaderForUser } from "@/test/helpers/authorization-helper";
import { createCandidacyHelper } from "@/test/helpers/entities/create-candidacy-helper";
import { injectGraphql } from "@/test/helpers/graphql-helper";

test("AAP should not be able to submit a training form if its status is in 'PROJET'", async () => {
  const candidacy = await createCandidacyHelper({
    candidacyActiveStatus: CandidacyStatusStep.PROJET,
  });
  const organismKeycloakId = candidacy.organism?.accounts[0].keycloakId;

  const resp = await injectGraphql({
    fastify: (global as any).fastify,
    authorization: authorizationHeaderForUser({
      role: "manage_candidacy",
      keycloakId: organismKeycloakId,
    }),
    payload: {
      requestType: "mutation",
      endpoint: "training_submitTrainingForm",
      arguments: {
        candidacyId: candidacy.id,
        training: TRAINING_INPUT,
      },
      returnFields: "{id}",
    },
  });
  expect(resp.statusCode).toEqual(200);
  expect(resp.json().errors?.[0].message).toEqual(
    "Ce parcours ne peut pas être envoyé car la candidature n'est pas encore prise en charge.",
  );
});

test("AAP should be able to submit a basic training form when candidacy status is 'PRISE_EN_CHARGE' and its finance module is 'unifvae'", async () => {
  const candidacy = await createCandidacyHelper({
    candidacyActiveStatus: CandidacyStatusStep.PRISE_EN_CHARGE,
  });
  const organismKeycloakId = candidacy.organism?.accounts[0].keycloakId;

  const resp = await injectGraphql({
    fastify: (global as any).fastify,
    authorization: authorizationHeaderForUser({
      role: "manage_candidacy",
      keycloakId: organismKeycloakId,
    }),
    payload: {
      requestType: "mutation",
      endpoint: "training_submitTrainingForm",
      arguments: {
        candidacyId: candidacy.id,
        training: TRAINING_INPUT,
      },
      returnFields: "{id,status}",
    },
  });
  expect(resp.statusCode).toEqual(200);
  expect(resp.json().data.training_submitTrainingForm).toMatchObject({
    status: "PARCOURS_ENVOYE",
  });
});

test("AAP should not be able to submit a basic training form without at least one financing method  when candidacy financeModule is 'hors_plateforme'", async () => {
  const candidacy = await createCandidacyHelper({
    candidacyArgs: {
      financeModule: "hors_plateforme",
    },
    candidacyActiveStatus: CandidacyStatusStep.PRISE_EN_CHARGE,
  });
  const organismKeycloakId = candidacy.organism?.accounts[0].keycloakId;

  const resp = await injectGraphql({
    fastify: (global as any).fastify,
    authorization: authorizationHeaderForUser({
      role: "manage_candidacy",
      keycloakId: organismKeycloakId,
    }),
    payload: {
      requestType: "mutation",
      endpoint: "training_submitTrainingForm",
      arguments: {
        candidacyId: candidacy.id,
        training: { ...TRAINING_INPUT },
      },
      returnFields: "{id,status}",
    },
  });
  expect(resp.statusCode).toEqual(200);
  expect(resp.json().errors?.[0].message).toEqual(
    "Au moins une modalité de financement doit être renseignée",
  );
});

test("AAP should not be able to submit a basic training form  with an 'other source' financing method without an additional information text", async () => {
  const candidacy = await createCandidacyHelper({
    candidacyArgs: {
      financeModule: "hors_plateforme",
    },
    candidacyActiveStatus: CandidacyStatusStep.PRISE_EN_CHARGE,
  });
  const organismKeycloakId = candidacy.organism?.accounts[0].keycloakId;

  const resp = await injectGraphql({
    fastify: (global as any).fastify,
    authorization: authorizationHeaderForUser({
      role: "manage_candidacy",
      keycloakId: organismKeycloakId,
    }),
    payload: {
      requestType: "mutation",
      endpoint: "training_submitTrainingForm",
      arguments: {
        candidacyId: candidacy.id,
        training: {
          ...TRAINING_INPUT,
          candidacyFinancingMethodInfos: [
            {
              candidacyFinancingMethodId:
                CANDIDACY_FINANCING_METHOD_OTHER_SOURCE_ID,
              amount: 4,
            },
          ],
        },
      },
      returnFields: "{id,status}",
    },
  });
  expect(resp.statusCode).toEqual(200);
  expect(resp.json().errors?.[0].message).toEqual(
    "Un motif doit être renseigné quand la modalité de financement 'Autre source de financement' est cochée",
  );
});

test("AAP should be able to submit a basic training form  with an 'other source' financing method with an additional information text", async () => {
  const candidacy = await createCandidacyHelper({
    candidacyArgs: {
      financeModule: "hors_plateforme",
    },
    candidacyActiveStatus: CandidacyStatusStep.PRISE_EN_CHARGE,
  });
  const organismKeycloakId = candidacy.organism?.accounts[0].keycloakId;

  const resp = await injectGraphql({
    fastify: (global as any).fastify,
    authorization: authorizationHeaderForUser({
      role: "manage_candidacy",
      keycloakId: organismKeycloakId,
    }),
    payload: {
      requestType: "mutation",
      endpoint: "training_submitTrainingForm",
      arguments: {
        candidacyId: candidacy.id,
        training: {
          ...TRAINING_INPUT,
          candidacyFinancingMethodInfos: [
            {
              candidacyFinancingMethodId:
                CANDIDACY_FINANCING_METHOD_OTHER_SOURCE_ID,
              amount: 4,
              additionalInformation: "Autre source",
            },
          ],
        },
      },
      returnFields: "{id,status}",
    },
  });
  expect(resp.statusCode).toEqual(200);
  expect(resp.json().data.training_submitTrainingForm).toMatchObject({
    status: "PARCOURS_ENVOYE",
  });
});
