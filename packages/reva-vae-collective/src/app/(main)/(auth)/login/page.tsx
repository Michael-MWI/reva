"use client";

import Form from "next/form";

import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { login } from "./actions";
import { useFormStatus } from "react-dom";
import { PasswordInput } from "@codegouvfr/react-dsfr/blocks/PasswordInput";

export default function LoginPage() {
  const { pending } = useFormStatus();
  return (
    <div className="p-6 pt-8 mx-auto">
      <h1 className="mb-10">Connexion à France VAE</h1>
      <Form className="flex flex-col gap-6" action={login}>
        <Input
          className="mb-0"
          hintText="Format attendu : nom@domaine.fr"
          nativeInputProps={{
            id: "email",
            name: "email",
            required: true,
            type: "email",
            autoComplete: "username",
            spellCheck: "false",
          }}
          label="Email"
        />

        <PasswordInput
          label="Mot de passe"
          nativeInputProps={{ name: "password" }}
        />

        <Button className="w-full justify-center" disabled={pending}>
          Se connecter
        </Button>
      </Form>
    </div>
  );
}
