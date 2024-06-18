import { useState } from "react";

interface Props {
  title: string;
  name: string;
  src: string;
}

export const FancyPreview = (props: Props): JSX.Element | null => {
  const { title, name, src } = props;

  const [display, setDisplay] = useState<boolean>(false);

  const backgroundColor = display
    ? "bg-[#E3E3FD]"
    : "bg-dsfr-light-neutral-grey-1000";

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`flex flex-row items-center justify-between px-4 py-3 border-gray-200 border-x border-b cursor-pointer ${backgroundColor}`}
        onClick={() => setDisplay(!display)}
      >
        <label className="text-blue-800 font-medium cursor-pointer">
          {display ? "Masquer la pièce jointe" : "Voir la pièce jointe"}
        </label>
        <span
          className="fr-icon-eye-off-fill text-blue-800"
          aria-hidden="true"
        />
      </div>
      {display && (
        <iframe
          className="w-full h-[500px] px-4"
          title={title}
          name={name}
          src={src}
        />
      )}
    </div>
  );
};
