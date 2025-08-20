"use client";
import { Header as DsfrHeader } from "@codegouvfr/react-dsfr/Header";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

import { useAuth } from "@/components/auth/auth";
import { useKeycloakContext } from "@/components/auth/keycloakContext";
import { useGraphQlClient } from "@/components/graphql/graphql-client/GraphqlClient";

import { graphql } from "@/graphql/generated";

import { useFeatureflipping } from "../feature-flipping/featureFlipping";

const getCertificationAuthorityMetabaseUrlQuery = graphql(`
  query getCertificationAuthorityMetabaseUrl {
    account_getAccountForConnectedUser {
      certificationAuthority {
        metabaseDashboardIframeUrl
      }
    }
  }
`);

const getCohortesVaeCollectivesForConnectedAapQuery = graphql(`
  query getCohortesVaeCollectivesForConnectedAapForHeaderComponent {
    cohortesVaeCollectivesForConnectedAap {
      id
    }
  }
`);

const PATHS = {
  CANDIDACIES: "/candidacies",
  CERTIFICATIONS: "/certifications",
  SUBSCRIPTIONS: "/subscriptions/pending",
  MAISON_MERE_AAP: "/maison-mere-aap",
  CERTIFICATION_AUTHORITY_STRUCTURES: "/certification-authority-structures",
  AGENCIES_SETTINGS: "/agencies-settings-v3",
  RESPONSABLE_CERTIFICATIONS: "/responsable-certifications/certifications",
  CERTIFICATION_AUTHORITIES_SETTINGS: "/certification-authorities/settings",
  CERTIFICATION_AUTHORITIES_SETTINGS_LOCAL:
    "/certification-authorities/settings/local-account",
  FEASIBILITIES: "/candidacies/feasibilities",
  STATISTIQUES: "/dashboard",
  VAE_COLLECTIVES: "/vae-collectives",
  STRUCTURES_VAE_COLLECTIVE: "/structures-vae-collective",
} as const;

const LABELS = {
  CANDIDACIES: "Candidatures",
  CERTIFICATIONS: "Certifications",
  VERIFICATIONS: "Vérifications",
  ANNUAIRES: "Annuaires",
  PARAMETRES: "Paramètres",
  CERTIFICATEURS_CANDIDATURES: "Certificateurs/Candidatures",
  GESTION_CERTIFICATIONS: "Gestion des certifications",
  STRUCTURES_ACCOMPAGNATRICES: "Structures accompagnatrices",
  STRUCTURES_CERTIFICATRICES: "Structures certificatrices",
  STRUCTURES_VAE_COLLECTIVE: "Structures VAE collective",
  STATISTIQUES: "Statistiques",
  VAE_COLLECTIVES: "VAE collectives",
} as const;

const createTab = ({
  text,
  href,
  isActive,
  additionalProps = {},
}: {
  text: string;
  href: string;
  isActive: boolean;
  additionalProps?: Record<string, unknown>;
}) => ({
  text,
  linkProps: { href, target: "_self", ...additionalProps },
  isActive,
});

const isAAPCandidaciesPath = (pathname: string) => {
  const exclusionPattern =
    /\/candidacies\/(?!(dossiers-de-validation|feasibilities|juries)\/).*/;
  const subPathPattern =
    /\/candidacies\/.*\/(feasibility\/)|(dossier-de-validation\/)|(jury\/)|(transfer.*\/)/;

  return !!pathname.match(exclusionPattern) && !pathname.match(subPathPattern);
};

const isAAPVaeCollectivesPath = (pathname: string) =>
  !!pathname.match(/^\/vae-collectives/);

const isCertificationAuthorityCandidaciesPath = (pathname: string) => {
  const mainPattern =
    /\/candidacies\/(feasibilities)|(dossiers-de-validation)|(juries)/;
  const subPathPattern =
    /\/candidacies\/.*\/(feasibility\/)|(dossier-de-validation\/)|(jury\/)|(transfer.*\/)/;

  return !!(pathname.match(mainPattern) || pathname.match(subPathPattern));
};

