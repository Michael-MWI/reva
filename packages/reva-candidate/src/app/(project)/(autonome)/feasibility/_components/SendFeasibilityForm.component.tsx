import {
  errorToast,
  graphqlErrorToast,
  successToast,
} from "@/components/toast/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import Alert from "@codegouvfr/react-dsfr/Alert";
import Select from "@codegouvfr/react-dsfr/Select";
import { useSendFeasibilityForm } from "./SendFeasibilityForm.hooks";
import { GraphQLError } from "graphql";
import { useFeasibilityPage } from "../feasibility.hook";
import CallOut from "@codegouvfr/react-dsfr/CallOut";
import { DownloadTile } from "@/components/download-tile/DownloadTile";
import { FormButtons } from "@/components/form/form-footer/FormButtons";
import { UploadForm } from "./UploadForm";
import { FancyPreview } from "@/components/fancy-preview/FancyPreview";
import { FeasibilityHistory } from "@/graphql/generated/graphql";
import { FeasibilityDecisionHistory } from "@/components/feasibility-decision-history";
import Notice from "@codegouvfr/react-dsfr/Notice";

const schema = z.object({
  certificationAuthorityId: z.string(),
  feasibilityFile: z.object({
    0: z.instanceof(File, { message: "Merci de remplir ce champ" }),
  }),
  idFile: z.object({
    0: z.instanceof(File, { message: "Merci de remplir ce champ" }),
  }),
  documentaryProofFile: z.object({ 0: z.instanceof(File).optional() }),
  certificateOfAttendanceFile: z.object({ 0: z.instanceof(File).optional() }),
  requirements: z
    .object({ id: z.string(), label: z.string(), checked: z.boolean() })
    .array(),
});

export type FeasibilityFormData = z.infer<typeof schema>;

