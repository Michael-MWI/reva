"use client";
import { PageLayout } from "@/layouts/page.layout";
import { Button } from "@codegouvfr/react-dsfr/Button";

import Link from "next/link";
import CallOut from "@codegouvfr/react-dsfr/CallOut";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { useCandidacyForCertification } from "./certification.hooks";
import { useRouter } from "next/navigation";

export default function CertificationDetail() {
  const { canEditCandidacy, certification } = useCandidacyForCertification();
  const router = useRouter();
  if (!certification) {
    return router.push("/search-certification");
  }

  return (
    <PageLayout title="Choix du diplôme" data-test={`certificates`}>
      <Breadcrumb
        currentPageLabel="Diplôme visé"
        className="mb-0"
        homeLinkProps={{
          href: "/",
        }}
        segments={[]}
      />
      <h2
        data-test="certification-label"
        className="mt-6 mb-2 text-2xl font-bold text-black "
      >
        {certification.label}
      </h2>
      <p data-test="certification-code-rncp" className="text-xs mb-0">
        Code RNCP: {certification.codeRncp}
      </p>
      <Tag className="my-8">
        {certification.isAapAvailable
          ? "VAE en autonomie ou accompagnée"
          : "VAE en autonomie"}
      </Tag>
      <p>
        <a
          data-test="certification-more-info-link"
          target="_blank"
          rel="noreferrer"
          href={`https://www.francecompetences.fr/recherche/rncp/${certification.codeRncp}/`}
          className="text-dsfrBlue-500"
        >
          Lire les détails de la fiche diplôme
        </a>
      </p>

      {certification.isAapAvailable ? (
        <CallOut
          title="À quoi sert un accompagnateur ?"
          classes={{ title: "pb-2" }}
          className="w-full md:w-3/5 mt-8 mb-12"
        >
          C’est un expert de la VAE qui vous aide à chaque grande étape de votre
          parcours : rédaction du dossier de faisabilité, communication avec le
          certificateur, préparation au passage devant le jury, etc.
          <br />
          <br />
          <strong>Bon à savoir :</strong> ces accompagnements peuvent être en
          partie financés par votre{" "}
          <Link
            href="https://www.moncompteformation.gouv.fr/espace-public/consulter-mes-droits-formation"
            target="_blank"
          >
            Compte Personnel de Formation
          </Link>
          . Nous attirons votre attention sur le fait que les frais liés à votre
          passage devant le jury et les actions de formations complémentaires
          sont entièrement à votre charge.
        </CallOut>
      ) : (
        <CallOut
          title="Ce diplôme se réalise en autonomie"
          classes={{ title: "pb-2" }}
          className="w-full md:w-3/5 mt-8 mb-12"
        >
          Si vous préférez être accompagné, vous pouvez contacter le support
          pour qu’un accompagnateur prenne en charge ce diplôme. Sinon, il reste
          également la possibilité de choisir un autre diplôme !
        </CallOut>
      )}

      <div className="flex flex-col-reverse md:flex-row gap-4 justify-between mt-6">
        <Button
          priority="secondary"
          className="justify-center w-[100%] md:w-fit"
          linkProps={{ href: "/" }}
        >
          Retour
        </Button>
        <Button
          data-test="change-certification-button"
          priority="tertiary no outline"
          className="justify-center w-[100%] md:w-fit"
          onClick={() => {
            router.push("/search-certification");
          }}
          disabled={!canEditCandidacy}
        >
          Changer de diplôme
        </Button>
      </div>
    </PageLayout>
  );
}
