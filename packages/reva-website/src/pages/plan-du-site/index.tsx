import { MainLayout } from "@/components/layout/main-layout/MainLayout";
import Head from "next/head";
import Link from "next/link";

const SiteMapPage = () => {
  return (
    <MainLayout className="fr-container pt-10 items-start gap-5">
      <Head>
        <title>Plan du site - France VAE</title>
      </Head>
      <h1 className="text-3xl mb-5">Plan du site</h1>
      <ul>
        <li>
          <Link href="/">Accueil</Link>
        </li>
        <li>
          <Link href="/espace-candidat">Espace candidat</Link>
          <ul>
            <li>
              <Link href="/app">Connexion candidat</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link href="/espace-professionnel">Espace professionnel</Link>
          <ul>
            <li>
              <Link href="/espace-professionnel/creation">
                Création d'un espace professionnel
              </Link>
              <ul>
                <li>
                  <Link href="/admin">Connexion professionnel</Link>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </MainLayout>
  );
};

export default SiteMapPage;
