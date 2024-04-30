import { composeResolvers } from "@graphql-tools/resolvers-composition";
import { CandidateTypology, Organism } from "@prisma/client";
import mercurius from "mercurius";

import { prismaClient } from "../../prisma/client";
import { Role } from "../account/account.types";
import { logCandidacyAuditEvent } from "../candidacy-log/features/logCandidacyAuditEvent";
import { generateJwt } from "../candidate/auth.helper";
import * as organismDb from "../organism/database/organisms";
import { Organism as OrganismCamelCase } from "../organism/organism.types";
import { getDropOutReasonById } from "../referential/features/getDropOutReasonById";
import { getReorientationReasonById } from "../referential/features/getReorientationReasonById";
import {
  FunctionalCodeError,
  FunctionalError,
} from "../shared/error/functionalError";
import { logger } from "../shared/logger";
import {
  Admissibility,
  AdmissibilityFvae,
  Candidacy,
  CandidacyBusinessEvent,
  CandidacyStatusFilter,
  SearchOrganismFilter,
} from "./candidacy.types";
import * as admissibilityDb from "./database/admissibility";
import * as basicSkillDb from "./database/basicSkills";
import * as candidacyDb from "./database/candidacies";
import * as experienceDb from "./database/experiences";
import * as trainingDb from "./database/trainings";
import { cancelDropOutCandidacyEvent } from "./events";
import { addExperienceToCandidacy } from "./features/addExperienceToCandidacy";
import { archiveCandidacy } from "./features/archiveCandidacy";
import { cancelDropOutCandidacy } from "./features/cancelDropOutCandidacy";
import { deleteCandidacy } from "./features/deleteCandidacy";
import { dropOutCandidacy } from "./features/dropOutCandidacy";
import { getAAPsWithZipCode } from "./features/getAAPsWithZipCode";
import { getAdmissibility } from "./features/getAdmissibility";
import { getAdmissibilityFvae } from "./features/getAdmissibilityFvae";
import { getBasicSkills } from "./features/getBasicSkills";
import { getCandidacySummaries } from "./features/getCandicacySummaries";
import { getCandidacy } from "./features/getCandidacy";
import { getCandidacyCcns } from "./features/getCandidacyCcns";
import { getCandidacyCountByStatus } from "./features/getCandidacyCountByStatus";
import { getCandidacyGoals } from "./features/getCandidacyGoals";
import { getCompanionsForCandidacy } from "./features/getCompanionsForCandidacy";
import { getActiveOrganismsForCandidacyWithNewTypologies } from "./features/getOrganismsForCandidacy";
import { getRandomOrganismsForCandidacyWithNewTypologies } from "./features/getRandomOrganismsForCandidacy";
import { getTrainings } from "./features/getTrainings";
import { selectOrganismForCandidacy } from "./features/selectOrganismForCandidacy";
import { setReadyForJuryEstimatedAt } from "./features/setReadyForJuryEstimatedAt";
import { submitCandidacy } from "./features/submitCandidacy";
import { submitTraining } from "./features/submitTrainingForm";
import { takeOverCandidacy } from "./features/takeOverCandidacy";
import { unarchiveCandidacy } from "./features/unarchiveCandidacy";
import { updateAdmissibility } from "./features/updateAdmissibility";
import { updateAdmissibilityFvae } from "./features/updateAdmissibilityFvae";
import { updateAppointmentInformations } from "./features/updateAppointmentInformations";
import { updateCandidacyTypologyAndCcn } from "./features/updateCandidacyTypologyAndCcn";
import { updateCertificationOfCandidacy } from "./features/updateCertificationOfCandidacy";
import { updateCertificationWithinOrganismScope } from "./features/updateCertificationWithinOrganismScope";
import { updateContactOfCandidacy } from "./features/updateContactOfCandidacy";
import { updateExperienceOfCandidacy } from "./features/updateExperienceOfCandidacy";
import { updateGoalsOfCandidacy } from "./features/updateGoalsOfCandidacy";
import { confirmTrainingFormByCandidate } from "./features/validateTrainingFormByCandidate";
import { logCandidacyEvent } from "./logCandidacyEvent";
import { logCandidacyEventUsingPurify } from "./logCandidacyEventUsingPurify";
import {
  sendCandidacyArchivedEmailToCertificateur,
  sendCandidacyDropOutEmailToCandidate,
  sendCandidacyDropOutEmailToCertificateur,
  sendTrainingEmail,
} from "./mails";
import { resolversSecurityMap } from "./security/security";

