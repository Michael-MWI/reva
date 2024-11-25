"use client";
import { useParams } from "next/navigation";
import { useUpdateCertificationStructurePage } from "./updateCertificationStructure.hook";
import { successToast, graphqlErrorToast } from "@/components/toast/toast";
import {
  CertificationStructureFormData,
  StructureForm,
} from "./_components/StructureForm";

export default function UpdateCertificationStructurePage() {
  const { certificationId } = useParams<{
    certificationId: string;
  }>();

  const {
    certification,
    availableStructures,
    getCertificationStructureAndGestionnairesQueryStatus,
    updateCertificationStructure,
  } = useUpdateCertificationStructurePage({ certificationId });

  const handleFormSubmit = async (data: CertificationStructureFormData) => {
    try {
      await updateCertificationStructure.mutateAsync(data);
      successToast("modifications enregistrées");
    } catch (e) {
      graphqlErrorToast(e);
    }
  };

  return getCertificationStructureAndGestionnairesQueryStatus === "success" &&
    certification ? (
    <StructureForm
      certification={certification}
      availableStructures={availableStructures}
      onSubmit={handleFormSubmit}
    />
  ) : null;
}
