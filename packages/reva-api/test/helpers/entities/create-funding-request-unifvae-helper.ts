import { faker } from "@faker-js/faker/.";
import { Prisma } from "@prisma/client";

import { prismaClient } from "@/prisma/client";

import { createCandidacyHelper } from "./create-candidacy-helper";

export const createFundingRequestUnifvaeHelper = async (
  args?: Partial<Prisma.FundingRequestUnifvaeUncheckedCreateInput>,
) => {
  let candidacyId = args?.candidacyId;
  if (!candidacyId) {
    const candidacy = await createCandidacyHelper();
    candidacyId = candidacy.id;
  }

  return prismaClient.fundingRequestUnifvae.create({
    data: {
      candidacyId,
      numAction: faker.string.uuid(),
      individualHourCount: 0,
      individualCost: 0,
      collectiveHourCount: 0,
      collectiveCost: 0,
      basicSkillsCost: 0,
      basicSkillsHourCount: 0,
      mandatoryTrainingsHourCount: 0,
      mandatoryTrainingsCost: 0,
      certificateSkillsHourCount: 0,
      certificateSkillsCost: 0,
      otherTrainingCost: 0,
      otherTrainingHourCount: 0,
      certificateSkills: "",
      otherTraining: "",
      ...args,
    },
  });
};