const withBasicSkills = (c: Candidacy) => ({
  ...c,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  basicSkillIds: c.basicSkills.reduce((memo, bs) => {
    return [...memo, bs.basicSkill.id];
  }, []),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  basicSkills: c.basicSkills.map((bs) => bs.basicSkill),
});

const withMandatoryTrainings = (c: Candidacy) => ({
  ...c,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mandatoryTrainingIds: c.trainings.reduce((memo, t) => {
    return [...memo, t.training.id];
  }, []),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mandatoryTrainings: c.trainings.map((t) => t.training),
});

const unsafeResolvers = {
  Candidacy: {
    admissibility: async (
      parent: Candidacy,
      _: unknown,
      context: { auth: { hasRole: (role: Role) => boolean } },
    ) => {
      const result = await getAdmissibility({
        hasRole: context.auth.hasRole,
        getAdmissibilityFromCandidacyId:
          admissibilityDb.getAdmissibilityFromCandidacyId,
      })({ candidacyId: parent.id });
      return result
        .mapLeft((error) => new mercurius.ErrorWithProps(error.message, error))
        .map((v) => v.extractNullable())
        .extract();
    },
    admissibilityFvae: async (parent: Candidacy) => {
      return getAdmissibilityFvae({ candidacyId: parent.id });
    },
    goals: async ({ id: candidacyId }: Candidacy) =>
      getCandidacyGoals({ candidacyId }),
  },
  Query: {
    getCandidacyById: async (_: unknown, { id }: { id: string }) => {
      const result = await getCandidacy({
        getCandidacyFromId: candidacyDb.getCandidacyFromId,
      })({ id });
      return result
        .map(withBasicSkills)
        .map(withMandatoryTrainings)
        .mapLeft((error) => new mercurius.ErrorWithProps(error.message, error))
        .extract();
    },
    getCandidacies: async (
      _parent: unknown,
      _params: {
        limit?: number;
        offset?: number;
        statusFilter?: CandidacyStatusFilter;
        searchFilter?: string;
      },
      context: GraphqlContext,
    ) => {
      try {
        return getCandidacySummaries({
          hasRole: context.auth.hasRole,
          iAMId: context.auth?.userInfo?.sub || "",
          ..._params,
        });
      } catch (e) {
        logger.error(e);
        throw new mercurius.ErrorWithProps((e as Error).message, e as Error);
      }
    },
    getTrainings: async () => {
      const result = await getTrainings({
        getTrainings: trainingDb.getTrainings,
      })();

      return result.extract();
    },
    getOrganismsForCandidacy: async (
      _: unknown,
      params: { candidacyId: string },
    ) => {
      const result = await getActiveOrganismsForCandidacyWithNewTypologies({
        getActiveOrganismForCertificationAndDepartment:
          organismDb.getActiveOrganismForCertificationAndDepartment,
        getCandidacyFromId: candidacyDb.getCandidacyFromId,
      })({ candidacyId: params.candidacyId });

      return result
        .mapLeft((error) => new mercurius.ErrorWithProps(error.message, error))
        .extract();
    },
    getRandomOrganismsForCandidacy: async (
      _: unknown,
      {
        candidacyId,
        searchFilter,
        searchText,
        searchZip,
      }: {
        candidacyId: string;
        searchFilter: SearchOrganismFilter;
        searchText?: string;
        searchZip?: string;
      },
    ) => {
      const candidacy = await prismaClient.candidacy.findUnique({
        where: { id: candidacyId },
        include: { organism: true },
      });

      let organismsFound: OrganismCamelCase[];

      if (
        searchZip &&
        searchZip.length === 5 &&
        searchFilter?.distanceStatus === "ONSITE"
      ) {
        organismsFound = await getAAPsWithZipCode({
          zip: searchZip,
          pmr: searchFilter.pmr,
          limit: 51,
          searchText,
        });
      } else {
        const result = await getRandomOrganismsForCandidacyWithNewTypologies({
          getRandomActiveOrganismForCertificationAndDepartment:
            organismDb.getRandomActiveOrganismForCertificationAndDepartment,
          getCandidacyFromId: candidacyDb.getCandidacyFromId,
        })({ candidacyId, searchText, searchFilter, limit: 51 });

        result.mapLeft(
          (error) => new mercurius.ErrorWithProps(error.message, error),
        );

        if (result.isLeft()) {
          return result.mapLeft(
            (error) => new mercurius.ErrorWithProps(error.message, error),
          );
        }

        const data = result.extract() as {
          rows: Organism[];
          totalRows: number;
        };

        organismsFound = data.rows
          .filter((c) => c.id !== candidacy?.organism?.id)
          .slice(0, 50);
      }

      return {
        totalRows: organismsFound?.length ?? 0,
        rows: organismsFound,
      };
    },
    getBasicSkills: async () => {
      const result = await getBasicSkills({
        getBasicSkills: basicSkillDb.getBasicSkills,
      })();

      return result.extract();
    },
    getCompanionsForCandidacy: async (
      _: unknown,
      params: { candidacyId: string },
    ) => {
      const candidacy = await prismaClient.candidacy.findUnique({
        where: { id: params.candidacyId },
        include: { organism: true },
      });
      if (candidacy) {
        //companion organisms are fetched differently if the candidacy organism typology is "experimentation" or not
        const result = await (candidacy.organism?.typology === "experimentation"
          ? getCompanionsForCandidacy({
              getCompanionsForCandidacy: organismDb.getCompanionOrganisms,
            })({ candidacyId: params.candidacyId })
          : getActiveOrganismsForCandidacyWithNewTypologies({
              getActiveOrganismForCertificationAndDepartment:
                organismDb.getActiveOrganismForCertificationAndDepartment,
              getCandidacyFromId: candidacyDb.getCandidacyFromId,
            })({ candidacyId: params.candidacyId }));

        return result
          .mapLeft(
            (error) => new mercurius.ErrorWithProps(error.message, error),
          )
          .extract();
      }
      return [];
    },
    candidacy_candidacyCountByStatus: (
      _: unknown,
      _params: {
        searchFilter?: string;
      },
      context: GraphqlContext,
    ) =>
      getCandidacyCountByStatus({
        hasRole: context.auth!.hasRole,
        IAMId: context.auth!.userInfo!.sub,
        searchFilter: _params.searchFilter,
      }),
    candidacy_getCandidacyCcns: async (
      _parent: unknown,
      params: {
        limit?: number;
        offset?: number;
        searchFilter?: string;
      },
      context: GraphqlContext,
    ) => {
      try {
        if (context.auth.userInfo?.sub == undefined) {
          throw new FunctionalError(
            FunctionalCodeError.TECHNICAL_ERROR,
            "Not authorized",
          );
        }

        return getCandidacyCcns(
          {
            hasRole: context.auth.hasRole,
          },
          params,
        );
      } catch (e) {
        logger.error(e);
        throw new mercurius.ErrorWithProps((e as Error).message, e as Error);
      }
    },
  },
  Mutation: {
    candidacy_submitCandidacy: async (
      _: unknown,
      payload: { deviceId: string; candidacyId: string },
      context: GraphqlContext,
    ) => {
      const result = await submitCandidacy({
        candidacyId: payload.candidacyId,
      });

      logCandidacyEvent({
        candidacyId: payload.candidacyId,
        eventType: CandidacyBusinessEvent.SUBMITTED_CANDIDACY,
        context,
        result: result as Record<string, any>,
      });
      await logCandidacyAuditEvent({
        candidacyId: payload.candidacyId,
        eventType: "CANDIDACY_SUBMITTED",
        userKeycloakId: context.auth.userInfo?.sub,
        userEmail: context.auth.userInfo?.email,
        userRoles: context.auth.userInfo?.realm_access?.roles || [],
      });
      return result;
    },
    candidacy_updateCertification: async (
      _: unknown,
      payload: any,
      context: GraphqlContext,
    ) => {
      const result = await updateCertificationOfCandidacy({
        candidacyId: payload.candidacyId,
        certificationId: payload.certificationId,
        departmentId: payload.departmentId,
        userKeycloakId: context.auth.userInfo?.sub,
        userEmail: context.auth?.userInfo?.email,
        userRoles: context.auth.userInfo?.realm_access?.roles || [],
      });

      return result;
    },
    candidacy_updateCertificationWithinOrganismScope: async (
      _: unknown,
      payload: any,
      context: GraphqlContext,
    ) => {
      const result = await updateCertificationWithinOrganismScope({
        hasRole: context.auth.hasRole,
        candidacyId: payload.candidacyId,
        certificationId: payload.certificationId,
        userKeycloakId: context.auth.userInfo?.sub,
        userEmail: context.auth?.userInfo?.email,
        userRoles: context.auth.userInfo?.realm_access?.roles || [],
      });

      return result;
    },
    candidacy_addExperience: async (
      _: unknown,
      payload: any,
      context: GraphqlContext,
    ) => {
      const result = await addExperienceToCandidacy({
        createExperience: experienceDb.insertExperience,
        getCandidacyFromId: candidacyDb.getCandidacyFromId,
      })({
        candidacyId: payload.candidacyId,
        experience: payload.experience,
        userRoles: context.auth.userInfo?.realm_access?.roles || [],
      });
      logCandidacyEventUsingPurify({
        candidacyId: payload.candidacyId,
        eventType: CandidacyBusinessEvent.ADDED_EXPERIENCE,
        extraInfo: result.isRight()
          ? {
              experienceId: result.extract().id,
            }
          : undefined,
        context,
        result,
      });

      if (result.isRight()) {
        await logCandidacyAuditEvent({
          candidacyId: payload.candidacyId,
          eventType: "EXPERIENCE_ADDED",
          userKeycloakId: context.auth.userInfo?.sub,
          userEmail: context.auth.userInfo?.email,
          userRoles: context.auth.userInfo?.realm_access?.roles || [],
        });
      }
      return result
        .mapLeft((error) => new mercurius.ErrorWithProps(error.message, error))
        .extract();
    },
    candidacy_updateExperience: async (
      _: unknown,
      payload: any,
      context: GraphqlContext,
    ) => {
      const result = await updateExperienceOfCandidacy({
        updateExperience: experienceDb.updateExperience,
        getExperienceFromId: experienceDb.getExperienceFromId,
        getCandidacyFromId: candidacyDb.getCandidacyFromId,
      })({
        candidacyId: payload.candidacyId,
        experienceId: payload.experienceId,
        experience: payload.experience,
        userRoles: context.auth.userInfo?.realm_access?.roles || [],
      });
      logCandidacyEventUsingPurify({
        candidacyId: payload.candidacyId,
        eventType: CandidacyBusinessEvent.UPDATED_EXPERIENCE,
        context,
        result,
      });

      if (result.isRight()) {
        await logCandidacyAuditEvent({
          candidacyId: payload.candidacyId,
          eventType: "EXPERIENCE_UPDATED",
          userKeycloakId: context.auth.userInfo?.sub,
          userEmail: context.auth.userInfo?.email,
          userRoles: context.auth.userInfo?.realm_access?.roles || [],
        });
      }
      return result
        .mapLeft((error) => new mercurius.ErrorWithProps(error.message, error))
        .extract();
    },
    candidacy_removeExperience: async (_: unknown, payload: any) => {
      //TODO resolve the fixme because it doesnt do shit
      // FIXME : this actually doesn't do shit
      logger.info("candidacy_removeExperience", payload);
    },

    candidacy_updateGoals: async (
      _: unknown,
      payload: any,
      context: GraphqlContext,
    ) => {
      const result = await updateGoalsOfCandidacy({
        updateGoals: candidacyDb.updateCandidacyGoals,
        getCandidacyFromId: candidacyDb.getCandidacyFromId,
      })({
        candidacyId: payload.candidacyId,
        goals: payload.goals,
      });
      logCandidacyEventUsingPurify({
        candidacyId: payload.candidacyId,
        eventType: CandidacyBusinessEvent.UPDATED_GOALS,
        context,
        result: result.map((n) => ({ n })), // typing hack for nothing
      });

      if (result.isRight()) {
        await logCandidacyAuditEvent({
          candidacyId: payload.candidacyId,
          eventType: "GOALS_UPDATED",
          userKeycloakId: context.auth.userInfo?.sub,
          userEmail: context.auth.userInfo?.email,
          userRoles: context.auth.userInfo?.realm_access?.roles || [],
        });
      }
      return result
        .mapLeft((error) => new mercurius.ErrorWithProps(error.message, error))
        .extract();
    },

    candidacy_updateContact: async (
      _: unknown,
      params: {
        candidateId: string;
        candidateData: {
          firstname: string;
          lastname: string;
          phone: string;
          email: string;
        };
      },
      context: GraphqlContext,
    ) => {
      try {
        const result = await updateContactOfCandidacy(params);

        const candidacies = await prismaClient.candidacy.findMany({
          where: { candidateId: params.candidateId },
          select: { id: true },
        });

        await Promise.all(
          candidacies.map(async (c) =>
            logCandidacyAuditEvent({
              candidacyId: c.id,
              eventType: "CONTACT_INFO_UPDATED",
              userKeycloakId: context.auth.userInfo?.sub,
              userEmail: context.auth.userInfo?.email,
              userRoles: context.auth.userInfo?.realm_access?.roles || [],
            }),
          ),
        );

        return result;
      } catch (e) {
        logger.error(e);
        throw new mercurius.ErrorWithProps((e as Error).message, e as Error);
      }
    },

    candidacy_deleteById: async (
      _: unknown,
      payload: any,
      context: GraphqlContext,
    ) => {
      const result = await deleteCandidacy({
        deleteCandidacyFromId: candidacyDb.deleteCandidacyFromId,
      })({
        candidacyId: payload.candidacyId,
      });
      logCandidacyEventUsingPurify({
        candidacyId: payload.candidacyId,
        context,
        result: result.map((s) => ({ s })), // typing hack for nothing
        eventType: CandidacyBusinessEvent.DELETED_CANDIDACY,
      });
      if (result.isRight()) {
        await logCandidacyAuditEvent({
          candidacyId: payload.candidacyId,
          eventType: "CANDIDACY_DELETED",
          userKeycloakId: context.auth.userInfo?.sub,
          userEmail: context.auth.userInfo?.email,
          userRoles: context.auth.userInfo?.realm_access?.roles || [],
        });
      }
      return result
        .mapLeft((error) => new mercurius.ErrorWithProps(error.message, error))
        .extract();
    },

    candidacy_archiveById: async (
      _: unknown,
      payload: any,
      context: GraphqlContext,
    ) => {
      const result = await archiveCandidacy({
        archiveCandidacy: candidacyDb.archiveCandidacy,
        getCandidacyFromId: candidacyDb.getCandidacyFromId,
        getReorientationReasonById,
        hasRole: context.auth.hasRole,
      })({
        candidacyId: payload.candidacyId,
        reorientationReasonId: payload.reorientationReasonId,
      });

      const candidacy = result.isRight() ? result.extract() : undefined;
      if (candidacy?.id) {
        sendCandidacyArchivedEmailToCertificateur(candidacy.id);
      }

      logCandidacyEventUsingPurify({
        candidacyId: payload.candidacyId,
        context,
        result,
        eventType: CandidacyBusinessEvent.ARCHIVED_CANDIDACY,
        extraInfo: {
          reorientationReasonId: payload.reorientationReasonId,
        },
      });

      if (result.isRight()) {
        await logCandidacyAuditEvent({
          candidacyId: payload.candidacyId,
          eventType: "CANDIDACY_ARCHIVED",
          userKeycloakId: context.auth.userInfo?.sub,
          userEmail: context.auth.userInfo?.email,
          userRoles: context.auth.userInfo?.realm_access?.roles || [],
        });
      }
      return result
        .mapLeft((error) => new mercurius.ErrorWithProps(error.message, error))
        .extract();
    },
    candidacy_unarchiveById: async (
      _: unknown,
      payload: any,
      context: GraphqlContext,
    ) => {
      const result = await unarchiveCandidacy({
        unarchiveCandidacy: candidacyDb.unarchiveCandidacy,
        getCandidacyFromId: candidacyDb.getCandidacyFromId,
        hasRole: context.auth.hasRole,
      })({
        candidacyId: payload.candidacyId,
      });
      logCandidacyEventUsingPurify({
        context,
        result,
        eventType: CandidacyBusinessEvent.UNARCHIVED_CANDIDACY,
      });
      if (result.isRight()) {
        await logCandidacyAuditEvent({
          candidacyId: payload.candidacyId,
          eventType: "CANDIDACY_UNARCHIVED",
          userKeycloakId: context.auth.userInfo?.sub,
          userEmail: context.auth.userInfo?.email,
          userRoles: context.auth.userInfo?.realm_access?.roles || [],
        });
      }
      return result
        .mapLeft((error) => new mercurius.ErrorWithProps(error.message, error))
        .extract();
    },
    candidacy_updateAppointmentInformations: async (
      _: unknown,
      payload: any,
      context: GraphqlContext,
    ) => {
      const result = await updateAppointmentInformations({
        updateAppointmentInformations:
          candidacyDb.updateAppointmentInformations,
      })({
        candidacyId: payload.candidacyId,
        appointmentInformations: payload.appointmentInformations,
      });
      logCandidacyEventUsingPurify({
        candidacyId: payload.candidacyId,
        eventType: CandidacyBusinessEvent.UPDATED_APPOINTMENT_INFO,
        extraInfo: { ...payload.appointmentInformations },
        context,
        result,
      });
      if (result.isRight()) {
        await logCandidacyAuditEvent({
          candidacyId: payload.candidacyId,
          eventType: "APPOINTMENT_INFO_UPDATED",
          userKeycloakId: context.auth.userInfo?.sub,
          userEmail: context.auth.userInfo?.email,
          userRoles: context.auth.userInfo?.realm_access?.roles || [],
          details: {
            firstAppointmentOccuredAt:
              payload.appointmentInformations.firstAppointmentOccuredAt,
          },
        });
      }
      return result
        .mapLeft((error) => new mercurius.ErrorWithProps(error.message, error))
        .extract();
    },

    candidacy_takeOver: async (
      _: unknown,
      payload: any,
      context: GraphqlContext,
    ) => {
      const result = await takeOverCandidacy({
        existsCandidacyWithActiveStatus:
          candidacyDb.existsCandidacyWithActiveStatus,
        updateCandidacyStatus: candidacyDb.updateCandidacyStatus,
      })({
        candidacyId: payload.candidacyId,
      });
      logCandidacyEventUsingPurify({
        candidacyId: payload.candidacyId,
        eventType: CandidacyBusinessEvent.TOOK_OVER_CANDIDACY,
        context,
        result,
      });
      if (result.isRight()) {
        await logCandidacyAuditEvent({
          candidacyId: payload.candidacyId,
          eventType: "CANDIDACY_TAKEN_OVER",
          userKeycloakId: context.auth.userInfo?.sub,
          userEmail: context.auth.userInfo?.email,
          userRoles: context.auth.userInfo?.realm_access?.roles || [],
        });
      }
      return result
        .mapLeft((error) => new mercurius.ErrorWithProps(error.message, error))
        .extract();
    },

    candidacy_selectOrganism: async (
      _: unknown,
      payload: any,
      context: GraphqlContext,
    ) => {
      const result = await selectOrganismForCandidacy({
        candidacyId: payload.candidacyId,
        organismId: payload.organismId,
        userKeycloakId: context.auth.userInfo?.sub,
        userEmail: context.auth.userInfo?.email,
        userRoles: context.auth.userInfo?.realm_access?.roles || [],
      });

      return result;
    },
    candidacy_submitTypologyForm: async (
      _: unknown,
      payload: {
        candidacyId: string;
        typology: CandidateTypology;
        additionalInformation?: string;
        ccnId?: string;
      },
      context: GraphqlContext,
    ) => {
      try {
        if (context.auth.userInfo?.sub == undefined) {
          throw new FunctionalError(
            FunctionalCodeError.TECHNICAL_ERROR,
            "Not authorized",
          );
        }

        await updateCandidacyTypologyAndCcn(context.auth, payload);
        return candidacyDb.getCandidacyFromId(payload.candidacyId);
      } catch (e) {
        logger.error(e);
        throw new mercurius.ErrorWithProps((e as Error).message, e as Error);
      }
    },
    candidacy_submitTrainingForm: async (
      _: unknown,
      payload: any,
      context: GraphqlContext,
    ) => {
      const result = await submitTraining({
        updateTrainingInformations: candidacyDb.updateTrainingInformations,
        existsCandidacyHavingHadStatus:
          candidacyDb.existsCandidacyHavingHadStatus,
        updateCandidacyStatus: candidacyDb.updateCandidacyStatus,
      })({
        candidacyId: payload.candidacyId,
        training: payload.training,
      });

      const candidacy = result.isRight() ? result.extract() : undefined;
      if (candidacy?.email) {
        const token = generateJwt(
          { email: candidacy?.email, action: "login" },
          1 * 60 * 60 * 24 * 4,
        );
        sendTrainingEmail(candidacy.email, token);
      }

      logCandidacyEventUsingPurify({
        candidacyId: payload.candidacyId,
        eventType: CandidacyBusinessEvent.SUBMITTED_TRAINING_FORM,
        extraInfo: {
          training: payload.training,
        },
        context,
        result,
      });
      if (result.isRight()) {
        await logCandidacyAuditEvent({
          candidacyId: payload.candidacyId,
          eventType: "TRAINING_FORM_SUBMITTED",
          userKeycloakId: context.auth.userInfo?.sub,
          userEmail: context.auth.userInfo?.email,
          userRoles: context.auth.userInfo?.realm_access?.roles || [],
        });
      }
      return result
        .mapLeft((error) => new mercurius.ErrorWithProps(error.message, error))
        .extract();
    },

    candidacy_confirmTrainingForm: async (
      _: unknown,
      { candidacyId }: { candidacyId: string },
      context: GraphqlContext,
    ) => {
      const result = await confirmTrainingFormByCandidate({
        existsCandidacyWithActiveStatus:
          candidacyDb.existsCandidacyWithActiveStatus,
        updateCandidacyStatus: candidacyDb.updateCandidacyStatus,
      })({
        candidacyId: candidacyId,
      });
      logCandidacyEventUsingPurify({
        candidacyId,
        eventType: CandidacyBusinessEvent.CONFIRMED_TRAINING_FORM,
        context,
        result,
      });
      if (result.isRight()) {
        await logCandidacyAuditEvent({
          candidacyId,
          eventType: "TRAINING_FORM_CONFIRMED",
          userKeycloakId: context.auth.userInfo?.sub,
          userEmail: context.auth.userInfo?.email,
          userRoles: context.auth.userInfo?.realm_access?.roles || [],
        });
      }
      return result
        .mapLeft((error) => new mercurius.ErrorWithProps(error.message, error))
        .extract();
    },
    candidacy_dropOut: async (
      _: unknown,
      payload: {
        candidacyId: string;
        dropOut: {
          dropOutReasonId: string;
          droppedOutAt?: number;
          otherReasonContent?: string;
        };
      },
      context: GraphqlContext,
    ) => {
      const droppedOutAt: Date = payload.dropOut.droppedOutAt
        ? new Date(payload.dropOut.droppedOutAt)
        : new Date();

      const result = await dropOutCandidacy({
        getCandidacyFromId: candidacyDb.getCandidacyFromId,
        getDropOutReasonById,
        dropOutCandidacy: candidacyDb.dropOutCandidacy,
      })({
        candidacyId: payload.candidacyId,
        dropOutReasonId: payload.dropOut.dropOutReasonId,
        otherReasonContent: payload.dropOut.otherReasonContent,
        droppedOutAt,
      });

      const candidacy = result.isRight() ? result.extract() : undefined;
      if (candidacy?.email) {
        sendCandidacyDropOutEmailToCandidate(candidacy.email);
      }

      if (candidacy?.id) {
        sendCandidacyDropOutEmailToCertificateur(candidacy.id);
      }

      logCandidacyEventUsingPurify({
        candidacyId: payload.candidacyId,
        eventType: CandidacyBusinessEvent.DROPPED_OUT_CANDIDACY,
        extraInfo: { ...payload.dropOut },
        context,
        result,
      });
      if (result.isRight()) {
        await logCandidacyAuditEvent({
          candidacyId: payload.candidacyId,
          eventType: "CANDIDACY_DROPPED_OUT",
          userKeycloakId: context.auth.userInfo?.sub,
          userEmail: context.auth.userInfo?.email,
          userRoles: context.auth.userInfo?.realm_access?.roles || [],
        });
      }
      return result
        .mapLeft((error) => new mercurius.ErrorWithProps(error.message, error))
        .extract();
    },
    candidacy_cancelDropOutById: async (
      _: unknown,
      payload: {
        candidacyId: string;
      },
      context: GraphqlContext,
    ) => {
      const result = await cancelDropOutCandidacy({
        getCandidacyFromId: candidacyDb.getCandidacyFromId,
        cancelDropOutCandidacy: candidacyDb.cancelDropOutCandidacy,
      })({
        candidacyId: payload.candidacyId,
      });

      // Save candidacyDropOut as AuditEvent
      const accountId = context.auth.userInfo?.sub;

      const candidacyDropOut = result.isRight()
        ? result.extract().candidacyDropOut
        : undefined;

      if (accountId && candidacyDropOut) {
        await cancelDropOutCandidacyEvent(accountId, candidacyDropOut);
      }

      logCandidacyEventUsingPurify({
        candidacyId: payload.candidacyId,
        eventType: CandidacyBusinessEvent.CANCELED_DROPPED_OUT_CANDIDACY,
        extraInfo: { candidacyDropOut },
        context,
        result,
      });

      if (result.isRight()) {
        await logCandidacyAuditEvent({
          candidacyId: payload.candidacyId,
          eventType: "CANDIDACY_DROP_OUT_CANCELED",
          userKeycloakId: context.auth.userInfo?.sub,
          userEmail: context.auth.userInfo?.email,
          userRoles: context.auth.userInfo?.realm_access?.roles || [],
        });
      }

      return result
        .mapLeft((error) => new mercurius.ErrorWithProps(error.message, error))
        .extract();
    },
    candidacy_updateAdmissibility: async (
      _: unknown,
      {
        candidacyId,
        admissibility,
      }: { candidacyId: string; admissibility: Admissibility },
      context: GraphqlContext,
    ) => {
      const result = await updateAdmissibility({
        getAdmissibilityFromCandidacyId:
          admissibilityDb.getAdmissibilityFromCandidacyId,
        updateAdmissibility: admissibilityDb.updateAdmissibility,
      })({
        candidacyId,
        admissibility,
      });
      logCandidacyEventUsingPurify({
        candidacyId,
        eventType: CandidacyBusinessEvent.UPDATED_ADMISSIBILITY,
        extraInfo: { admissibility },
        context,
        result,
      });

      if (result.isRight()) {
        await logCandidacyAuditEvent({
          candidacyId,
          eventType: "ADMISSIBILITY_UPDATED",
          userKeycloakId: context.auth.userInfo?.sub,
          userEmail: context.auth.userInfo?.email,
          userRoles: context.auth.userInfo?.realm_access?.roles || [],
        });
      }

      return result
        .mapLeft((error) => new mercurius.ErrorWithProps(error.message, error))
        .extract();
    },
    candidacy_updateAdmissibilityFvae: (
      _: unknown,
      {
        candidacyId,
        admissibility,
      }: {
        candidacyId: string;
        admissibility: AdmissibilityFvae;
      },
      context: GraphqlContext,
    ) =>
      updateAdmissibilityFvae({
        params: {
          candidacyId,
          ...admissibility,
          userKeycloakId: context.auth.userInfo?.sub,
          userEmail: context.auth.userInfo?.email,
          userRoles: context.auth.userInfo?.realm_access?.roles || [],
        },
      }),
    candidacy_setReadyForJuryEstimatedAt: async (
      _parent: unknown,
      params: {
        candidacyId: string;
        readyForJuryEstimatedAt: Date;
      },
      context: GraphqlContext,
    ) => {
      const result = await setReadyForJuryEstimatedAt(params);
      await logCandidacyAuditEvent({
        candidacyId: params.candidacyId,
        eventType: "READY_FOR_JURY_ESTIMATED_DATE_UPDATED",
        userKeycloakId: context.auth.userInfo?.sub,
        userRoles: context.auth.userInfo?.realm_access?.roles || [],
        userEmail: context.auth.userInfo?.email,
        details: { readyForJuryEstimatedAt: params.readyForJuryEstimatedAt },
      });
      return result;
    },
  },
};

export const resolvers = composeResolvers(
  unsafeResolvers,
  resolversSecurityMap,
);
