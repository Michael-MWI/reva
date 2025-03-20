import { composeResolvers } from "@graphql-tools/resolvers-composition";

import { prismaClient } from "../../prisma/client";
import { getCertificationById } from "./features/getCertificationById";
import { getCertificationCompetencesByBlocId } from "./features/getCertificationCompetencesByBlocId";
import { getConventionsCollectivesByCertificationId } from "./features/getConventionsCollectivesByCertificationId";
import { getDegreeByLevel } from "./features/getDegreeByLevel";
import { getDegrees } from "./features/getDegrees";
import { getDepartments } from "./features/getDepartments";
import { getDropOutReasons } from "./features/getDropOutReasons";
import { getGoals } from "./features/getGoals";
import { getRegionById } from "./features/getRegionById";
import { getRegions } from "./features/getRegions";
import { getReorientationReasons } from "./features/getReorientationReasons";
import { getVulnerabilityIndicators } from "./features/getVulnerabilityIndicators";
import { searchCertificationsForAdmin } from "./features/searchCertificationsForAdmin";
import { updateCompetenceBlocsByCertificationId } from "./features/updateCompetenceBlocsByCertificationId";
import { referentialResolversSecurityMap } from "./referential.security";
import {
  CreateCompetenceBlocInput,
  UpdateCompetenceBlocInput,
  UpdateCompetenceBlocsInput,
  UpdateCertificationStructureAndCertificationAuthoritiesInput,
  SendCertificationToRegistryManagerInput,
  ResetCompetenceBlocsByCertificationIdInput,
  UpdateCertificationPrerequisitesInput,
  UpdateCertificationDescriptionInput,
  ValidateCertificationInput,
  UpdateCertificationAdditionalInfoInput,
} from "./referential.types";
import { RNCPCertification, RNCPReferential } from "./rncp";
import {
  findEtablissement,
  findEtablissementDiffusible,
  findKbis,
  findQualiopiStatus,
} from "./features/entreprise";
import { searchCertificationsForCandidate } from "./features/searchCertificationsForCandidate";
import { getAvailableFormacodes } from "./features/getFormacodes";
import { getActiveCertifications } from "./features/getActiveCertifications";
import { getCandidacyFinancingMethods } from "./features/getCandidacyFinancingMethods";
import { getCertificationCompetenceBlocById } from "./features/getCertificationCompetenceBlocById";
import { updateCertificationCompetenceBloc } from "./features/updateCertificationCompetenceBloc";
import { addCertification } from "./features/addCertification";
import { deleteCertificationCompetenceBloc } from "./features/deleteCertificationCompetenceBloc";
import { getCompetenceBlocsByCertificationId } from "./features/getCompetenceBlocsByCertificationId";
import { getDomainsByCertificationId } from "./features/getDomainsByCertificationId";
import { getDomainsByFormacodes } from "./features/getDomainsByFormacodes";
import { createCertificationCompetenceBloc } from "./features/createCertificationCompetenceBloc";
import { updateCertificationStructureAndCertificationAuthorities } from "./features/updateCertificationStructureAndCertificationAuthorities";
import { sendCertificationToRegistryManager } from "./features/sendCertificationToRegistryManager";
import { resetCompetenceBlocsByCertificationId } from "./features/resetCompetenceBlocsByCertificationId";
import { searchCertificationsV2ForRegistryManager } from "./features/searchCertificationsV2ForRegistryManager";
import { getCertificationPrerequisitesByCertificationId } from "./features/getCertificationPrerequisitesByCertificationId";
import { updateCertificationPrerequisites } from "./features/updateCertificationPrerequisites";
import { updateCertificationDescription } from "./features/updateCertificationDescription";
import { validateCertification } from "./features/validateCertification";
import { getAdditionalInfoByCertificationId } from "./features/getAdditionalInfoByCertificationId";
import { updateCertificationAdditionalInfo } from "./features/updateCertificationAdditionalInfo";
import { getFileNameAndUrl } from "./features/getDvTemplateNameAndUrl";
import { isAapAvailableForCertificationId } from "./features/isAapAvailableForCertificationId";