export const SendFeasibilityForm = (): React.ReactNode => {
  const { candidacy, queryStatus } = useFeasibilityPage();
  const candidacyId = candidacy?.id;
  const { sendFeasibility } = useSendFeasibilityForm(candidacyId);
  const router = useRouter();

  const feasibility = candidacy.feasibility;

  const certificationAuthorities = candidacy.certificationAuthorities || [];
  const canUpload =
    !candidacy.feasibility || candidacy.feasibility.decision == "INCOMPLETE";

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FeasibilityFormData>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      certificationAuthorityId:
        certificationAuthorities.length == 1
          ? certificationAuthorities[0].id
          : candidacy.feasibility?.certificationAuthority?.id || "",
      feasibilityFile: {},
      idFile: {},
      documentaryProofFile: {},
      certificateOfAttendanceFile: {},
      requirements: [
        {
          id: "0",
          label:
            "J'ai bien vérifié que le dossier de faisabilité était correct, complet et signé par moi-même ainsi que par le candidat.",
          checked: false,
        },
        {
          id: "1",
          label:
            "J'ai bien vérifié que la pièce d’identité était conforme, en cours de validité et lisible.",
          checked: false,
        },
      ],
    },
  });

  const certificationAuthorityId = watch("certificationAuthorityId");

  const { fields: requirements } = useFieldArray({
    control,
    name: "requirements",
  });

  const CertificationContactCard = useMemo(() => {
    if (!certificationAuthorityId) {
      return null;
    }
    const selectedCertificationAuthority =
      candidacy?.certificationAuthorities.find(
        (c) => c.id === certificationAuthorityId,
      );
    return (
      <CallOut title="Comment contacter mon certificateur ?" className="w-3/5">
        {selectedCertificationAuthority?.label}
        <br />
        {selectedCertificationAuthority?.contactFullName}
        <br />
        {selectedCertificationAuthority?.contactEmail}
      </CallOut>
    );
  }, [candidacy?.certificationAuthorities, certificationAuthorityId]);

  if (queryStatus === "error") {
    return (
      <Alert
        severity="error"
        title="Une erreur est survenue."
        description="Impossible de charger la candidature. Veuillez réessayer."
        closable={false}
      />
    );
  }
  if (!candidacy) {
    return (
      <Alert
        severity="error"
        title="La candidature n'a pas été trouvée."
        closable={false}
      />
    );
  }

  const handleFormSubmit = handleSubmit(async (data) => {
    if (!candidacyId) {
      return;
    }

    try {
      const response = await sendFeasibility.mutateAsync({
        candidacyId,
        certificationAuthorityId: data.certificationAuthorityId,
        feasibilityFile: data.feasibilityFile[0],
        IDFile: data.idFile[0],
        documentaryProofFile: data.documentaryProofFile?.[0],
        certificateOfAttendanceFile: data.certificateOfAttendanceFile?.[0],
      });

      const textError = await response.text();
      if (textError) {
        if (response.status == 413) {
          errorToast(
            "Le fichier que vous tentez d'envoyer est trop volumineux. Veuillez soumettre un fichier d'une taille inférieure à 20 Mo.",
          );
        } else {
          errorToast(textError);
        }
      } else {
        successToast("Dossier de faisabilité envoyé");
        router.push("/");
      }
    } catch (error) {
      graphqlErrorToast(error as GraphQLError);
    }
  });

  const feasibilityHistory: FeasibilityHistory[] = feasibility?.history || [];

  return (
    <div className="mt-12">
      {candidacy.feasibility?.decision == "REJECTED" && (
        <>
          <Alert
            className="mb-8"
            severity="error"
            title={`Dossier déclaré non recevable le ${new Date(candidacy.feasibility.decisionSentAt!).toLocaleDateString("fr-FR")}`}
            description={
              <>
                <p>
                  Voici le motif transmis par votre certificateur : {'"'}
                  {candidacy.feasibility.decisionComment}
                  {'"'}
                </p>
                <p>
                  Si vous souhaitez en savoir plus, contactez votre
                  certificateur avant de renvoyer votre dossier mis à jour.
                </p>
              </>
            }
          />

          {feasibilityHistory.length > 0 && (
            <FeasibilityDecisionHistory history={feasibilityHistory} />
          )}
        </>
      )}
      {candidacy.feasibility?.decision == "INCOMPLETE" && (
        <>
          <Alert
            className="mb-8"
            severity="warning"
            title={`Dossier déclaré incomplet le ${new Date(candidacy.feasibility.decisionSentAt!).toLocaleDateString("fr-FR")}`}
            description={
              <>
                <p>
                  Voici le motif transmis par votre certificateur : {'"'}
                  {candidacy.feasibility.decisionComment}
                  {'"'}
                </p>
                <p>
                  Si vous souhaitez en savoir plus, contactez votre
                  certificateur avant de renvoyer votre dossier mis à jour.
                </p>
              </>
            }
          />
          {feasibilityHistory.length > 0 && (
            <FeasibilityDecisionHistory history={feasibilityHistory} />
          )}
        </>
      )}
      {candidacy.feasibility?.decision == "PENDING" && (
        <Alert
          className="mb-8"
          severity="info"
          title={`Dossier envoyé le ${new Date(candidacy.feasibility.feasibilityFileSentAt!).toLocaleDateString("fr-FR")}`}
          description={
            <>
              <p>
                Votre dossier a bien été envoyé au certificateur concerné. En
                attendant la réponse de votre certificateur sur votre
                recevabilité (dans un délai de 2 mois), vos pièces
                justificatives restent consultables.
              </p>
            </>
          }
        />
      )}
      {candidacy.feasibility?.decision == "ADMISSIBLE" && (
        <>
          <Alert
            className="mb-8"
            severity="success"
            title={`Dossier déclaré recevable le ${new Date(candidacy.feasibility.decisionSentAt!).toLocaleDateString("fr-FR")}`}
            description={
              <>
                <p>
                  Félicitations, votre dossier a été accepté par votre
                  certificateur. Vous pouvez commencer la prochaine étape : le
                  dossier de validation !
                </p>
              </>
            }
          />
          {candidacy.feasibility.decisionFile && (
            <div className="mb-8 p-6">
              <h2>
                <span className="fr-icon-attachment-fill fr-icon--lg mr-2" />
                Pièces jointes
              </h2>

              <div className="mb-6">
                {/* Use array in anticipation for future US that will let certification authorities upload multiple files */}
                {[candidacy.feasibility.decisionFile].map((file) => (
                  <FancyPreview
                    defaultDisplay={false}
                    name={file.name}
                    title={file?.name}
                    src={file.previewUrl!}
                    key={file?.name}
                  />
                ))}
              </div>
              <Notice
                className="bg-transparent -ml-6"
                title="Le certificateur peut ajouter des pièces jointes (courrier de recevabilité, trame du dossier de validation…) pour vous aider à continuer votre parcours. N'hésitez pas à les consulter !"
              />
            </div>
          )}
        </>
      )}
      <form
        onSubmit={handleFormSubmit}
        onReset={(e) => {
          e.preventDefault();
          reset();
        }}
        className="flex flex-col gap-6"
      >
        {certificationAuthorities.length > 1 && canUpload && (
          <>
            <Select
              className="w-3/5 mb-0"
              label={
                <label className="block mt-[6px] mb-[10px] text-xs font-semibold">
                  SÉLECTIONNEZ L&apos;AUTORITÉ DE CERTIFICATION
                </label>
              }
              nativeSelectProps={{
                ...register("certificationAuthorityId"),
                required: true,
              }}
            >
              <>
                <option disabled hidden value="">
                  Sélectionner
                </option>
                {certificationAuthorities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </>
            </Select>
          </>
        )}
        {CertificationContactCard}
        {certificationAuthorities.length === 0 && (
          <Alert
            severity="warning"
            title="Il n’y aucun certificateur rattaché à ce diplôme pour le moment"
            description="Pour en savoir plus, contactez le support à support@vae.gouv.fr."
            className="w-3/5"
          />
        )}
        <DownloadTile
          name="Trame du dossier de faisabilité"
          description="Pour compléter votre dossier, vous devez télécharger cette trame de dossier de faisabilité, le compléter, le signer et le joindre avec toutes les pièces justificatives nécessaires."
          url="/files/Dossier_faisabilité_candidat_autonome.pdf"
          mimeType="application/pdf"
        />
        <hr className="pb-1" />
        {canUpload && (
          <UploadForm
            errors={errors}
            register={register}
            requirements={requirements}
          />
        )}

        {!canUpload && feasibility?.feasibilityUploadedPdf && (
          <div>
            {feasibility?.feasibilityUploadedPdf?.feasibilityFile
              .previewUrl && (
              <FancyPreview
                defaultDisplay={false}
                name="Dossier de faisabilité"
                title={
                  feasibility?.feasibilityUploadedPdf?.feasibilityFile.name
                }
                src={
                  feasibility?.feasibilityUploadedPdf?.feasibilityFile
                    .previewUrl
                }
              />
            )}
            {feasibility?.feasibilityUploadedPdf?.IDFile?.previewUrl && (
              <FancyPreview
                defaultDisplay={false}
                name="Pièce d'identité"
                title={feasibility?.feasibilityUploadedPdf?.IDFile.name}
                src={feasibility?.feasibilityUploadedPdf?.IDFile.previewUrl}
              />
            )}
            {feasibility?.feasibilityUploadedPdf?.documentaryProofFile
              ?.previewUrl && (
              <FancyPreview
                defaultDisplay={false}
                name="Justificatif équivalence"
                title={
                  feasibility?.feasibilityUploadedPdf?.documentaryProofFile.name
                }
                src={
                  feasibility?.feasibilityUploadedPdf?.documentaryProofFile
                    .previewUrl
                }
              />
            )}
            {feasibility?.feasibilityUploadedPdf?.certificateOfAttendanceFile
              ?.previewUrl && (
              <FancyPreview
                defaultDisplay={false}
                name="Attestation ou certificat de formation"
                title={
                  feasibility?.feasibilityUploadedPdf
                    ?.certificateOfAttendanceFile.name
                }
                src={
                  feasibility?.feasibilityUploadedPdf
                    ?.certificateOfAttendanceFile.previewUrl
                }
              />
            )}
          </div>
        )}
        <FormButtons
          formState={{
            isDirty: isDirty,
            isSubmitting: isSubmitting,
            canSubmit: certificationAuthorities.length > 0,
          }}
          backUrl="/"
          submitButtonLabel="Envoyer"
        />
      </form>
    </div>
  );
};
