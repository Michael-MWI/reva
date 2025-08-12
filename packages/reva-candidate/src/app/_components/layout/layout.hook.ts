import { useQuery } from "@tanstack/react-query";

import { useKeycloakContext } from "@/components/auth/keycloak.context";
import { useGraphQlClient } from "@/components/graphql/graphql-client/GraphqlClient";

import { graphql } from "@/graphql/generated";

const GET_CANDIDATE_WITH_CANDIDACY_FOR_LAYOUT = graphql(`
  query candidate_getCandidateWithCandidacyForLayout {
    candidate_getCandidateWithCandidacy {
      candidacy {
        activite
        derniereDateActivite
        typeAccompagnement
      }
    }
  }
`);

export const useLayout = () => {
  const { graphqlClient } = useGraphQlClient();
  const { authenticated } = useKeycloakContext();

  const { data, isLoading } = useQuery({
    queryKey: ["candidate", "layout"],
    queryFn: () =>
      graphqlClient.request(GET_CANDIDATE_WITH_CANDIDACY_FOR_LAYOUT),
    enabled: authenticated,
  });

  const candidate = data?.candidate_getCandidateWithCandidacy;

  return {
    candidate,
    isLoading,
  };
};
