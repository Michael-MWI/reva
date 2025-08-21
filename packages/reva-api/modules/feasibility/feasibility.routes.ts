import fastifyMultipart from "@fastify/multipart";
import { FastifyPluginAsync } from "fastify";

import { UploadedFile, getDownloadLink } from "@/modules/shared/file";
import { logger } from "@/modules/shared/logger";
import { isCandidateOwnerOfCandidacyFeature } from "@/modules/shared/security/middlewares/isCandidateOwnerOfCandidacy.security";
import { prismaClient } from "@/prisma/client";

import {
  canDownloadFeasibilityFiles,
  canUserManageCandidacy,
  createFeasibility,
  getActiveFeasibilityByCandidacyid,
  handleFeasibilityDecision,
} from "./feasibility.features";

interface UploadFeasibilityFileRequestBody {
  candidacyId: { value: string };
  certificationAuthorityId: { value: string };
  feasibilityFile: UploadedFile;
  IDFile: UploadedFile;
  documentaryProofFile?: UploadedFile;
  certificateOfAttendanceFile?: UploadedFile;
}

type MimeType = "application/pdf" | "image/png" | "image/jpg" | "image/jpeg";

export const feasibilityFileUploadRoute: FastifyPluginAsync = async (
  server,
) => {
  const maxUploadFileSizeInBytes = 20971520;

  server.register(fastifyMultipart, {
    attachFieldsToBody: true,
    limits: { fileSize: maxUploadFileSizeInBytes },
  });

  server.get<{ Params: { candidacyId: string; fileId: string } }>(
    "/candidacy/:candidacyId/feasibility/file/:fileId",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            feasibilityId: { type: "string" },
            fileId: { type: "string" },
          },
          required: ["candidacyId", "fileId"],
        },
      },
      handler: async (request, reply) => {
        const { candidacyId, fileId } = request.params;

        const feasibility = await getActiveFeasibilityByCandidacyid({
          candidacyId,
        });

        if (!feasibility) {
          return reply.status(500).send({
            err: "Dossier de faisabilité non trouvé.",
          });
        }

        const authorized = await canDownloadFeasibilityFiles({
          hasRole: request.auth.hasRole,
          feasibility: feasibility,
          candidacyId,
          keycloakId: request.auth?.userInfo?.sub,
        });

        if (!authorized) {
          return reply.status(403).send({
            err: "Vous n'êtes pas autorisé à accéder à ce fichier.",
          });
        }

        const feasibilityUploadedPdf = feasibility?.feasibilityUploadedPdf;
        const dematerializedFeasibilityFile =
          feasibility?.dematerializedFeasibilityFile;

        if (
          ![
            feasibilityUploadedPdf?.feasibilityFileId,
            feasibilityUploadedPdf?.IDFileId,
            feasibilityUploadedPdf?.documentaryProofFileId,
            feasibilityUploadedPdf?.certificateOfAttendanceFileId,
            feasibility?.decisionFileId,
            dematerializedFeasibilityFile?.feasibilityFileId,
          ].includes(fileId)
        ) {
          return reply.status(403).send({
            err: "Vous n'êtes pas autorisé à visualiser ce fichier.",
          });
        }

        const file = await prismaClient.file.findUnique({
          where: { id: fileId },
        });

        if (!file) {
          throw new Error("Fichier non trouvé");
        }

        const fileLink = await getDownloadLink(file?.path);

        if (fileLink) {
          reply
            .code(200)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({ url: fileLink });

          return;
        }

        reply.status(400).send("Fichier non trouvé.");
      },
    },
  );

  server.post<{
    Body: UploadFeasibilityFileRequestBody;
  }>("/feasibility/upload-feasibility-file", {
    schema: {
      body: {
        type: "object",
        properties: {
          candidacyId: {
            type: "object",
            properties: {
              value: {
                type: "string",
              },
            },
          },
          certificationAuthorityId: {
            type: "object",
            properties: {
              value: {
                type: "string",
              },
            },
          },
          feasibilityFile: { type: "object" },
          IDFile: { type: "object" },
          documentaryProofFile: { type: "object" },
          certificateOfAttendanceFile: { type: "object" },
        },
        required: ["candidacyId", "certificationAuthorityId"],
      },
    },
    handler: async (request, reply) => {
      const authorized = await canUserManageCandidacy({
        hasRole: request.auth.hasRole,
        candidacyId: request.body.candidacyId.value,
        keycloakId: request.auth?.userInfo?.sub,
      });

      const isCandidateOwner = await isCandidateOwnerOfCandidacyFeature({
        candidacyId: request.body.candidacyId.value,
        keycloakId: request.auth?.userInfo?.sub,
      });

      if (!authorized && !isCandidateOwner) {
        return reply.status(403).send({
          err: "Vous n'êtes pas autorisé à gérer cette candidature.",
        });
      }

      const feasibilityFile = request.body.feasibilityFile;
      const IDFile = request.body.IDFile;
      const documentaryProofFile = request.body.documentaryProofFile;
      const certificateOfAttendanceFile =
        request.body.certificateOfAttendanceFile;

      if (!hasValidMimeType(feasibilityFile, ["application/pdf"])) {
        return reply
          .status(400)
          .send(
            `Le type de fichier du "dossier de faisabilité" n'est pas pris en charge. Veuillez soumettre un document PDF.`,
          );
      }

      if (
        !hasValidMimeType(IDFile, [
          "application/pdf",
          "image/png",
          "image/jpg",
          "image/jpeg",
        ])
      ) {
        return reply
          .status(400)
          .send(
            `Le type de fichier de la "pièce d’identité" n'est pas pris en charge. Veuillez soumettre un document PDF, JPG, JPEG, PNG.`,
          );
      }

      if (
        (documentaryProofFile &&
          !hasValidMimeType(documentaryProofFile, ["application/pdf"])) ||
        (certificateOfAttendanceFile &&
          !hasValidMimeType(certificateOfAttendanceFile, ["application/pdf"]))
      ) {
        return reply
          .status(400)
          .send(
            `Ce type de fichier n'est pas pris en charge. Veuillez soumettre un document PDF.`,
          );
      }

      if (
        feasibilityFile._buf?.byteLength > maxUploadFileSizeInBytes ||
        IDFile._buf?.byteLength > maxUploadFileSizeInBytes ||
        (documentaryProofFile?._buf?.byteLength ?? 0) >
          maxUploadFileSizeInBytes ||
        (certificateOfAttendanceFile?._buf?.byteLength ?? 0) >
          maxUploadFileSizeInBytes
      ) {
        return reply
          .status(413)
          .send(
            `La taille du fichier dépasse la taille maximum autorisée. Veuillez soumettre un fichier de moins de ${Math.floor(
              maxUploadFileSizeInBytes / 1024 / 1024,
            )} Mo.`,
          );
      }

      try {
        await createFeasibility({
          candidacyId: request.body.candidacyId.value,
          certificationAuthorityId: request.body.certificationAuthorityId.value,
          feasibilityFile,
          IDFile,
          documentaryProofFile,
          certificateOfAttendanceFile,
          userKeycloakId: request.auth?.userInfo?.sub,
          userEmail: request.auth?.userInfo?.email,
          userRoles: request.auth.userInfo?.realm_access?.roles || [],
        });
      } catch (e) {
        logger.error(e);
        reply.code(500);
        const message = e instanceof Error ? e.message : "unknown error";
        reply.send(message);
      }
    },
  });

  server.post<{
    Params: { feasibilityId: string };
    Body: {
      comment: { value: string };
      decision: { value: string };
      infoFile?: UploadedFile;
    };
  }>("/feasibility/:feasibilityId/decision", {
    schema: {
      params: {
        type: "object",
        properties: {
          feasibilityId: { type: "string" },
        },
        required: ["feasibilityId"],
      },
      body: {
        type: "object",
        properties: {
          decision: {
            type: "object",
            properties: {
              value: {
                type: "string",
              },
            },
          },
          comment: {
            type: "object",
            properties: {
              value: {
                type: "string",
              },
            },
          },
          infoFile: { type: "object" },
        },
        required: ["decision"],
      },
    },
    handler: async (request, reply) => {
      const { feasibilityId } = request.params;
      const infoFile = request?.body?.infoFile;
      if (infoFile) {
        if (!hasValidMimeType(infoFile, ["application/pdf"])) {
          return reply
            .status(400)
            .send(
              `Ce type de fichier n'est pas pris en charge. Veuillez soumettre un document PDF.`,
            );
        }

        if (infoFile._buf?.byteLength > maxUploadFileSizeInBytes) {
          return reply
            .status(413)
            .send(
              `La taille du fichier dépasse la taille maximum autorisée. Veuillez soumettre un fichier de moins de ${Math.floor(
                maxUploadFileSizeInBytes / 1024 / 1024,
              )} Mo.`,
            );
        }
      }

      return handleFeasibilityDecision({
        feasibilityId,
        decision: request.body.decision.value,
        hasRole: request.auth.hasRole as (role: string) => boolean,
        keycloakId: request.auth?.userInfo?.sub,
        userEmail: request.auth?.userInfo?.email,
        userRoles: request.auth.userInfo?.realm_access?.roles || [],
        comment: request.body.comment?.value,
        infoFile,
      });
    },
  });

  const hasValidMimeType = (
    file: UploadedFile,
    validMimeTypes: MimeType[],
  ): boolean => {
    return validMimeTypes.includes(file.mimetype as MimeType);
  };
};
