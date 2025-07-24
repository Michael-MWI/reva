import { Button } from "@codegouvfr/react-dsfr/Button";
import { ReactNode } from "react";

export const BackButton = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => (
  <Button
    priority="tertiary"
    className="mb-6"
    iconId="fr-icon-arrow-go-back-line"
    linkProps={{
      href,
      target: "_self",
    }}
  >
    {children}
  </Button>
);
