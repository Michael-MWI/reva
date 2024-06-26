export const GRAPHQL_API_URL =
  process.env.NEXT_PUBLIC_WEBSITE_API_GRAPHQL ||
  "http://localhost:8080/api/graphql";

export const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_WEBSITE_STRAPI_BASE_URL || "http://localhost:1337";

export const STRAPI_GRAPHQL_API_URL = STRAPI_BASE_URL + "/graphql";

export const FeatureFlags = {};
