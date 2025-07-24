import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { useGraphQlClient } from "@/components/graphql/graphql-client/GraphqlClient";
import { graphql } from "@/graphql/generated";

const getCandidacyById = graphql(`
  query getCandidacyByIdForAAPJuryPage($candidacyId: ID!) {
    getCandidacyById(id: $candidacyId) {
      id
      jury {
        id
        dateOfSession
        timeSpecified
        addressOfSession
        informationOfSession
        result
        dateOfResult
        informationOfResult
        isResultTemporary
      }
      historyJury {
        id
        dateOfSession
        timeSpecified
        addressOfSession
        informationOfSession
        result
        dateOfResult
        informationOfResult
      }
    }
  }
`);

export const useJuryAAP = () => {
  const { graphqlClient } = useGraphQlClient();
  const { candidacyId } = useParams<{
    candidacyId: string;
  }>();

  const { data: getCandidacyByIdResponse } = useQuery({
    queryKey: [candidacyId, "getCandidacyByIdForAAPJuryPage"],
    queryFn: () =>
      graphqlClient.request(getCandidacyById, {
        candidacyId,
      }),
  });

  const candidacy = getCandidacyByIdResponse?.getCandidacyById;

  return {
    candidacy,
  };
};
