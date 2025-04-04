import { GraphQLClient } from "graphql-request";

import { GRAPHQL_API_URL } from "@/config/config";

import { useKeycloakContext } from "@/components/auth/keycloak.context";

export const useGraphQlClient = () => {
  const { accessToken } = useKeycloakContext();

  const headers: HeadersInit = {};
  if (accessToken) {
    headers.authorization = `Bearer ${accessToken}`;
  }

  const graphqlClient = new GraphQLClient(GRAPHQL_API_URL, { headers });

  return { graphqlClient };
};

export const getSsrGraphQlClient = () => {
  const graphqlClient = new GraphQLClient(GRAPHQL_API_URL);
  return { graphqlClient };
};
