"use client";
import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { ReactNode } from "react";

import Button from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import Notice from "@codegouvfr/react-dsfr/Notice";
import { Tag } from "@codegouvfr/react-dsfr/Tag";

import { EnhancedSectionCard } from "@/components/card/enhanced-section-card/EnhancedSectionCard";
import { CertificationCompetenceBlocsSummaryCard } from "@/components/certifications/certification-competence-blocs-summary-card/CertificationCompetenceBlocsSummaryCard";
import { graphqlErrorToast, successToast } from "@/components/toast/toast";

import { SmallNotice } from "@/components/small-notice/SmallNotice";

import { CertificationJuryFrequency } from "@/graphql/generated/graphql";

import { useAuth } from "@/components/auth/auth";
import { CertificationAdditionalInfoSummaryCard } from "@/components/certifications/certification-additional-info-summary-card/CertificationAdditionalInfoSummaryCard";
import { useUpdateCertificationPage } from "./updateCertification.hook";

type CertificationForPage = Exclude<
  ReturnType<typeof useUpdateCertificationPage>["certification"],
  undefined
>;

export default function UpdateCertificationForCertificationRegistryManagerPage() {
  const { certificationId } = useParams<{
    certificationId: string;
  }>();

  const { certification, getCertificationQueryStatus, validateCertification } =
    useUpdateCertificationPage({ certificationId });

  return getCertificationQueryStatus === "success" && certification ? (
    <PageContent
      certification={certification}
      validateCertification={validateCertification}
    />
  ) : null;
}

const JuryFrequencies: { id: CertificationJuryFrequency; label: string }[] = [
  {
    id: "MONTHLY",
    label: "Tous les mois",
  },
  {
    id: "TRIMESTERLY",
    label: "Trimestrielle",
  },
  {
    id: "YEARLY",
    label: "1 fois / an",
  },
] as const;

const modal = createModal({
  id: "validate-certification",
  isOpenedByDefault: false,
});

