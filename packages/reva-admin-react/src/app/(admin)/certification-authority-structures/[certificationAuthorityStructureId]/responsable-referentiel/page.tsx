"use client";

import { Input } from "@codegouvfr/react-dsfr/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormButtons } from "@/components/form/form-footer/FormButtons";
import { Impersonate } from "@/components/impersonate";
import { graphqlErrorToast, successToast } from "@/components/toast/toast";

import { CertificationAuthorityStructureBreadcrumb } from "../_components/certification-authority-structure-breadcrumb/CertificationAuthorityStructureBreadcrumb";

import { useCertificationRegistryPage } from "./responsableReferentiel.hooks";

const schema = z.object({
  accountFirstname: z.string().optional().default(""),
  accountLastname: z
    .string()
    .min(2, "Ce champ doit contenir au moins 2 caractères")
    .default(""),
  accountEmail: z
    .string()
    .email("Le champ doit contenir une adresse email")
    .default(""),
});

type FormData = z.infer<typeof schema>;

const CertificationAuthorityStructureInformationsGeneralesPage = () => {
  const router = useRouter();

  const { certificationAuthorityStructureId } = useParams<{
    certificationAuthorityStructureId: string;
  }>();

  const {
    certificationAuthorityStructure,
    getCertificationRegistryManagerStatus,
    createCertificationRegistryManager,
  } = useCertificationRegistryPage({ certificationAuthorityStructureId });

  const certificationRegistryManager =
    certificationAuthorityStructure?.certificationRegistryManager;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      accountLastname:
        certificationRegistryManager?.account.lastname || undefined,
      accountFirstname:
        certificationRegistryManager?.account.firstname || undefined,
      accountEmail: certificationRegistryManager?.account.email,
    },
  });

  const handleFormSubmit = handleSubmit(
    async (data) => {
      try {
        await createCertificationRegistryManager.mutateAsync({
          ...data,
          certificationAuthorityStructureId,
        });
        successToast("Le responsable de certifications a été créé avec succès");
        router.push(
          `/certification-authority-structures/${certificationAuthorityStructureId}`,
        );
      } catch (e) {
        graphqlErrorToast(e);
      }
    },
    (e) => console.log({ e }),
  );

  const handleReset = useCallback(() => {
    reset({
      accountLastname:
        certificationRegistryManager?.account.lastname || undefined,
      accountFirstname:
        certificationRegistryManager?.account.firstname || undefined,
      accountEmail: certificationRegistryManager?.account.email,
    });
  }, [certificationRegistryManager, reset]);

  useEffect(() => {
    handleReset();
  }, [handleReset]);

  if (getCertificationRegistryManagerStatus !== "success") {
    return null;
  }

  return (
    <div className="flex flex-col flex-1">
      <CertificationAuthorityStructureBreadcrumb
        certificationAuthorityStructureId={certificationAuthorityStructureId}
        certificationAuthorityStructureLabel={
          certificationAuthorityStructure?.label || "..."
        }
        pageLabel="Responsable de certifications"
      />
      <div className="flex flex-row justify-between">
        <h1>Responsable de certifications</h1>

        {certificationRegistryManager?.account.id && (
          <Impersonate
            accountId={certificationRegistryManager?.account.id}
            size="small"
          />
        )}
      </div>
      <p className="text-xl">
        Le responsable de certifications bénéficie d'un espace personnel sur la
        plateforme. Renseignez ses informations de connexion pour qu’il puisse
        commencer à travailler.
      </p>
      <form className="flex flex-col mt-4" onSubmit={handleFormSubmit}>
        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <legend className="text-3xl text-neutral-900 font-bold mb-4">
            Informations de connexion
          </legend>
          <Input
            label="Nom"
            disabled={!!certificationRegistryManager}
            nativeInputProps={{
              ...register("accountLastname"),
            }}
            state={errors.accountLastname ? "error" : "default"}
            stateRelatedMessage={errors.accountLastname?.message}
          />
          <Input
            label="Prénom"
            disabled={!!certificationRegistryManager}
            nativeInputProps={{
              ...register("accountFirstname"),
            }}
            state={errors.accountFirstname ? "error" : "default"}
            stateRelatedMessage={errors.accountFirstname?.message}
          />
          <Input
            label="Email de connexion"
            disabled={!!certificationRegistryManager}
            nativeInputProps={{
              ...register("accountEmail"),
            }}
            state={errors.accountEmail ? "error" : "default"}
            stateRelatedMessage={errors.accountEmail?.message}
          />
        </fieldset>
        <FormButtons
          backUrl={`/certification-authority-structures/${certificationAuthorityStructureId}`}
          formState={{ isDirty, isSubmitting }}
        />
      </form>
    </div>
  );
};

export default CertificationAuthorityStructureInformationsGeneralesPage;