const getNavigationTabs = ({
  currentPathname,
  isAdmin,
  isOrganism,
  isGestionnaireMaisonMereAAP,
  isCertificationAuthorityLocalAccount,
  isCertificationRegistryManager,
  isAdminCertificationAuthority,
  metabaseDashboardIframeUrl,
  showAAPVaeCollectivesTabsAndMenus,
}: {
  currentPathname: string;
  isAdmin: boolean;
  isOrganism: boolean;
  isGestionnaireMaisonMereAAP: boolean;
  isCertificationAuthorityLocalAccount: boolean;
  isCertificationRegistryManager: boolean;
  isAdminCertificationAuthority: boolean;
  metabaseDashboardIframeUrl?: string | null;
  showAAPVaeCollectivesTabsAndMenus: boolean;
}) => {
  const adminTabs = [
    createTab({
      text: LABELS.CANDIDACIES,
      href: PATHS.CANDIDACIES,
      isActive: isAAPCandidaciesPath(currentPathname),
    }),
    createTab({
      text: LABELS.CERTIFICATIONS,
      href: PATHS.CERTIFICATIONS,
      isActive: currentPathname.startsWith(PATHS.CERTIFICATIONS),
    }),
    createTab({
      text: LABELS.VERIFICATIONS,
      href: PATHS.SUBSCRIPTIONS,
      isActive: currentPathname.startsWith(PATHS.SUBSCRIPTIONS),
    }),
    {
      text: LABELS.ANNUAIRES,
      isActive: [
        PATHS.MAISON_MERE_AAP,
        PATHS.CERTIFICATION_AUTHORITY_STRUCTURES,
      ].some((path) => currentPathname.startsWith(path)),
      menuLinks: [
        createTab({
          text: LABELS.STRUCTURES_ACCOMPAGNATRICES,
          href: PATHS.MAISON_MERE_AAP,
          isActive: currentPathname.startsWith(PATHS.MAISON_MERE_AAP),
          additionalProps: { "data-test": "maison-mere-aap-link" },
        }),
        createTab({
          text: LABELS.STRUCTURES_CERTIFICATRICES,
          href: PATHS.CERTIFICATION_AUTHORITY_STRUCTURES,
          isActive: currentPathname.startsWith(
            PATHS.CERTIFICATION_AUTHORITY_STRUCTURES,
          ),
        }),
        ...(showAAPVaeCollectivesTabsAndMenus
          ? [
              createTab({
                text: LABELS.STRUCTURES_VAE_COLLECTIVE,
                href: PATHS.STRUCTURES_VAE_COLLECTIVE,
                isActive: currentPathname.startsWith(
                  PATHS.STRUCTURES_VAE_COLLECTIVE,
                ),
              }),
            ]
          : []),
      ],
    },
    createTab({
      text: LABELS.CERTIFICATEURS_CANDIDATURES,
      href: PATHS.FEASIBILITIES,
      isActive: isCertificationAuthorityCandidaciesPath(currentPathname),
    }),
  ];

  const aapTabs = [
    createTab({
      text: LABELS.CANDIDACIES,
      href: PATHS.CANDIDACIES,
      isActive: isAAPCandidaciesPath(currentPathname),
    }),
    ...(showAAPVaeCollectivesTabsAndMenus
      ? [
          createTab({
            text: LABELS.VAE_COLLECTIVES,
            href: PATHS.VAE_COLLECTIVES,
            isActive: isAAPVaeCollectivesPath(currentPathname),
          }),
        ]
      : []),
    createTab({
      text: LABELS.PARAMETRES,
      href: PATHS.AGENCIES_SETTINGS,
      isActive: currentPathname.startsWith("/agencies-settings"),
    }),
  ];

  const registryManagerTabs = [
    createTab({
      text: LABELS.GESTION_CERTIFICATIONS,
      href: PATHS.RESPONSABLE_CERTIFICATIONS,
      isActive: currentPathname.startsWith(PATHS.RESPONSABLE_CERTIFICATIONS),
    }),
  ];

  const certificationAuthorityAdminTabs = [
    createTab({
      text: LABELS.CANDIDACIES,
      href: PATHS.FEASIBILITIES,
      isActive: isCertificationAuthorityCandidaciesPath(currentPathname),
    }),
    createTab({
      text: LABELS.PARAMETRES,
      href: PATHS.CERTIFICATION_AUTHORITIES_SETTINGS,
      isActive: currentPathname.startsWith(
        PATHS.CERTIFICATION_AUTHORITIES_SETTINGS,
      ),
    }),
  ];

  if (metabaseDashboardIframeUrl) {
    certificationAuthorityAdminTabs.push(
      createTab({
        text: LABELS.STATISTIQUES,
        href: PATHS.STATISTIQUES,
        isActive: currentPathname.startsWith(PATHS.STATISTIQUES),
      }),
    );
  }

  const certificationAuthorityLocalAccountTabs = [
    createTab({
      text: LABELS.CANDIDACIES,
      href: PATHS.FEASIBILITIES,
      isActive: isCertificationAuthorityCandidaciesPath(currentPathname),
    }),
    createTab({
      text: LABELS.PARAMETRES,
      href: PATHS.CERTIFICATION_AUTHORITIES_SETTINGS_LOCAL,
      isActive: currentPathname.startsWith(
        PATHS.CERTIFICATION_AUTHORITIES_SETTINGS_LOCAL,
      ),
    }),
  ];

  switch (true) {
    case isAdmin:
      return adminTabs;
    case isGestionnaireMaisonMereAAP:
    case isOrganism:
      return aapTabs;
    case isCertificationAuthorityLocalAccount:
      return certificationAuthorityLocalAccountTabs;
    case isCertificationRegistryManager:
      return registryManagerTabs;
    case isAdminCertificationAuthority:
      return certificationAuthorityAdminTabs;
    default:
      return [];
  }
};

