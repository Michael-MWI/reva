import * as path from "path";

import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import {
  TimestampResolver,
  TimestampTypeDefinition,
  UUIDDefinition,
  UUIDResolver,
  VoidResolver,
  VoidTypeDefinition,
} from "graphql-scalars";
import mercurius, { MercuriusOptions } from "mercurius";

import { loaders as accountLoaders } from "./account/account.loaders";
import { resolvers as accountResolvers } from "./account/account.resolvers";
import { candidacyLogLoaders } from "./candidacy-log/candidacy-log.loaders";
import { candidacyLogResolvers } from "./candidacy-log/candidacy-log.resolvers";
import { candidacyMenuResolvers } from "./candidacy-menu/candidacy-menu.resolvers";
import * as candidacy from "./candidacy/candidacy.resolvers";
import { candidateResolvers } from "./candidate/candidate.resolvers";
import { certificationAuthorityLoaders } from "./certification-authority/certification-authority.loaders";
import { resolvers as certificationAuthorityResolvers } from "./certification-authority/certification-authority.resolvers";
import { dematerializedFeasibilityFileResolvers } from "./dematerialized-feasibility-file/dematerialized-feasibility-file.resolvers";
import { dossierDeValidationLoaders } from "./dossier-de-validation/dossier-de-validation.loaders";
import { dossierDeValidationResolvers } from "./dossier-de-validation/dossier-de-validation.resolvers";
import { feasibilityLoaders } from "./feasibility/feasibility.loaders";
import { feasibilityResolvers } from "./feasibility/feasibility.resolvers";
import { featureFlippingResolvers } from "./feature-flipping/feature-flipping.resolvers";
import { financeUnifvaeResolvers } from "./finance/unifvae/finance.unifvae.resolvers";
import { financeResolvers } from "./finance/unireva/finance.resolvers";
import { juryLoaders } from "./jury/jury.loaders";
import { juryResolvers } from "./jury/jury.resolvers";
import { organismLoaders } from "./organism/organism.loaders";
import { organismResolvers } from "./organism/organism.resolvers";
import { referentialLoaders } from "./referential/referential.loaders";
import { referentialResolvers } from "./referential/referential.resolvers";
import { logger } from "./shared/logger";
import DecimalGraphqlScalar from "./shared/scalar/DecimalGraphqlScalar";
import { subscriptionRequestResolvers } from "./subscription/subscription.resolvers";
import { GraphQLUpload } from "graphql-upload-minimal";

// Resolvers

const typeDefs = loadFilesSync(
  path.join(__dirname, "./**/!(generated-graphql-schema).graphql"),
);

const resolvers = mergeResolvers([
  candidacy.resolvers,
  referentialResolvers,
  accountResolvers,
  candidateResolvers,
  financeResolvers,
  subscriptionRequestResolvers,
  feasibilityResolvers,
  financeUnifvaeResolvers,
  organismResolvers,
  certificationAuthorityResolvers,
  feasibilityResolvers,
  featureFlippingResolvers,
  dossierDeValidationResolvers,
  juryResolvers,
  candidacyLogResolvers,
  candidacyMenuResolvers,
  dematerializedFeasibilityFileResolvers,
]);
resolvers.Void = VoidResolver;
resolvers.Timestamp = TimestampResolver;
resolvers.UUID = UUIDResolver;
resolvers.Decimal = DecimalGraphqlScalar;
resolvers.Upload = GraphQLUpload;

export const graphqlConfiguration: MercuriusOptions = {
  schema: makeExecutableSchema({
    typeDefs: mergeTypeDefs([
      ...typeDefs,
      TimestampTypeDefinition,
      VoidTypeDefinition,
      UUIDDefinition,
    ]),
    resolvers,
  }),
  graphiql: !!process.env.GRAPHIQL,
  loaders: {
    ...accountLoaders,
    ...feasibilityLoaders,
    ...organismLoaders,
    ...certificationAuthorityLoaders,
    ...referentialLoaders,
    ...dossierDeValidationLoaders,
    ...juryLoaders,
    ...candidacyLogLoaders,
  },
  errorFormatter: (error, ...args) => {
    error.errors
      ? error.errors.forEach((e) => logger.error(e))
      : logger.error(error);

    return {
      ...mercurius.defaultErrorFormatter(error, ...args),
      statusCode: 200,
    };
  },
};
