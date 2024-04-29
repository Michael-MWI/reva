import Input from "@codegouvfr/react-dsfr/Input";
import { useEffect, useState } from "react";

interface OrganismDistanceFilterProps {
  onChangeSearchZip: (zip: string) => void;
  disabled: boolean;
}

export const OrganismDistanceFilter = ({
  onChangeSearchZip,
  disabled,
}: OrganismDistanceFilterProps) => {
  const [zip, setZipOrCity] = useState("");

  useEffect(() => {
    if (zip.length === 0 || zip.length === 5) {
      onChangeSearchZip(zip);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zip]);

  return (
    <div className="flex flex-col gap-6 mt-6">
      <fieldset>
        <legend className={`mb-2 ${disabled ? "text-gray-400" : ""}`}>
          Indiquez un code postal
        </legend>
        <Input
          label=""
          disabled={disabled}
          nativeInputProps={{
            onChange: (e) => {
              // Ensure the input contains only digits and is at most 5 characters long for the zip code
              if (!/^\d{0,5}$/.test(e.target.value)) {
                return;
              }
              setZipOrCity(e.target.value);
            },
            value: zip,
          }}
        />
      </fieldset>
    </div>
  );
};