const unsafeReferentialResolvers = {
  Certification: {
    codeRncp: ({ rncpId, codeRncp }: { rncpId: string; codeRncp: string }) =>
      codeRncp || rncpId,
    typeDiplome: ({ rncpTypeDiplome }: { rncpTypeDiplome: string }) =>
      rncpTypeDiplome,
    degree: ({ level }: { level: number }) => getDegreeByLevel({ level }),
    conventionsCollectives: ({ id: certificationId }: { id: string }) =>
      getConventionsCollectivesByCertificationId({ certificationId }),
    competenceBlocs: async (
      {
        id: certificationId,
      }: {
        id: string;
        rncpId: string;
      },
      _payload: unknown,
    ) => getCompetenceBlocsByCertificationId({ certificationId }),
    domains: ({ id: certificationId }: { id: string }) =>
      getDomainsByCertificationId({ certificationId }),
    prerequisites: ({ id: certificationId }: { id: string }) =>
      getCertificationPrerequisitesByCertificationId({ certificationId }),
    additionalInfo: ({ id: certificationId }: { id: string }) =>
      getAdditionalInfoByCertificationId({ certificationId }),
    isAapAvailable: ({ id: certificationId }: { id: string }) =>
      isAapAvailableForCertificationId({ certificationId }),
  },
  CertificationAdditionalInfo: {
    dossierDeValidationTemplate: ({
      dossierDeValidationTemplateFileId,
    }: {
      dossierDeValidationTemplateFileId: string;
    }) => getFileNameAndUrl({ fileId: dossierDeValidationTemplateFileId }),
  },
  FCCertification: {
    DOMAINS: ({
      FORMACODES,
    }: {
      FORMACODES: RNCPCertification["FORMACODES"];
    }) => getDomainsByFormacodes({ FORMACODES }),
  },
  CertificationCompetenceBloc: {
    competences: ({ id: certificationCompetenceBlocId }: { id: string }) =>
      getCertificationCompetencesByBlocId({ certificationCompetenceBlocId }),
    certification: ({ certificationId }: { certificationId: string }) =>
      getCertificationById({ certificationId }),
  },
  Department: {
    region: ({ regionId }: { regionId: string }) =>
      getRegionById({ id: regionId }),
  },
  EtablissementDiffusible: {
    qualiopiStatus: ({ siret }: { siret: string }) =>
      findQualiopiStatus({ siret }),
  },
  Etablissement: {
    qualiopiStatus: ({ siret }: { siret: string }) =>
      findQualiopiStatus({ siret }),
    kbis: ({ siret }: { siret: string }) => findKbis({ siret }),
  },
  Query: {
    getReferential: async (_: any, _payload: any) => {
      const goals = await getGoals();

      return {
        goals: goals,
      };
    },
    searchCertificationsForCandidate: async (
      _: any,
      payload: {
        offset?: number;
        limit?: number;
        organismId?: string;
        searchText?: string;
      },
    ) => searchCertificationsForCandidate(payload),
    searchCertificationsForAdmin: (_: any, payload: any) =>
      searchCertificationsForAdmin({
        offset: payload.offset,
        limit: payload.limit,
        searchText: payload.searchText,
        status: payload.status,
        visible: payload.visible,
      }),
    searchCertificationsV2ForRegistryManager: (
      _: any,
      payload: any,
      context: GraphqlContext,
    ) =>
      searchCertificationsV2ForRegistryManager({
        userKeycloakId: context.auth.userInfo?.sub || "",
        offset: payload.offset,
        limit: payload.limit,
        searchText: payload.searchText,
        status: payload.status,
        visible: payload.visible,
      }),
    getCertification: (
      _: unknown,
      { certificationId }: { certificationId: string },
    ) => getCertificationById({ certificationId }),
    getRegions,
    getDepartments: (
      _: unknown,
      { elligibleVAE }: { elligibleVAE?: boolean },
    ) => getDepartments({ elligibleVAE }),
    getDegrees,
    getVulnerabilityIndicators,
    getDropOutReasons,
    getReorientationReasons,
    getConventionCollectives: () =>
      prismaClient.conventionCollective.findMany(),
    getFCCertification: (_: unknown, { rncp }: { rncp: string }) =>
      RNCPReferential.getInstance().findOneByRncp(rncp),
    getCountries: () =>
      prismaClient.country.findMany({
        orderBy: {
          label: "asc",
        },
      }),
    getEtablissement: (_: unknown, { siret }: { siret: string }) =>
      findEtablissementDiffusible({ siret }),
    getEtablissementAsAdmin: (_: unknown, { siret }: { siret: string }) =>
      findEtablissement({ siret }),
    getFormacodes: () => getAvailableFormacodes(),
    getActiveCertifications: (
      _: any,
      payload: {
        filters?: {
          domaines?: string[];
          branches?: string[];
          levels?: number[];
        };
      },
    ) => getActiveCertifications(payload.filters),
    getCandidacyFinancingMethods,
    getCertificationCompetenceBloc: (
      _: unknown,
      {
        certificationCompetenceBlocId,
      }: {
        certificationCompetenceBlocId: string;
      },
    ) => getCertificationCompetenceBlocById({ certificationCompetenceBlocId }),
  },
  Mutation: {
    referential_updateCompetenceBlocsByCertificationId: (
      _parent: unknown,
      { input }: { input: UpdateCompetenceBlocsInput },
    ) => updateCompetenceBlocsByCertificationId(input),
    referential_createCertificationCompetenceBloc: (
      _parent: unknown,
      { input }: { input: CreateCompetenceBlocInput },
    ) => createCertificationCompetenceBloc(input),
    referential_updateCertificationCompetenceBloc: (
      _parent: unknown,
      { input }: { input: UpdateCompetenceBlocInput },
    ) => updateCertificationCompetenceBloc(input),
    referential_deleteCertificationCompetenceBloc: (
      _parent: unknown,
      {
        certificationId,
        certificationCompetenceBlocId,
      }: { certificationId: string; certificationCompetenceBlocId: string },
    ) =>
      deleteCertificationCompetenceBloc({
        certificationId,
        certificationCompetenceBlocId,
      }),
    referential_addCertification: (
      _parent: unknown,
      { input }: { input: { codeRncp: string } },
    ) => addCertification(input),
    referential_updateCertificationStructureAndCertificationAuthorities: (
      _parent: unknown,
      {
        input,
      }: {
        input: UpdateCertificationStructureAndCertificationAuthoritiesInput;
      },
    ) => updateCertificationStructureAndCertificationAuthorities(input),
    referential_sendCertificationToRegistryManager: (
      _parent: unknown,
      { input }: { input: SendCertificationToRegistryManagerInput },
    ) => sendCertificationToRegistryManager(input),
    referential_resetCompetenceBlocsByCertificationId: (
      _parent: unknown,
      { input }: { input: ResetCompetenceBlocsByCertificationIdInput },
    ) => resetCompetenceBlocsByCertificationId(input),
    referential_updateCertificationPrerequisites: (
      _parent: unknown,
      { input }: { input: UpdateCertificationPrerequisitesInput },
    ) => updateCertificationPrerequisites(input),
    referential_updateCertificationDescription: (
      _parent: unknown,
      { input }: { input: UpdateCertificationDescriptionInput },
    ) => updateCertificationDescription(input),
    referential_validateCertification: (
      _parent: unknown,
      { input }: { input: ValidateCertificationInput },
    ) => validateCertification(input),
    referential_updateCertificationAdditionalInfo: (
      _parent: unknown,
      { input }: { input: UpdateCertificationAdditionalInfoInput },
    ) => updateCertificationAdditionalInfo(input),
  },
};

export const referentialResolvers = composeResolvers(
  unsafeReferentialResolvers,
  referentialResolversSecurityMap,
);
