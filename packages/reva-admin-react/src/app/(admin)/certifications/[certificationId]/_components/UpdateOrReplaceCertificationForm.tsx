"use client";
import { Certification } from "@/graphql/generated/graphql";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useController, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";

const schema = z.object({
  codeRncp: z.string().min(1, "Ce champ est obligatoire"),
  label: z.string().min(1, "Ce champ est obligatoire"),
  expiresAt: z.string(),
  availableAt: z.string(),
  typeDiplomeId: z.string(),
  degreeLevel: z.number(),
  conventionCollectiveId: z.string(),
  domaineId: z.string(),
  certificationAuthorityTag: z.string(),
});

export type UpdateOrReplaceCertificationFormData = z.infer<typeof schema>;

const certificationToFormData = (
  c: Partial<Certification>,
): UpdateOrReplaceCertificationFormData | undefined =>
  c
    ? {
        codeRncp: c.codeRncp || "",
        label: c.label || "",
        expiresAt: format(new Date(c.expiresAt || ""), "yyyy-MM-dd"),
        availableAt: format(new Date(c.availableAt || ""), "yyyy-MM-dd"),
        typeDiplomeId: c.typeDiplome?.id || "",
        certificationAuthorityTag: c.certificationAuthorityTag || "",
        degreeLevel: c.degree?.level || -1,
        conventionCollectiveId: c.conventionsCollectives?.[0]?.id || "",
        domaineId: c.domaines?.[0]?.id || "",
      }
    : undefined;

const UpdateOrReplaceCertificationForm = ({
  certification,
  typeDiplomes,
  domaines,
  conventionCollectives,
  degrees,
  certificationAuthorityTags,
  onSubmit,
}: {
  certification: Certification;
  typeDiplomes: { id: string; label: string }[];
  domaines: { id: string; label: string }[];
  conventionCollectives: { id: string; label: string }[];
  degrees: { id: string; level: number; longLabel: string }[];
  certificationAuthorityTags: string[];
  onSubmit: (data: UpdateOrReplaceCertificationFormData) => void;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateOrReplaceCertificationFormData>({
    resolver: zodResolver(schema),
    defaultValues: certificationToFormData(certification),
  });

  useEffect(() => {
    certification && reset(certificationToFormData(certification));
  }, [certification, reset]);

  const handleFormSubmit = handleSubmit((data) => onSubmit(data));

  const typeDiplomeController = useController({
    control,
    name: "typeDiplomeId",
  });

  const degreeController = useController({
    control,
    name: "degreeLevel",
  });

  const domaineController = useController({
    control,
    name: "domaineId",
  });

  const conventionCollectiveController = useController({
    control,
    name: "conventionCollectiveId",
  });

  const certificationAuthorityTagController = useController({
    control,
    name: "certificationAuthorityTag",
  });

  return (
    <form
      className="grid grid-cols-1  md:grid-cols-2 gap-8"
      onSubmit={handleFormSubmit}
      onReset={(e) => {
        e.preventDefault();
        reset(certificationToFormData(certification as Certification));
      }}
    >
      <Input
        label="Libellé"
        className="md:col-span-2"
        nativeInputProps={{ ...register("label") }}
        state={errors.label ? "error" : "default"}
        stateRelatedMessage={errors.label?.message}
      />
      <Input
        label="Code RNCP"
        nativeInputProps={{ ...register("codeRncp") }}
        state={errors.codeRncp ? "error" : "default"}
        stateRelatedMessage={errors.codeRncp?.message}
      />
      <Select
        label="Tag certificateur"
        nativeSelectProps={{
          onChange: (event) =>
            certificationAuthorityTagController.field.onChange(
              event.target.value,
            ),
          value: certificationAuthorityTagController.field.value,
        }}
      >
        <option />
        {certificationAuthorityTags?.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </Select>
      <Input
        className="col-start-1"
        label="Disponible à partir du"
        nativeInputProps={{
          ...register("availableAt"),
          type: "date",
        }}
        state={errors.availableAt ? "error" : "default"}
        stateRelatedMessage={errors.availableAt?.message}
      />
      <Input
        label="Expire à partir du"
        nativeInputProps={{
          ...register("expiresAt"),
          type: "date",
        }}
        state={errors.expiresAt ? "error" : "default"}
        stateRelatedMessage={errors.expiresAt?.message}
      />
      <Select
        label="Niveau de la certification"
        nativeSelectProps={{
          onChange: (event) =>
            degreeController.field.onChange(
              Number.parseInt(event.target.value),
            ),
          value: degreeController.field.value,
        }}
      >
        {degrees?.map((d) => (
          <option key={d.id} value={d.level}>
            {d.longLabel}
          </option>
        ))}
      </Select>
      <Select
        label="Type de la certification"
        nativeSelectProps={{
          onChange: (event) =>
            typeDiplomeController.field.onChange(event.target.value),
          value: typeDiplomeController.field.value,
        }}
      >
        {typeDiplomes?.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </Select>
      <Select
        label="Filière de la certification"
        nativeSelectProps={{
          onChange: (event) =>
            domaineController.field.onChange(event.target.value),
          value: domaineController.field.value,
        }}
      >
        <option />
        {domaines?.map((d) => (
          <option key={d.id} value={d.id}>
            {d.label}
          </option>
        ))}
      </Select>
      <Select
        label="Convention collective de la certification"
        nativeSelectProps={{
          onChange: (event) =>
            conventionCollectiveController.field.onChange(event.target.value),
          value: conventionCollectiveController.field.value,
        }}
      >
        <option />
        {conventionCollectives?.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </Select>
      <div className="flex flex-col md:flex-row gap-4 items-center md:col-start-2 md:ml-auto md:mt-8">
        <Button priority="secondary" type="reset">
          Annuler
        </Button>
        <Button disabled={isSubmitting}>Valider</Button>
      </div>
    </form>
  );
};

export default UpdateOrReplaceCertificationForm;