export const Header = () => {
  const currentPathname = usePathname();
  const {
    isAdmin,
    isOrganism,
    isGestionnaireMaisonMereAAP,
    isAdminCertificationAuthority,
    isCertificationRegistryManager,
    isCertificationAuthorityLocalAccount,
  } = useAuth();
  const { logout } = useKeycloakContext();

  const { graphqlClient } = useGraphQlClient();

  const { isFeatureActive } = useFeatureflipping();

  const { data: getCertificationAuthorityMetabaseUrl } = useQuery({
    queryKey: ["certificateur", "getCertificationAuthorityMetabaseUrl"],
    queryFn: () =>
      graphqlClient.request(getCertificationAuthorityMetabaseUrlQuery),
  });

  const metabaseDashboardIframeUrl =
    getCertificationAuthorityMetabaseUrl?.account_getAccountForConnectedUser
      ?.certificationAuthority?.metabaseDashboardIframeUrl;

  const isVaeCollectiveFeatureActive = isFeatureActive("VAE_COLLECTIVE");

  const { data: getCohortesVaeCollectivesForConnectedAap } = useQuery({
    queryKey: ["aap", "getCohortesVaeCollectivesForConnectedAap"],
    queryFn: () =>
      graphqlClient.request(getCohortesVaeCollectivesForConnectedAapQuery),
    enabled: isVaeCollectiveFeatureActive && isOrganism && !isAdmin,
  });

  const showAAPVaeCollectivesTabsAndMenus =
    isVaeCollectiveFeatureActive &&
    isOrganism &&
    !isAdmin &&
    !!getCohortesVaeCollectivesForConnectedAap
      ?.cohortesVaeCollectivesForConnectedAap?.length;

  const navigation = getNavigationTabs({
    currentPathname,
    isAdmin,
    isOrganism,
    isGestionnaireMaisonMereAAP,
    isCertificationAuthorityLocalAccount,
    isCertificationRegistryManager,
    isAdminCertificationAuthority,
    metabaseDashboardIframeUrl,
    showAAPVaeCollectivesTabsAndMenus,
  });

  return (
    <DsfrHeader
      brandTop={
        <>
          république
          <br />
          française
        </>
      }
      homeLinkProps={{
        href: "/../",
        title: "Accueil - France VAE",
      }}
      operatorLogo={{
        alt: "France VAE",
        imgUrl: "/admin2/fvae_logo.svg",
        orientation: "horizontal",
      }}
      classes={{ operator: "min-w-[9.0625rem] min-h-[90px]" }}
      quickAccessItems={[
        {
          buttonProps: {
            onClick: () => logout(),
            className: "!text-sm !px-3 !py-1 !mb-4 !mx-1",
          },
          iconId: "ri-logout-box-r-line",
          text: "Se déconnecter",
        },
      ]}
      navigation={navigation}
      serviceTitle={
        isCertificationRegistryManager
          ? "Espace Responsable des certifications"
          : ""
      }
    />
  );
};
