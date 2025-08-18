"use client";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useGraphQlClient } from "@/components/graphql/graphql-client/GraphqlClient";

import { graphql } from "@/graphql/generated";

const getVaeCollectiveCohortQuery = graphql(`
  query getVaeCollectiveCohort($codeInscription: String!) {
    cohorteVaeCollective(codeInscription: $codeInscription) {
      id
      codeInscription
    }
  }
`);

const zodSchema = z.object({
  code: z
    .string()
    .length(8, "Le code doit contenir exactement 8 caractères")
    .regex(
      /^[A-Za-z0-9]+$/,
      "Le code ne doit contenir que des lettres et des chiffres",
    ),
});

type FormData = z.infer<typeof zodSchema>;

export function VaeCollectiveCodeForm() {
  const router = useRouter();
  const { graphqlClient } = useGraphQlClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(zodSchema),
    defaultValues: {
      code: "",
    },
    reValidateMode: "onSubmit",
  });

  const codeValue = watch("code");
  const isFormComplete = codeValue.length === 8;

  const { refetch: validateCode, isLoading } = useQuery({
    queryKey: ["validateVaeCollectiveCode", codeValue],
    queryFn: () =>
      graphqlClient.request(getVaeCollectiveCohortQuery, {
        codeInscription: codeValue,
      }),
    enabled: false,
  });

  const handleFormSubmit = handleSubmit(async () => {
    const result = await validateCode();
    if (result.data?.cohorteVaeCollective) {
      router.push(`/inscription-candidat/vae-collective/${codeValue}`);
    } else {
      setError("code", {
        message:
          "Le code ne correspond à aucune VAE collective engagée sur France VAE",
      });
    }
  });

  return (
    <div className="w-full mx-auto p-6 max-w-xl shadow-[0px_6px_18px_0px_rgba(0,0,18,0.16)]">
      <form onSubmit={handleFormSubmit} className="flex flex-col">
        <Input
          label="Code VAE collective"
          classes={{
            nativeInputOrTextArea: "uppercase",
          }}
          hintText="8 caractères alphanumériques"
          state={errors.code ? "error" : "default"}
          stateRelatedMessage={errors.code?.message}
          nativeInputProps={{
            ...register("code", {
              onChange: () => clearErrors("code"),
            }),
            maxLength: 8,
            autoComplete: "off",
            spellCheck: false,
          }}
        />
        <Button
          className="w-full justify-center"
          priority="primary"
          type="submit"
          disabled={!isDirty || !isFormComplete || isLoading}
        >
          Accéder à cette VAE collective
        </Button>
      </form>
    </div>
  );
}
