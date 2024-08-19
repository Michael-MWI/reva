import Input from "@codegouvfr/react-dsfr/Input";
import { useState } from "react";
import {
  AddressOption,
  useAutocompleteAddress,
} from "../use-autocomplete-address/useAutocompleteAddress.hook";

export const AutocompleteAddress = ({
  onOptionSelection,
  className,
}: {
  onOptionSelection: (selectedOption: AddressOption) => void;
  className?: string;
}) => {
  const [searchText, setSearchText] = useState("");
  const { data: options = [], status } = useAutocompleteAddress({
    search: searchText,
  });

  const [selectedOption, setSelectedOption] = useState<AddressOption | null>(
    null,
  );

  const [displayOptions, setDisplayOptions] = useState(true);

  const updateSearchText = async (newSearchText: string) => {
    setSearchText(newSearchText);
  };

  const handleKeyDownOnOptions = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        handleSubmit();
        break;
      case "Escape":
        setDisplayOptions(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (options.length) {
          const index = options.findIndex(
            (option) => option.label === selectedOption?.label,
          );
          const nextOption = options[index + 1] || options[0];
          setSelectedOption(nextOption);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (options.length) {
          const index = options.findIndex(
            (option) => option.label === selectedOption?.label,
          );
          const nextOption = options[index - 1] || options[options.length - 1];
          setSelectedOption(nextOption);
        }
        break;
      case "Tab":
        setDisplayOptions(false);
        break;
    }
  };

  const handleOptionSelection = (newSelectedOption: AddressOption) => {
    setSelectedOption(newSelectedOption);
    onOptionSelection?.(newSelectedOption);
    setSearchText(newSelectedOption.label);
  };

  const handleSubmit = () => {
    if (!selectedOption) {
      return;
    }

    handleOptionSelection(selectedOption);
    setDisplayOptions(false);
  };

  return (
    <div data-testid="autocomplete" className={`relative ${className}`}>
      <Input
        nativeInputProps={{
          onKeyDown: handleKeyDownOnOptions,
          onChange: (event) => {
            updateSearchText(event.target.value);

            setDisplayOptions(true);
          },
          value: searchText,
          onBlur: () => {
            setTimeout(() => setDisplayOptions(false), 200);
          },
          onFocus: () => setDisplayOptions(true),
          onClick: () => setDisplayOptions(true),
        }}
        label="Adresse complète"
        data-testid="autocomplete-input"
        iconId="fr-icon-map-pin-2-fill"
      />
      {status === "success" && displayOptions && options.length > 0 && (
        <div
          data-testid="autocomplete-options"
          className="absolute z-10 max-h-[500px] list-none overflow-y-auto top-[75px] whitespace-normal w-full bg-white border-[1px] border-gray-300 px-4 py-2 shadow-[0px_2px_6px_0px_rgba(0,0,18,0.16)]"
        >
          {options.map((option) => {
            const isSelected = selectedOption?.label === option.label;
            return (
              <div
                key={option.label}
                onClick={() => handleOptionSelection(option)}
                className={`whitespace-normal cursor-pointer select-none py-2  ${
                  isSelected ? "bg-dsfrGray-contrast" : ""
                }`}
                onMouseOver={() => setSelectedOption(option)}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}

      {status === "error" && (
        <div
          data-testid="autocomplete-options"
          className="absolute z-10 max-h-[500px] list-none overflow-y-auto top-[75px] whitespace-normal w-full bg-white border-[1px] border-gray-300 px-4 py-2 shadow-[0px_2px_6px_0px_rgba(0,0,18,0.16)]"
        >
          <div
            key="empty-label"
            className="whitespace-normal cursor-default select-none py"
          >
            Une erreur est survenue lors de la recherche
          </div>
        </div>
      )}
    </div>
  );
};
