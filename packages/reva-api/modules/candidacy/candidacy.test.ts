/**
 * @jest-environment ./test/fastify-test-env.ts
 */

import { faker } from "@faker-js/faker/.";
import { authorizationHeaderForUser } from "../../test/helpers/authorization-helper";
import { createCandidacyHelper } from "../../test/helpers/entities/create-candidacy-helper";
import { createCandidateHelper } from "../../test/helpers/entities/create-candidate-helper";

import { injectGraphql } from "../../test/helpers/graphql-helper";
import {
  getGraphQLClient,
  getGraphQLError,
} from "../../test/jestGraphqlClient";
import { graphql } from "../graphql/generated";

test("get existing Candidacy with admin user", async () => {
  const candidacy = await createCandidacyHelper();

  const graphqlClient = getGraphQLClient({
    headers: {
      authorization: authorizationHeaderForUser({
        role: "admin",
        keycloakId: "whatever",
      }),
    },
  });

  const getCandidacyById = graphql(`
    query getCandidacyById_with_admin_user($id: ID!) {
      getCandidacyById(id: $id) {
        organismId
        candidate {
          firstname
          lastname
          email
        }
        candidacyStatuses {
          createdAt
          isActive
          status
        }
      }
    }
  `);

  const res = await graphqlClient.request(getCandidacyById, {
    id: candidacy.id,
  });

  expect(res).toMatchObject({
    getCandidacyById: {
      organismId: candidacy.organismId,
      candidate: {
        firstname: candidacy.candidate?.firstname,
        lastname: candidacy.candidate?.lastname,
        email: candidacy.candidate?.email,
      },
    },
  });
});

test("get non existing candidacy should yield errors", async () => {
  const graphqlClient = getGraphQLClient({
    headers: {
      authorization: authorizationHeaderForUser({
        role: "admin",
        keycloakId: "whatever",
      }),
    },
  });

  const getCandidacyById = graphql(`
    query getCandidacyById_does_not_exist($id: ID!) {
      getCandidacyById(id: $id) {
        id
      }
    }
  `);

  const res = await graphqlClient.request(getCandidacyById, {
    id: "fb53327b-8ed9-4238-8e80-007fa1ddcfe6",
  });

  expect(res).toMatchObject({
    getCandidacyById: null,
  });
});

test("a user can't modify the account information of another candidate", async () => {
  const candidate = await createCandidateHelper();
  const anotherCandidate = await createCandidateHelper();

  const graphqlClient = getGraphQLClient({
    headers: {
      authorization: authorizationHeaderForUser({
        role: "candidate",
        keycloakId: candidate.keycloakId,
      }),
    },
  });

  const candidacy_updateContact = graphql(`
    mutation candidacy_updateContact_of_different_candidate(
      $candidateId: ID!
      $candidateData: UpdateCandidateInput!
    ) {
      candidacy_updateContact(
        candidateId: $candidateId
        candidateData: $candidateData
      ) {
        id
      }
    }
  `);

  try {
    await graphqlClient.request(candidacy_updateContact, {
      candidateId: anotherCandidate.id,
      candidateData: { phone: "0612345678" },
    });
  } catch (error) {
    const gqlError = getGraphQLError(error);
    expect(gqlError).toEqual(
      "Vous n'êtes pas autorisé à accéder à cette candidature",
    );
  }
});

test("a candidate can modify all his account information", async () => {
  const candidate = await createCandidateHelper();
  const newCandidate = {
    firstname: "Updated Firstname",
    lastname: "Updated Lastname",
    phone: "0612345678",
    email: faker.internet.email(),
  };

  const res = await injectGraphql({
    fastify: (global as any).fastify,
    authorization: authorizationHeaderForUser({
      role: "candidate",
      keycloakId: candidate.keycloakId,
    }),
    payload: {
      requestType: "mutation",
      endpoint: "candidacy_updateContact",
      arguments: {
        candidateId: candidate.id,
        candidateData: newCandidate,
      },
      returnFields: "{firstname lastname phone email}",
    },
  });

  expect(res.statusCode).toEqual(200);
  expect(res.json().data.candidacy_updateContact).toMatchObject(newCandidate);
});