const PageContent = ({
  certification,
  validateCertification,
}: {
  certification: CertificationForPage;
  validateCertification: ReturnType<
    typeof useUpdateCertificationPage
  >["validateCertification"];
}) => {
  const router = useRouter();

  const { isAdmin } = useAuth();
  //Temporirarilry set isEditable to true to allow admins to update existing certifications

  const isEditable = isAdmin
    ? true
    : certification.status == "A_VALIDER_PAR_CERTIFICATEUR";

  const isDescriptionComplete =
    (certification.juryTypeMiseEnSituationProfessionnelle ||
      certification.juryTypeSoutenanceOrale) &&
    ((certification.juryFrequency && certification.juryFrequency?.length > 0) ||
      certification.juryFrequencyOther) &&
    certification.availableAt &&
    certification.expiresAt;

  const canValidateCertification =
    isDescriptionComplete && certification.additionalInfo;

  return (
    <div data-test="certification-registry-manager-update-certification-page">
      <h1>
        {certification.codeRncp} - {certification.label}
      </h1>
      <p className="mb-12 text-xl">
        Relisez, complétez et/ou modifiez les informations récupérées via France
        compétences avant de valider la certification. Une fois la certification
        validée et visible sur la plateforme, ces informations seront affichées
        aux AAP et aux candidats.
      </p>
      <div className="flex flex-col gap-8">
        <EnhancedSectionCard
          data-test="certification-description-card"
          title="Descriptif de la certification"
          status={isDescriptionComplete ? "COMPLETED" : "TO_COMPLETE"}
          isEditable={isEditable}
          titleIconClass="fr-icon-award-fill"
          buttonOnClickHref={`/responsable-certifications/certifications/${certification.id}/description`}
        >
          <div className="flex flex-col gap-4">
            <Info title="Visibilité sur France VAE">
              {certification.availableAt && certification.expiresAt ? (
                <div>{`du ${format(certification.availableAt, "dd/MM/yyyy")} au ${format(certification.expiresAt, "dd/MM/yyyy")}`}</div>
              ) : (
                "À compléter"
              )}
            </Info>

            <div>
              <label className="text-xs text-dsfrGray-mentionGrey">{`RNCP ${certification.codeRncp}`}</label>
              <h3 className="mb-0">{certification.label}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Info title="Niveau">{certification.degree.label}</Info>
              <Info title="Type de certification">
                {certification.typeDiplome || "Inconnu"}
              </Info>
              <Info title="Date de publication">
                {certification.rncpPublishedAt
                  ? format(certification.rncpPublishedAt, "dd/MM/yyyy")
                  : "Inconnue"}
              </Info>
              <Info title="Date d’échéance">
                {certification.rncpExpiresAt
                  ? format(certification.rncpExpiresAt, "dd/MM/yyyy")
                  : "Inconnue"}
              </Info>
            </div>

            <h3 className="mb-0">Jury</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certification.juryTypeSoutenanceOrale && (
                <Info title="Entretien : ">
                  {(certification.juryTypeSoutenanceOrale == "LES_DEUX" ||
                    certification.juryTypeSoutenanceOrale == "PRESENTIEL") && (
                    <Tag>Présentiel</Tag>
                  )}
                  {(certification.juryTypeSoutenanceOrale == "LES_DEUX" ||
                    certification.juryTypeSoutenanceOrale == "A_DISTANCE") && (
                    <Tag>À distance</Tag>
                  )}
                </Info>
              )}
              {certification.juryTypeMiseEnSituationProfessionnelle && (
                <Info title="Mise en situation professionnelle : ">
                  {(certification.juryTypeMiseEnSituationProfessionnelle ==
                    "LES_DEUX" ||
                    certification.juryTypeMiseEnSituationProfessionnelle ==
                      "PRESENTIEL") && <Tag>Présentiel</Tag>}
                  {(certification.juryTypeMiseEnSituationProfessionnelle ==
                    "LES_DEUX" ||
                    certification.juryTypeMiseEnSituationProfessionnelle ==
                      "A_DISTANCE") && <Tag>À distance</Tag>}
                </Info>
              )}

              <Info title="Fréquence des jurys">
                {certification.juryFrequencyOther ||
                  JuryFrequencies.find(
                    ({ id }) => id == certification.juryFrequency,
                  )?.label ||
                  "À compléter"}
              </Info>
              {certification.juryPlace && (
                <Info title="Lieu où se déroulera le passage : ">
                  {certification.juryPlace}
                </Info>
              )}
            </div>

            <h3 className="mb-0">Domaines et sous-domaines du Formacode </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certification.domains.length == 0 && (
                <div>Aucun formacode associé</div>
              )}
              {certification.domains.map((domain) => (
                <div key={domain.id} className="flex flex-col gap-2">
                  <div>{domain.label}</div>
                  <div
                    key={domain.id}
                    className="flex flex-row flex-wrap gap-2"
                  >
                    {domain.children.map((subDomain) => (
                      <Tag key={subDomain.id}>
                        {`${subDomain.code} ${subDomain.label}`}
                      </Tag>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Notice
              className="bg-transparent -ml-6 text-xs p-0 mt-2"
              title={
                <span className="text-sm inline font-normal">
                  Vous trouverez dans cette section des informations à compléter
                  et d’autres non modifiables. En cas d’erreur, contactez
                  directement France compétences.
                </span>
              }
            />
          </div>
        </EnhancedSectionCard>

        <CertificationCompetenceBlocsSummaryCard
          isEditable={isEditable}
          competenceBlocs={certification.competenceBlocs}
          onUpdateCompetenceBlocButtonClick={(blocId) =>
            router.push(
              `/responsable-certifications/certifications/${certification.id}/bloc-competence/${blocId}`,
            )
          }
        />
        <EnhancedSectionCard
          data-test="prerequisites-summary-card"
          isEditable={isEditable}
          title="Prérequis obligatoires"
          titleIconClass="fr-icon-success-fill"
          customButtonTitle="Modifier"
          buttonOnClickHref={`/responsable-certifications/certifications/${certification.id}/prerequisites`}
        >
          {certification.prerequisites.length ? (
            <ul className="ml-10" data-test="prerequisite-list">
              {certification.prerequisites.map((p) => (
                <li key={p.id}>{p.label}</li>
              ))}
            </ul>
          ) : (
            <p className="ml-10 mb-0" data-test="no-prerequisite-message">
              Aucun prérequis renseigné pour cette certification.
            </p>
          )}
          <SmallNotice className="mt-6">
            Si les prérequis obligatoires ont pu être récupérés depuis France
            compétences, ils seront affichés ci-dessus. Vous pouvez revoir
            l'ordre des prérequis ou corriger des fautes de frappe en cliquant
            sur le bouton “Modifier”.
          </SmallNotice>
        </EnhancedSectionCard>

        <CertificationAdditionalInfoSummaryCard
          isEditable={isEditable}
          updateButtonHref={`/responsable-certifications/certifications/${certification.id}/additional-info`}
          certificationAdditionalInfo={certification.additionalInfo}
        />

        {isEditable && (
          <>
            <div className=" h-[1px] w-[100%] bg-dsfr-light-decisions-border-border-default-grey" />

            <div>
              <h2 className="mb-4">Validation de la certification</h2>
              <p>
                Une fois toutes les informations relues, complétées et/ou
                modifiées, vous pouvez valider cette certification. Si des
                informations ont été enregistrées par erreur, contactez l’équipe
                support France VAE. Si vous repérez une erreur qui implique une
                mise à jour des informations enregistrées au RNCP, contactez
                France compétences.
              </p>
            </div>
          </>
        )}
      </div>

      {isEditable && (
        <div
          className={`flex gap-4 items-center justify-between mt-10`}
          data-test="form-buttons"
        >
          <div className="flex gap-x-2 ml-auto">
            <Button
              type="button"
              disabled={!canValidateCertification}
              onClick={modal.open}
            >
              Valider cette certification
            </Button>
          </div>
        </div>
      )}

      <modal.Component
        className="modal-validate-certification"
        title={
          <div>
            <span
              className="fr-icon-success-fill mr-2"
              aria-hidden="true"
            ></span>
            Validation de la certification
          </div>
        }
        size="large"
        buttons={[
          {
            type: "button",
            priority: "secondary",
            children: "Modifier",
          },
          {
            type: "button",
            priority: "primary",
            onClick: async () => {
              try {
                await validateCertification.mutateAsync({
                  certificationId: certification.id,
                });
                successToast("La certification a été validée avec succès");
                router.push(
                  "/responsable-certifications/certifications/?status=VALIDE_PAR_CERTIFICATEUR&visible=true",
                );
              } catch (error) {
                graphqlErrorToast(error);
              }
            },
            children: "Valider",
          },
        ]}
      >
        <div className="flex flex-col gap-4">
          Assurez-vous que les informations suivantes soient correctes avant de
          valider :
          <div>
            <label className="text-xs text-dsfrGray-mentionGrey">{`RNCP ${certification.codeRncp}`}</label>
            <h6 className="mb-0">{certification.label}</h6>
          </div>
          {`Elle sera visible sur la plateforme France VAE du ${format(certification.availableAt, "dd/MM/yyyy")} au ${format(certification.expiresAt, "dd/MM/yyyy")}.`}
        </div>
      </modal.Component>
    </div>
  );
};

const Info = ({
  title,
  children,
  className,
  "data-test": dataTest,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  "data-test"?: string;
}) => (
  <dl data-test={dataTest} className={`${className || ""}`}>
    <dt className="mb-1">{title}</dt>
    <dd className="font-medium">{children}</dd>
  </dl>
);
