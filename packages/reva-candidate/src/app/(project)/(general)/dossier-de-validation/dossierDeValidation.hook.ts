import { useKeycloakContext } from "@/components/auth/keycloak.context";
import { useGraphQlClient } from "@/components/graphql/graphql-client/GraphqlClient";
import { REST_API_URL } from "@/config/config";
import { graphql } from "@/graphql/generated";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const getCandidateQuery = graphql(`
  query getCandidateWithCandidacyForDossierDeValidationPage {
    candidate_getCandidateWithCandidacy {
      id
      candidacy {
        id
        readyForJuryEstimatedAt
        feasibility {
          certificationAuthority {
            label
            contactFullName
            contactEmail
          }
        }
        activeDossierDeValidation {
          id
          decision
          decisionSentAt
          decisionComment
          dossierDeValidationSentAt
          dossierDeValidationFile {
            name
            previewUrl
          }
          dossierDeValidationOtherFiles {
            name
            previewUrl
          }
          history {
            id
            decisionSentAt
            decisionComment
          }
        }
        jury {
          result
        }
      }
    }
  }
`);

const updateReadyForJuryEstimatedAtMutation = graphql(`
  mutation updateReadyForJuryEstimatedAtForDossierDeValidationPage(
    $candidacyId: UUID!
    $readyForJuryEstimatedAt: Timestamp!
  ) {
    candidacy_setReadyForJuryEstimatedAt(
      candidacyId: $candidacyId
      readyForJuryEstimatedAt: $readyForJuryEstimatedAt
    ) {
      id
      readyForJuryEstimatedAt
    }
  }
`);

export const useDossierDeValidationPage = () => {
  const { graphqlClient } = useGraphQlClient();
  const queryClient = useQueryClient();
  const { accessToken } = useKeycloakContext();

  const { data: getCandidateResponse, status: queryStatus } = useQuery({
    queryKey: [
      "candidate",
      "getCandidateWithCandidacyForDossierDeValidationPage",
    ],
    queryFn: () => graphqlClient.request(getCandidateQuery),
  });

  const updateReadyForJuryEstimatedAt = useMutation({
    mutationFn: (data: { readyForJuryEstimatedAt: Date }) =>
      graphqlClient.request(updateReadyForJuryEstimatedAtMutation, {
        readyForJuryEstimatedAt: data.readyForJuryEstimatedAt.getTime(),
        candidacyId: candidacy?.id,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["candidate"] }),
  });

  const candidacy =
    getCandidateResponse?.candidate_getCandidateWithCandidacy?.candidacy;
  const readyForJuryEstimatedAt = candidacy?.readyForJuryEstimatedAt;

  const certificationAuthority = candidacy?.feasibility?.certificationAuthority;

  const dossierDeValidation = candidacy?.activeDossierDeValidation;

  const dossierDeValidationProblems =
    dossierDeValidation?.history?.map((h) => ({
      decisionSentAt: new Date(h.decisionSentAt || 0),
      decisionComment: h.decisionComment || "",
    })) || [];

  if (dossierDeValidation?.decision === "INCOMPLETE") {
    dossierDeValidationProblems.unshift({
      decisionSentAt: new Date(dossierDeValidation.decisionSentAt || 0),
      decisionComment: dossierDeValidation.decisionComment || "",
    });
  }

  const jury = candidacy?.jury;

  const sendDossierDeValidation = useCallback(
    async (data: {
      dossierDeValidationFile: {
        0: File;
      };
      dossierDeValidationOtherFiles: {
        0?: File | undefined;
      }[];
    }) => {
      const formData = new FormData();

      formData.append("candidacyId", candidacy?.id || "");

      if (data.dossierDeValidationFile?.[0]) {
        formData.append(
          "dossierDeValidationFile",
          data.dossierDeValidationFile?.[0],
        );
      }

      data.dossierDeValidationOtherFiles.forEach(
        (f) =>
          f?.[0] && formData.append("dossierDeValidationOtherFiles", f?.[0]),
      );

      const result = await fetch(
        `${REST_API_URL}/dossier-de-validation/upload-dossier-de-validation`,
        {
          method: "post",
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        },
      );

      if (!result.ok) {
        if (result.status === 413) {
          throw new Error(
            "Le fichier que vous tentez d'envoyer est trop volumineux. Veuillez soumettre un fichier d'une taille égale ou inférieure à 10 Mo",
          );
        }
        const errorMessage = await result.text();
        throw new Error(errorMessage);
      }
    },
    [accessToken, candidacy?.id],
  );

  return {
    readyForJuryEstimatedAt,
    certificationAuthority,
    dossierDeValidation,
    dossierDeValidationProblems,
    queryStatus,
    updateReadyForJuryEstimatedAt,
    sendDossierDeValidation,
    jury,
  };
};
