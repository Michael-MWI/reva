import { FeasibilityStatus, Prisma } from "@prisma/client";
import { candidateSearchWord } from "../../candidate/utils/candidate.helpers";
import { buildContainsFilterClause } from "../../shared/search/search";

export type FeasibilityStatusFilter =
  | FeasibilityStatus
  | "ALL"
  | "ARCHIVED"
  | "DROPPED_OUT";

export const getWhereClauseFromStatusFilter = (
  statusFilter?: FeasibilityStatusFilter
) => {
  let whereClause: Prisma.FeasibilityWhereInput = { isActive: true };
  const excludeArchivedAndDroppedOutCandidacy: Prisma.FeasibilityWhereInput = {
    candidacy: {
      candidacyStatuses: { none: { isActive: true, status: "ARCHIVE" } },
      candidacyDropOut: { is: null },
    },
  };
  switch (statusFilter) {
    case "ALL":
      whereClause = {
        ...whereClause,
        ...excludeArchivedAndDroppedOutCandidacy,
      };
      break;
    case "PENDING":
    case "REJECTED":
    case "ADMISSIBLE":
    case "INCOMPLETE":
      whereClause = {
        ...whereClause,
        decision: statusFilter,
        ...excludeArchivedAndDroppedOutCandidacy,
      };
      break;

    case "ARCHIVED":
      whereClause = {
        ...whereClause,
        candidacy: {
          candidacyStatuses: { some: { isActive: true, status: "ARCHIVE" } },
        },
      };
      break;
    case "DROPPED_OUT":
      whereClause = {
        ...whereClause,
        candidacy: {
          candidacyDropOut: { isNot: null },
        },
      };
      break;
  }
  return whereClause;
};

export const feasibilitySearchWord = (word: string) => {
  const containsFilter = buildContainsFilterClause(word);
  return {
    OR: [
      { candidate: candidateSearchWord(word) },
      { organism: containsFilter("label") },
      { department: containsFilter("label") },
      {
        certificationsAndRegions: {
          some: {
            certification: containsFilter("label"),
          },
        },
      },
    ],
  };
};
