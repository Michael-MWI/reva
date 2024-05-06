import { composeResolvers } from "@graphql-tools/resolvers-composition";

import { getCertificationCompetenceById } from "../referential/features/getCertificationCompetenceById";
import { getCompetenceBlocsById } from "../referential/features/getCompetenceBlocsById";
import { resolversSecurityMap } from "./dematerialized-feasibility-file.security";
import {
  DematerializedFeasibilityFileCreateOrUpdateCertificationCompetenceDetailsInput,
  DematerializedFeasibilityFileCreateOrUpdateCertificationInfoInput,
} from "./dematerialized-feasibility-file.types";
import { createOrUpdateCertificationCompetenceDetails } from "./features/createOrUpdateCertificationCompetenceDetails";
import { createOrUpdateCertificationInfo } from "./features/createOrUpdateCertificationInfo";
import { getBlocsDeCompetencesByDFFId } from "./features/getBlocsDeCompetencesByDFFId";
import { getCertificationCompetenceDetailsByDFFId } from "./features/getCertificationCompetenceDetailsByDFFId";
import { getDematerializedFeasibilityFileByCandidacyId } from "./features/getDematerializedFeasibilityFileByCandidacyId";

export const unsafeResolvers = {
  DematerializedFeasibilityFile: {
    blocsDeCompetences: (
      {
        id: dematerializedFeasibilityFileId,
      }: {
        id: string;
      },
      { blocDeCompetencesId }: { blocDeCompetencesId?: string },
    ) =>
      blocDeCompetencesId
        ? [getCompetenceBlocsById({ competenceBlocId: blocDeCompetencesId })]
        : getBlocsDeCompetencesByDFFId({ dematerializedFeasibilityFileId }),
    certificationCompetenceDetails: ({
      id: dematerializedFeasibilityFileId,
    }: {
      id: string;
    }) =>
      getCertificationCompetenceDetailsByDFFId({
        dematerializedFeasibilityFileId,
      }),
  },
  CertificationCompetenceDetails: {
    certificationCompetence: ({
      certificationCompetenceId,
    }: {
      certificationCompetenceId: string;
    }) => getCertificationCompetenceById({ certificationCompetenceId }),
  },
  Candidacy: {
    dematerializedFeasibilityFile: ({ id: candidacyId }: { id: string }) =>
      getDematerializedFeasibilityFileByCandidacyId({ candidacyId }),
  },
  Mutation: {
    dematerialized_feasibility_file_createOrUpdateCertificationInfo: (
      _parent: unknown,
      params: {
        input: DematerializedFeasibilityFileCreateOrUpdateCertificationInfoInput;
      },
    ) => createOrUpdateCertificationInfo({ input: params.input }),
    dematerialized_feasibility_file_createOrupdateCertificationCompetenceDetails:
      (
        _parent: unknown,
        params: {
          input: DematerializedFeasibilityFileCreateOrUpdateCertificationCompetenceDetailsInput;
        },
      ) =>
        createOrUpdateCertificationCompetenceDetails({
          ...params.input,
        }),
  },
};

export const dematerializedFeasibilityFileResolvers = composeResolvers(
  unsafeResolvers,
  resolversSecurityMap,
);
