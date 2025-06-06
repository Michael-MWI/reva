import { ReactNode } from "react";

export const SmallNotice = ({
  className = "",
  children,
  "data-test": dataTest,
}: {
  className?: string;
  children: ReactNode;
  "data-test"?: string;
}) => (
  <div
    className={`text-blue-light-text-default-info flex items-start ${className}`}
    data-test={dataTest || ""}
  >
    <span className="fr-icon--sm fr-icon-info-fill mr-2 -mt-[1px]" />
    <p className="text-sm mb-0">{children}</p>
  </div>
);
