import { composeResolvers } from "@graphql-tools/resolvers-composition";
import { PaymentRequest } from "@prisma/client";
import mercurius from "mercurius";

import { logCandidacyAuditEvent } from "../../candidacy-log/features/logCandidacyAuditEvent";
import { Candidacy } from "../../candidacy/candidacy.types";
import {
  existsCandidacyWithActiveStatus,
  getCandidacyFromId,
  updateCandidacyStatus,
} from "../../candidacy/database/candidacies";
import { getAfgsuTrainingId } from "../../candidacy/features/getAfgsuTrainingId";
import { getCandidateByCandidacyId } from "../../candidate/database/candidates";
import * as fundingRequestsDb from "./database/fundingRequests";
import * as paymentRequestsDb from "./database/paymentRequest";
import * as paymentRequestBatchesDb from "./database/paymentRequestBatches";
import { confirmPaymentRequest } from "./features/confirmPaymentRequest";
import { createOrUpdatePaymentRequestForCandidacy } from "./features/createOrUpdatePaymentRequestForCandidacy";
import { getFundingRequest } from "./features/getFundingRequest";
import { getPaymentRequestByCandidacyId } from "./features/getPaymentRequestByCandidacyId";
import { resolversSecurityMap } from "./security";
import { getFundingRequestByCandidacyId } from "./features/getFundingRequestByCandidacyId";
import { Either, Left, Maybe } from "purify-ts";
import { Candidate } from "../../candidate/candidate.types";

const unsafeResolvers = {
  Candidacy: {
    paymentRequest: (parent: Candidacy) =>
      getPaymentRequestByCandidacyId({
        candidacyId: parent.id,
      }),
    fundingRequest: ({ id: candidacyId }: Candidacy) =>
      getFundingRequestByCandidacyId({ candidacyId }),
  },
  Query: {
    candidate_getFundingRequest: async (
      _: unknown,
      params: { candidacyId: string },
      context: { auth: any },
    ) => {
      const result = await getFundingRequest({
        hasRole: context.auth.hasRole,
        getCandidacyFromId,
        getFundingRequestFromCandidacyId: fundingRequestsDb.getFundingRequest,
      })({ candidacyId: params.candidacyId });

      return result
        .map((fundingRequestInformations: any) => {
          return {
            fundingRequest: fundingRequestInformations.fundingRequest,
            training: {
              ...fundingRequestInformations.training,
              mandatoryTrainings:
                fundingRequestInformations.training.mandatoryTrainings,
            },
          };
        })
        .mapLeft((error) => new mercurius.ErrorWithProps(error.message, error))
        .extract();
    },
  },
  Mutation: {
    candidacy_createOrUpdatePaymentRequest: async (
      _: unknown,
      {
        candidacyId,
        paymentRequest,
      }: { candidacyId: string; paymentRequest: PaymentRequest },
      context: GraphqlContext,
    ) => {
      const result = await createOrUpdatePaymentRequestForCandidacy({
        getCandidateByCandidacyId: async (
          id: string,
        ): Promise<Either<string, Candidate>> => {
          try {
            const result = await getCandidateByCandidacyId(id);
            return Maybe.fromNullable(result).toEither("Candidat non trouvé");
          } catch (_) {
            return Left("Erreur pendant la récupération du candidat");
          }
        },
        getFundingRequestByCandidacyId: fundingRequestsDb.getFundingRequest,
        getPaymentRequestByCandidacyId:
          paymentRequestsDb.getPaymentRequestByCandidacyId,
        createPaymentRequest: paymentRequestsDb.createPaymentRequest,
        updatePaymentRequest: paymentRequestsDb.updatePaymentRequest,
        getAfgsuTrainingId: getAfgsuTrainingId,
      })({
        candidacyId,
        paymentRequest,
      });
      if (result.isRight()) {
        await logCandidacyAuditEvent({
          candidacyId,
          userKeycloakId: context.auth.userInfo?.sub,
          userEmail: context.auth.userInfo?.email,
          userRoles: context.auth.userInfo?.realm_access?.roles || [],
          eventType: "PAYMENT_REQUEST_CREATED_OR_UPDATED",
        });
      }

      return result
        .mapLeft((error) =>
          error.errors?.length
            ? new mercurius.ErrorWithProps(error.errors[0], {
                businessErrors: error.errors,
              })
            : new mercurius.ErrorWithProps(error.message, error),
        )
        .extract();
    },
    candidacy_confirmPaymentRequest: async (
      _: unknown,
      { candidacyId }: { candidacyId: string },
      context: GraphqlContext,
    ) => {
      const result = await confirmPaymentRequest({
        hasRole: context.auth.hasRole,
        existsCandidacyWithActiveStatus,
        getPaymentRequestByCandidacyId:
          paymentRequestsDb.getPaymentRequestByCandidacyId,
        updateCandidacyStatus,
        createPaymentRequestBatch:
          paymentRequestBatchesDb.createPaymentRequestBatch,
        getFundingRequestByCandidacyId: fundingRequestsDb.getFundingRequest,
        getCandidacyFromId,
      })({
        candidacyId: candidacyId,
      });

      if (result.isRight()) {
        await logCandidacyAuditEvent({
          candidacyId,
          userKeycloakId: context.auth.userInfo?.sub,
          userEmail: context.auth.userInfo?.email,
          userRoles: context.auth.userInfo?.realm_access?.roles || [],
          eventType: "PAYMENT_REQUEST_CONFIRMED",
        });
      }

      return result
        .mapLeft((error) =>
          error.errors?.length
            ? new mercurius.ErrorWithProps(error.errors[0], {
                businessErrors: error.errors,
              })
            : new mercurius.ErrorWithProps(error.message, error),
        )
        .extract();
    },
  },
};

export const financeResolvers = composeResolvers(
  unsafeResolvers,
  resolversSecurityMap,
);
