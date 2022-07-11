import { addExperience, archiveCandidacyFromId, createCandidacy, deleteCandidacy, getCandidacies, getCandidacyFromDeviceId, getCandidacyFromId, getCompanions, submitCandidacy, takeOverCandidacyFromId, updateAppointmentInformations, updateCertification, updateContact, updateExperience, updateGoals } from "../../../domains/candidacy";
import * as candidacyDb from "../../database/postgres/candidacies";
import * as experienceDb from "../../database/postgres/experiences";
import * as goalDb from "../../database/postgres/goals";
import mercurius from "mercurius";


export const resolvers = {
  Query: {
    getCandidacy: async (other: unknown, { deviceId }: { deviceId: string; }, context: any) => {
      const result = await getCandidacyFromDeviceId({ getCandidacyFromDeviceId: candidacyDb.getCandidacyFromDeviceId })({ deviceId });
      return result.mapLeft(error => new mercurius.ErrorWithProps(error.message, error)).extract();
    },
    getCandidacyById: async (other: unknown, { id }: { id: string; }, context: any) => {
      const result = await getCandidacyFromId({ getCandidacyFromId: candidacyDb.getCandidacyFromId })({ id });
      return result.mapLeft(error => new mercurius.ErrorWithProps(error.message, error)).extract();
    },
    getCandidacies: async (_: unknown, params: { deviceId: string; }) => {
      const result = await getCandidacies({ 
        getCandidacies: candidacyDb.getCandidacies 
      })({ role: "test" });
      return result.mapLeft(error => new mercurius.ErrorWithProps(error.message, error)).extract();
    },
    getCompanions: async () => {
      const result = await getCompanions({ getCompanions: candidacyDb.getCompanions })();

      return result.extract();
    }
  },
  Mutation: {
    candidacy_createCandidacy: async (_: unknown, { candidacy }: { candidacy: { deviceId: string; certificationId: string; }; }) => {

      const result = await createCandidacy({
        createCandidacy: candidacyDb.insertCandidacy,
        getCandidacyFromDeviceId: candidacyDb.getCandidacyFromDeviceId,
      })({ deviceId: candidacy.deviceId, certificationId: candidacy.certificationId });

      return result.mapLeft(error => new mercurius.ErrorWithProps(error.message, error)).extract();
    },
    candidacy_submitCandidacy: async (_: unknown, payload :  { deviceId: string; candidacyId: string; }) => {

      const result = await submitCandidacy({
        updateCandidacyStatus: candidacyDb.updateCandidacyStatus,
        getCandidacyFromId: candidacyDb.getCandidacyFromId,
      })({ candidacyId: payload.candidacyId });

      return result.mapLeft(error => new mercurius.ErrorWithProps(error.message, error)).extract();
    },
    candidacy_updateCertification: async (_: unknown, payload: any) => { 
      const result = await updateCertification({
        updateCertification: candidacyDb.updateCertification,
        getCandidacyFromId: candidacyDb.getCandidacyFromId,
      })({
        candidacyId: payload.candidacyId,
        certificationId: payload.certificationId
      });

      return result.mapLeft(error => new mercurius.ErrorWithProps(error.message, error)).extract();
    },
    candidacy_addExperience: async (_: unknown, payload: any) => {
      const result = await addExperience({
        createExperience: experienceDb.insertExperience,
        getCandidacyFromId: candidacyDb.getCandidacyFromId,
      })({
        candidacyId: payload.candidacyId,
        experience: payload.experience
      });

      return result.mapLeft(error => new mercurius.ErrorWithProps(error.message, error)).extract();
    },
    candidacy_updateExperience: async (_: unknown, payload: any) => {
      const result = await updateExperience({
        updateExperience: experienceDb.updateExperience,
        getExperienceFromId: experienceDb.getExperienceFromId,
        getCandidacyFromId: candidacyDb.getCandidacyFromId,
      })({
        candidacyId: payload.candidacyId,
        experienceId: payload.experienceId,
        experience: payload.experience
      });

      return result.mapLeft(error => new mercurius.ErrorWithProps(error.message, error)).extract();
    },
    candidacy_removeExperience: async (_: unknown, payload: any) => { console.log("candidacy_removeExperience", payload); },


    candidacy_updateGoals: async (_: unknown, payload: any) => { 
      const result = await updateGoals({
        updateGoals: goalDb.updateGoals,
        getCandidacyFromId: candidacyDb.getCandidacyFromId,
      })({
        candidacyId: payload.candidacyId,
        goals: payload.goals
      });

      return result.mapLeft(error => new mercurius.ErrorWithProps(error.message, error)).extract();
    },

    candidacy_updateContact: async (_: unknown, payload: any) => {
      const result = await updateContact({
        updateContact: candidacyDb.updateContactOnCandidacy,
        getCandidacyFromId: candidacyDb.getCandidacyFromId,
      })({
        candidacyId: payload.candidacyId,
        phone: payload.phone,
        email: payload.email
      });

      return result.mapLeft(error => new mercurius.ErrorWithProps(error.message, error)).extract();
    },

    candidacy_deleteById: async (_: unknown, payload: any) => {
      const result = await deleteCandidacy({
        deleteCandidacyFromId: candidacyDb.deleteCandidacyFromId,
      })({
        candidacyId: payload.candidacyId
      });

      return result.mapLeft(error => new mercurius.ErrorWithProps(error.message, error)).extract();
    },

    candidacy_archiveById: async (_: unknown, payload: any) => {
      const result = await archiveCandidacyFromId({
        updateCandidacyStatus: candidacyDb.updateCandidacyStatus,
      })({
        candidacyId: payload.candidacyId
      });

      return result.mapLeft(error => new mercurius.ErrorWithProps(error.message, error)).extract();
    },

    candidacy_updateAppointmentInformations: async (_: unknown, payload: any) => {
      const result = await updateAppointmentInformations({
        updateAppointmentInformations: candidacyDb.updateAppointmentInformations,
      })({
        candidacyId: payload.candidacyId,
        candidateTypologyInformations: payload.candidateTypologyInformations,
        appointmentInformations: payload.appointmentInformations
      });

      return result.mapLeft(error => new mercurius.ErrorWithProps(error.message, error)).extract();
    },

    candidacy_takeOver: async (_: unknown, payload: any) => {
      const result = await takeOverCandidacyFromId({
        existsCandidacyWithActiveStatus: candidacyDb.existsCandidacyWithActiveStatus,
        updateCandidacyStatus: candidacyDb.updateCandidacyStatus,
      })({
        candidacyId: payload.candidacyId
      });

      return result.mapLeft(error => new mercurius.ErrorWithProps(error.message, error)).extract();
    }
  }
};
