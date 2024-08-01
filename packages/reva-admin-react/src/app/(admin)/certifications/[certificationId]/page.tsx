"use client";
import { ReactNode } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useParams } from "next/navigation";

import { CertificationStatus } from "@/graphql/generated/graphql";

import { Button } from "@codegouvfr/react-dsfr/Button";

import { BackButton } from "@/components/back-button/BackButton";

import { CertificationFormacodes } from "./_components/CertificationFormacodes";

import { useCertificationQueries } from "@/app/(admin)/certifications/[certificationId]/certificationQueries";

const CertificationPage = () => {
  const { certificationId } = useParams<{ certificationId: string }>();
  const { certification } = useCertificationQueries({ certificationId });

  const certificationStatusToString = (s: CertificationStatus) => {
    switch (s) {
      case "AVAILABLE":
        return "Disponible";
      case "INACTIVE":
        return "Inactive";
      default:
        return "Inconnu";
    }
  };
  return (
    <div className="flex flex-col w-full">
      <BackButton href="/certifications">Toutes les certifications</BackButton>
      {certification && (
        <>
          <h1>{certification.label}</h1>
          <p>
            {certification.codeRncp}
            <br />
            Statut: {certificationStatusToString(certification.status)}
          </p>
          <h2>Informations générales</h2>
          <div className="grid grid-cols-2">
            <Info title="Niveau de la certification">
              {certification.degree.longLabel}
            </Info>
            <Info title="Type de la certification">
              {certification.typeDiplome.label}
            </Info>
            <Info title="Disponible à partir du">
              {format(certification.availableAt, "dd/MM/yyyy")}
            </Info>
            <Info title="Expire le">
              {format(certification.expiresAt, "dd/MM/yyyy", { locale: fr })}
            </Info>
          </div>

          <br />
          <h2>Blocs de compétences</h2>
          {certification.competenceBlocs.length == 0 ? (
            <div>Aucun bloc de compétence</div>
          ) : (
            <div className="grid grid-cols-2">
              <ul className="list-disc list-inside">
                {certification.competenceBlocs.map((bloc) => (
                  <li key={bloc.id}>{bloc.label}</li>
                ))}
              </ul>
            </div>
          )}

          <br />
          <h2>Gestion de la certification</h2>
          <div className="grid grid-cols-2">
            {!!certification.domaines.length && (
              <Info title="Filières">
                <ul className="list-disc list-inside">
                  {certification.domaines.map((d) => (
                    <li key={d.id}>{d.label}</li>
                  ))}
                </ul>
              </Info>
            )}
            {!!certification.conventionsCollectives.length && (
              <Info title="Branches">
                <ul className="list-disc list-inside">
                  {certification.conventionsCollectives.map((c) => (
                    <li key={c.id}>{c.label}</li>
                  ))}
                </ul>
              </Info>
            )}
            <Info
              title="Administrateur de la certification"
              className="col-span-2"
            >
              {certification.certificationAuthorityTag || "Inconnu"}
            </Info>
            <Info
              title="Admins Certificateur et comptes locaux"
              className="col-span-2"
            >
              <ul className="list-disc list-inside mt-2">
                {certification.certificationAuthorities.map((c) => (
                  <li key={c.id}>
                    {c.label}
                    <ul className="m-0 ml-6 pt-1 list-square list-inside">
                      {c.certificationAuthorityLocalAccounts.map((l) => (
                        <li
                          key={l.id}
                        >{`${l.account.email} - ${l.account.firstname} - ${l.account.lastname}`}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </Info>
          </div>
          <br />
          <h2>Formacodes</h2>
          <CertificationFormacodes codeRncp={certification.codeRncp} />
        </>
      )}
      <div className="flex flex-col md:flex-row gap-4 mt-8 ml-auto">
        <Button
          linkProps={{
            href: `/certifications/${certificationId}/competence-blocs`,
          }}
        >
          Blocs de compétence
        </Button>

        <Button
          linkProps={{ href: `/certifications/${certificationId}/update` }}
        >
          Modifier
        </Button>
        <Button
          linkProps={{ href: `/certifications/${certificationId}/replace` }}
        >
          Remplacer
        </Button>
      </div>
    </div>
  );
};

export default CertificationPage;

const Info = ({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) => (
  <dl className={`m-2 ${className}`}>
    <dt className="font-normal text-sm text-gray-600 mb-1">{title}</dt>
    <dd>{children}</dd>
  </dl>
);
