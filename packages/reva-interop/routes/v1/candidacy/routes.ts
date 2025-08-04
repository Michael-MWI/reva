import {
  FastifyPluginAsyncJsonSchemaToTs,
  JsonSchemaToTsProvider,
} from "@fastify/type-provider-json-schema-to-ts";

import { mapCandidacyObject } from "../../../utils/mappers/candidacy.js";
import { getCandidacyDetails } from "../features/candidacies/getCandidacyDetails.js";
import { candidacyIdSchema } from "../schemas.js";

const candidacyRoutesApiV1: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
) => {
  fastify
    .withTypeProvider<
      JsonSchemaToTsProvider<{
        ValidatorSchemaOptions: {
          references: [typeof candidacyIdSchema];
        };
      }>
    >()
    .route({
      method: "GET",
      url: "/candidatures/:candidatureId",
      schema: {
        summary: "Récupérer les détails d'une candidature",
        // security: [{ bearerAuth: [] }, { oauth: [] }],
        tags: ["Candidature"],
        params: {
          type: "object",
          properties: {
            candidatureId: {
              $ref: "http://vae.gouv.fr/components/schemas/CandidatureId",
            },
          },
          required: ["candidatureId"],
        },
        response: {
          200: {
            description: "Détails de la candidature",
            $ref: "http://vae.gouv.fr/components/schemas/CandidatureResponse",
          },
        },
      },
      handler: async (request, reply) => {
        const r = await getCandidacyDetails(
          request.graphqlClient,
          request.params.candidatureId,
        );
        if (r) {
          reply.send({
            data: mapCandidacyObject(r),
          });
        } else {
          reply.status(204).send();
        }
      },
    });
};

export default candidacyRoutesApiV1;
