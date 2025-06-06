"use client";

import { PageLayout } from "@/layouts/page.layout";

import { NameBadge } from "@/components/legacy/molecules/NameBadge/NameBadge";
import { ProjectTimeline } from "@/components/legacy/organisms/ProjectTimeline/ProjectTimeline";

import { format } from "date-fns";
import { CandidacyBanner } from "./_components/CandidacyBanner";
import Dashboard from "./_components/dashboard/Dashboard";
import { useHome } from "./home.hook";

export default function Home() {
  const { candidate, isCandidateDashboardActive } = useHome();

  return (
    <>
      {isCandidateDashboardActive ? (
        <PageLayout data-test="candidate-dashboard">
          <NameBadge
            as="h2"
            data-test="project-home-fullname"
            firstname={candidate?.firstname}
            lastname={candidate?.lastname}
          />
          <Dashboard />
        </PageLayout>
      ) : (
        <PageLayout data-test="project-home-ready">
          <NameBadge
            as="h2"
            className="mt-4"
            data-test="project-home-fullname"
            firstname={candidate?.firstname}
            lastname={candidate?.lastname}
          />
          <CandidacyBanner />
          {candidate?.candidacy?.lastActivityDate && (
            <div className="text-sm text-dsfrGray-500">
              Dernière actualisation <strong>enregistrée</strong> le{" "}
              {format(candidate.candidacy.lastActivityDate, "dd/MM/yyyy")}.
            </div>
          )}
          <ProjectTimeline className="mt-8" />
        </PageLayout>
      )}
    </>
  );
}
