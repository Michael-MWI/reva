"use client";
import { graphqlErrorToast, successToast } from "@/components/toast/toast";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { ReadyForJuryEstimatedDateTab } from "./_components/tabs/ready-for-jury-estimated-date-tab/ReadyForJuryEstimatedAtTab";
import { useDossierDeValidationPage } from "./dossierDeValidation.hook";

import { JuryResult } from "@/graphql/generated/graphql";
import Button from "@codegouvfr/react-dsfr/Button";
import { useRouter } from "next/navigation";
import {
  DossierDeValidationFormData,
  DossierDeValidationTab,
} from "./_components/tabs/dossier-de-validation-tab/DossierDeValidationTab";
import { ReadOnlyDossierDeValidationTab } from "./_components/tabs/read-only-dossier-de-validation-tab/ReadOnlyDossierDeValidationTab";
import { ReadOnlyReadyForJuryEstimatedDateTab } from "./_components/tabs/read-only-ready-for-jury-estimated-date-tab/ReadOnlyReadyForJuryEstimatedDateTab";

const failedJuryResults: JuryResult[] = [
  "PARTIAL_SUCCESS_OF_FULL_CERTIFICATION",
  "PARTIAL_SUCCESS_OF_PARTIAL_CERTIFICATION",
  "PARTIAL_SUCCESS_PENDING_CONFIRMATION",
  "FAILURE",
  "CANDIDATE_EXCUSED",
  "CANDIDATE_ABSENT",
];

export default function DossierDeValidationPag() {
  const {
    readyForJuryEstimatedAt,
    certificationAuthority,
    dossierDeValidation,
    dossierDeValidationProblems,
    updateReadyForJuryEstimatedAt,
    sendDossierDeValidation,
    queryStatus,
    jury,
  } = useDossierDeValidationPage();

  const router = useRouter();

  const handleReadyForJuryEstimatedDateFormSubmit = async ({
    readyForJuryEstimatedAt,
  }: {
    readyForJuryEstimatedAt: Date;
  }) => {
    try {
      await updateReadyForJuryEstimatedAt.mutateAsync({
        readyForJuryEstimatedAt,
      });
      successToast("La date prévisionnelle a été enregistrée");
    } catch (error) {
      graphqlErrorToast(error);
    }
  };

  const handleDossierDeValidationFormSubmit = async ({
    dossierDeValidationFile,
    dossierDeValidationOtherFiles,
  }: DossierDeValidationFormData) => {
    try {
      await sendDossierDeValidation({
        dossierDeValidationFile,
        dossierDeValidationOtherFiles,
      });
      successToast("Votre dossier de validation a été envoyé");
      router.push("/");
    } catch (error) {
      graphqlErrorToast(error);
    }
  };

  const hasFailedJuryResult =
    jury?.result && failedJuryResults.includes(jury.result);

  const readOnlyView =
    dossierDeValidation &&
    dossierDeValidation.decision !== "INCOMPLETE" &&
    !hasFailedJuryResult;

  return (
    <div className="flex flex-col">
      <h1>Dossier de validation</h1>
      <p>
        Renseignez les informations liées à votre dossier de validation puis
        déposez-le afin de le transmettre au certificateur. Si votre
        certification n’est pas totalement validée, vous pourrez déposer un
        second dossier une fois votre résultat communiqué.
      </p>
      {queryStatus === "success" && (
        <>
          {readOnlyView ? (
            <Tabs
              tabs={[
                {
                  label: "Date prévisionnelle",
                  isDefault: false,
                  content: (
                    <ReadOnlyReadyForJuryEstimatedDateTab
                      readyForJuryEstimatedAt={
                        readyForJuryEstimatedAt
                          ? new Date(readyForJuryEstimatedAt)
                          : undefined
                      }
                      certificationAuthorityInfo={{
                        label: certificationAuthority?.label || "",
                        email: certificationAuthority?.contactEmail || "",
                        name: certificationAuthority?.contactFullName || "",
                      }}
                    />
                  ),
                },
                {
                  label: "Dêpot du dossier",
                  isDefault: true,
                  content: (
                    <ReadOnlyDossierDeValidationTab
                      dossierDeValidationSentAt={
                        dossierDeValidation.dossierDeValidationSentAt
                          ? new Date(
                              dossierDeValidation?.dossierDeValidationSentAt,
                            )
                          : undefined
                      }
                      dossierDeValidationFile={
                        dossierDeValidation.dossierDeValidationFile
                      }
                      dossierDeValidationOtherFiles={
                        dossierDeValidation.dossierDeValidationOtherFiles
                      }
                      certificationAuthorityInfo={{
                        label: certificationAuthority?.label || "",
                        email: certificationAuthority?.contactEmail || "",
                        name: certificationAuthority?.contactFullName || "",
                      }}
                    />
                  ),
                },
              ]}
            />
          ) : (
            <Tabs
              tabs={[
                {
                  label: "Date prévisionnelle",
                  isDefault: !readyForJuryEstimatedAt,
                  content: (
                    <ReadyForJuryEstimatedDateTab
                      defaultValues={{
                        readyForJuryEstimatedAt: readyForJuryEstimatedAt
                          ? new Date(readyForJuryEstimatedAt)
                          : undefined,
                      }}
                      certificationAuthorityInfo={{
                        label: certificationAuthority?.label || "",
                        email: certificationAuthority?.contactEmail || "",
                        name: certificationAuthority?.contactFullName || "",
                      }}
                      onSubmit={handleReadyForJuryEstimatedDateFormSubmit}
                    />
                  ),
                },
                {
                  label: "Dêpot du dossier",
                  isDefault: !!readyForJuryEstimatedAt,
                  content: (
                    <DossierDeValidationTab
                      certificationAuthorityInfo={{
                        label: certificationAuthority?.label || "",
                        email: certificationAuthority?.contactEmail || "",
                        name: certificationAuthority?.contactFullName || "",
                      }}
                      dossierDeValidationIncomplete={
                        dossierDeValidation?.decision === "INCOMPLETE"
                      }
                      dossierDeValidationProblems={dossierDeValidationProblems}
                      onSubmit={handleDossierDeValidationFormSubmit}
                    />
                  ),
                },
              ]}
            />
          )}
        </>
      )}
      <Button priority="tertiary" linkProps={{ href: "/" }} className="mt-12">
        Retour
      </Button>
    </div>
  );
}
