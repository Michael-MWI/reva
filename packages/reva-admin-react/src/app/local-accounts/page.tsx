"use client";

import { redirect } from "next/navigation";

import Button from "@codegouvfr/react-dsfr/Button";
import { SideMenu } from "@codegouvfr/react-dsfr/SideMenu";

import { useCertificationAuthorityQueries } from "./certificationAuthorityQueries";

type MenuItemProps = {
  id: string;
  label: string;
  informationsCommerciales?: {
    nom?: string | null;
  } | null;
};

export default function Page() {
  const { certifictionAuthority, certifictionAuthorityStatus: status } =
    useCertificationAuthorityQueries();

  const localAccounts =
    certifictionAuthority?.certificationAuthorityLocalAccounts || [];

  if (status == "success" && localAccounts.length == 0) {
    redirect("/local-accounts/empty-local-account");
  }

  return (
    <>
      {status == "pending" && (
        <div className="flex-shrink-0 md:w-[298px] pt-8 border-r">
          <Skeleton />
          <Skeleton />
        </div>
      )}
      {status == "success" && (
        <SideMenu
          className="flex-shrink-0 md:w-[330px] side-bar-menu-add-button"
          align="left"
          classes={{ inner: "h-full" }}
          burgerMenuButtonText="Comptes locaux"
          title="Comptes locaux"
          items={
            [
              ...localAccounts.map((item) => ({
                isActive: false,
                linkProps: {
                  href: `/local-accounts/${item.id}`,
                  target: "_self",
                },
                text: item.account.lastname,
              })),
              {
                isActive: false,
                linkProps: {
                  href: "/local-accounts/add-local-account/",
                  target: "_self",
                },
                text: (
                  <div className="w-full h-full bg-white">
                    <Button size="small" priority="secondary">
                      Ajouter un compte local
                    </Button>
                  </div>
                ),
              },
            ] || []
          }
        />
      )}
      {status == "error" && (
        <div className="md:w-[330px] text-red-500">
          Une erreur est survenue lors de la récupération de vos comptes locaux
        </div>
      )}
    </>
  );
}

const Skeleton = () => (
  <div className="ml-5 mt-6 h-8 animate-pulse bg-gray-100 w-64" />
);
