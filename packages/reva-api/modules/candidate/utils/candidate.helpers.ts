import { buildContainsFilterClause } from "../../shared/search/search";

export const candidateSearchWord = (word: string) => {
  const containsFilter = buildContainsFilterClause(word);
  return {
    OR: [
      containsFilter("lastname"),
      containsFilter("firstname"),
      containsFilter("firstname2"),
      containsFilter("firstname3"),
      containsFilter("email"),
      containsFilter("phone"),
    ],
  };
};

export const CANDIDATE_APP_URL = `${process.env.BASE_URL}/candidat`;
