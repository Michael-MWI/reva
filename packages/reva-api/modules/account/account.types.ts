export type Group = "reva" | "organism";

export type Role = "admin" | "manage_candidacy" | "gestion_maison_mere_aap";

export interface Account {
  id: string;
  keycloakId: string;
  email: string;
  firstname: string | null;
  lastname: string | null;
  organismId: string | null;
  certificationAuthorityId: string | null;
}

export type AccountGroupFilter =
  | "admin"
  | "organism"
  | "certification_authority";
