import { PageLayout } from "@/layouts/page.layout";
import Button from "@codegouvfr/react-dsfr/Button";
import Image from "next/image";

export default function WaitingForTraining() {
  return (
    <PageLayout title="Parcours et financement">
      <div className="grid grid-cols-3 grid-rows-1 w-11/12 mx-auto mt-8">
        <div className="col-span-2">
          <h1 className="">Parcours et financement</h1>
          <p className="text-lg">
            Votre accompagnateur est en train de construire votre parcours
            France VAE (heures d'accompagnement, formations prévues...). Vous le
            découvrirez très prochainement !
          </p>
          <p className="text-sm mb-0">
            En attendant, consultez notre article sur le{" "}
            <a
              href="https://vae.gouv.fr/savoir-plus/articles/financer-son-accompagnement-vae/"
              target="_blank"
            >
              financement de votre parcours
            </a>
            .
          </p>
          <Button
            className="mt-10"
            linkProps={{
              href: "/candidat",
            }}
          >
            Ma candidature
          </Button>
        </div>
        <div className="m-auto">
          <Image
            src="/candidat/images/work-in-progress.svg"
            alt="AAP logo"
            width={282}
            height={319}
          />
        </div>
      </div>
    </PageLayout>
  );
}
