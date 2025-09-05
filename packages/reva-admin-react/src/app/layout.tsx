"use client";

import "@/styles/dsfr-theme-tac-extra.css";
import "@/styles/dsfr-theme-tac.min.css";
import "@/styles/globals.css";

// import { getHtmlAttributes } from "@/components/dsfr/server-only-index";

import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setDefaultOptions } from "date-fns";
import { fr } from "date-fns/locale";
import Keycloak from "keycloak-js";
import Script from "next/script";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { useAuth } from "@/components/auth/auth";
import {
  KeycloakProvider,
  useKeycloakContext,
} from "@/components/auth/keycloakContext";
import { useCrisp } from "@/components/crisp/useCrisp";
import { DsfrProvider, StartDsfrOnHydration } from "@/components/dsfr";
import { DsfrHead } from "@/components/dsfr/DsfrHead";
import { useFeatureflipping } from "@/components/feature-flipping/featureFlipping";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header/Header";
import { LayoutNotice } from "@/components/layout-notice/LayoutNotice";
import { Produktly } from "@/components/script/Produktly";
import { tarteaucitronScript } from "@/components/script/Tarteaucitron";
import {
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_REALM,
  KEYCLOAK_URL,
  MATOMO_CONTAINER_NAME,
  MATOMO_URL,
  PRODUKTLY_CLIENT_TOKEN,
} from "@/config/config";

const keycloakInstance =
  typeof window !== "undefined"
    ? new Keycloak({
        clientId: KEYCLOAK_CLIENT_ID || "",
        realm: KEYCLOAK_REALM || "",
        url: KEYCLOAK_URL,
      })
    : undefined;

const queryClient = new QueryClient();

setDefaultOptions({ locale: fr });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = "fr";

  return (
    <html
      //should use  <html {...getHtmlAttributes({ lang })} ... but calling getHtmlAttributes clashes with tailwind css overrides for unknown reasons
      // {...getHtmlAttributes({ lang })}
      lang={lang}
    >
      <head>
        <StartDsfrOnHydration />
        <DsfrHead />
        {PRODUKTLY_CLIENT_TOKEN && <Produktly />}
        <title>France VAE</title>
      </head>
      <body>
        <DsfrProvider lang={lang}>
          <KeycloakProvider keycloakInstance={keycloakInstance}>
            <QueryClientProvider client={queryClient}>
              <Toaster position="top-right" />
              <LayoutContent>{children}</LayoutContent>
            </QueryClientProvider>
          </KeycloakProvider>
        </DsfrProvider>
        {
          // The tarteaucitron lib waits for the document load event to initialize itself
          // (cf "window.addEventListener("load", function ()" in the tarteaucitron.js file)
          // To avoid cases where tarteaucitron doesn't start because the document is already loaded,
          // we need to use Script in _document.tsx with the beforeInteractive strategy.
          // onLoad can't be used with the beforeInteractive strategy, so we manually
          // create a script tag in order to attach the required onLoad callback
          ((MATOMO_URL && MATOMO_CONTAINER_NAME) ||
            process.env.NEXT_PUBLIC_CRISP_ID) && (
            <Script strategy="beforeInteractive" id="tarteaucitron-wrapper">
              {tarteaucitronScript({
                matomoUrl: `${MATOMO_URL}/js/container_${MATOMO_CONTAINER_NAME}.js`,
                crispID: process.env.NEXT_PUBLIC_CRISP_ID || "",
              })}
            </Script>
          )
        }
      </body>
    </html>
  );
}

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { authenticated, keycloakUser } = useKeycloakContext();
  const { status: featureFlippingHookStatus, isFeatureActive } =
    useFeatureflipping();

  const shouldLoadCrisp =
    authenticated && isFeatureActive("SHOW_CRISP_IN_ADMIN");

  const { configureUser, resetUser } = useCrisp({
    shouldLoad: shouldLoadCrisp,
  });

  const {
    isAdmin,
    isCertificationAuthority,
    isOrganism,
    isGestionnaireMaisonMereAAP,
    isAdminCertificationAuthority,
    isCertificationRegistryManager,
  } = useAuth();

  useEffect(() => {
    if (keycloakUser && shouldLoadCrisp) {
      const { id, email } = keycloakUser;
      configureUser({
        id,
        email,
      });
    } else {
      resetUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keycloakUser, shouldLoadCrisp]);

  const bgClass = () => {
    if (isAdmin) {
      return "lg:bg-admin";
    }
    if (isOrganism || isGestionnaireMaisonMereAAP) {
      return "lg:bg-organism";
    }
    if (
      isCertificationAuthority ||
      isAdminCertificationAuthority ||
      isCertificationRegistryManager
    ) {
      return "lg:bg-certification-authority";
    }
    return "lg:bg-unknown";
  };

  return (
    featureFlippingHookStatus === "INITIALIZED" && (
      <div className="w-full min-h-screen flex flex-col">
        <SkipLinks
          links={[
            {
              anchor: "#content",
              label: "Contenu",
            },
            {
              anchor: "#footer",
              label: "Pied de page",
            },
          ]}
        />
        <Header />
        <LayoutNotice />

        <main
          role="main"
          id="content"
          className={`flex flex-col flex-1 ${bgClass()}`}
        >
          <div className="fr-container flex flex-col flex-1">
            <div
              className={`fr-container lg:shadow-lifted flex-1 md:mt-8 px-1 pt-4 md:px-8 md:pt-8 md:pb-8 fr-grid-row bg-white mb-12`}
            >
              {authenticated && children}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    )
  );
};
