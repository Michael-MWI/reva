import { prismaClient } from "../../../../prisma/client";
import { DematerializedFeasibilityFileCreateOrUpdateEligibilityRequirementInput } from "../dematerialized-feasibility-file.types";
import { getDematerializedFeasibilityFileByCandidacyId } from "./getDematerializedFeasibilityFileByCandidacyId";
import { getDematerializedFeasibilityFileWithPrerequisitesByCandidacyId } from "./getDematerializedFeasibilityFileWithPrerequisitesByCandidacyId";
import { resetDFFSentToCandidateState } from "./resetDFFSentToCandidateState";

export const createOrUpdateEligibilityRequirement = async ({
  candidacyId,
  input: { eligibilityRequirement, eligibilityValidUntil },
}: {
  input: DematerializedFeasibilityFileCreateOrUpdateEligibilityRequirementInput;
  candidacyId: string;
}) => {
  const dFF =
    await getDematerializedFeasibilityFileWithPrerequisitesByCandidacyId({
      candidacyId,
    });

  if (!dFF) {
    throw new Error("Dossier de faisabilité dématérialisé non trouvé");
  }

  const eligibilityValidUntilDate = eligibilityValidUntil
    ? new Date(eligibilityValidUntil).toISOString()
    : null;

  const hasChangedEligibilityRequirement =
    dFF.eligibilityRequirement !== eligibilityRequirement;
  const hasChangedEligibilityValidUntil =
    dFF.eligibilityValidUntil !== eligibilityValidUntilDate;

  if (hasChangedEligibilityRequirement) {
    await prismaClient.dematerializedFeasibilityFile.update({
      where: {
        id: dFF.id,
      },
      data: {
        eligibilityRequirement,
        eligibilityValidUntil: eligibilityValidUntilDate,
        aapDecision: null,
        aapDecisionComment: null,
        dffCertificationCompetenceDetails: {
          deleteMany: {},
        },
        dffCertificationCompetenceBlocs: {
          updateMany: {
            where: {},
            data: {
              text: "",
              complete: false,
            },
          },
        },
        competenceBlocsPartCompletion: "TO_COMPLETE",
      },
    });
  } else if (hasChangedEligibilityValidUntil) {
    await prismaClient.dematerializedFeasibilityFile.update({
      where: {
        id: dFF.id,
      },
      data: {
        eligibilityValidUntil: eligibilityValidUntilDate,
      },
    });
  }

  if (
    dFF.sentToCandidateAt &&
    (hasChangedEligibilityRequirement || hasChangedEligibilityValidUntil)
  ) {
    await resetDFFSentToCandidateState(dFF);
  }

  return getDematerializedFeasibilityFileByCandidacyId({
    candidacyId,
  });
};
