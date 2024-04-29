import { Button } from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { Tag } from "@codegouvfr/react-dsfr/Tag";

import { OrganismDistanceFilter } from "./OrganismDistanceFilter";

const tagFilledStyle = (isSelected: boolean) =>
  isSelected
    ? "bg-dsfrBlue-500 text-white"
    : "bg-dsfrBlue-300 text-dsfrBlue-500";

const modalDistanceInfo = createModal({
  id: "distance-organism-info",
  isOpenedByDefault: false,
});

interface filters {
  organismSearchText: string;
  organismSearchRemote: boolean;
  organismSearchOnsite: boolean;
  organismSearchZip?: string;
}

export const OrganismFilters = ({
  onSearch,
  filterDistanceIsActive,
  filters,
}: {
  onSearch: (filters: filters) => void;
  filterDistanceIsActive: boolean;
  filters: filters;
}) => {
  const { organismSearchRemote, organismSearchOnsite } = filters;
  const searchIsOnlyOnsite = organismSearchOnsite && !organismSearchRemote;
  return (
    <div className="mt-8 lg:mt-0 w-full">
      <h2>Filtres :</h2>
      <div className="px-4 py-4 mb-6 font-medium text-[#000091] bg-[#E3E3FD]">
        Modalités d'accompagnement
      </div>
      <div>
        <Button
          data-test="button-select-onsite"
          priority="tertiary no outline"
          title="Choisir sur site"
          onClick={() => {
            onSearch({
              ...filters,
              organismSearchOnsite: !organismSearchOnsite,
            });
          }}
          className="p-2"
        >
          <Tag
            iconId="fr-icon-building-fill"
            className={tagFilledStyle(organismSearchOnsite)}
          >
            Sur site
          </Tag>
        </Button>
        <Button
          data-test="button-select-remote"
          priority="tertiary no outline"
          title="Choisir à distance"
          onClick={() => {
            onSearch({
              ...filters,
              organismSearchRemote: !organismSearchRemote,
            });
          }}
          className="p-2"
        >
          <Tag
            iconId="fr-icon-customer-service-fill"
            className={tagFilledStyle(organismSearchRemote)}
          >
            À distance
          </Tag>
        </Button>
        <Button
          data-test="button-open-modal-distance"
          priority="tertiary no outline"
          title="Quelle option à distance choisir ?"
          iconId="fr-icon-information-fill"
          onClick={() => modalDistanceInfo.open()}
        >
          <span className="text-dsfrBlue-500 text-sm font-bold">
            Quelle option choisir ?
          </span>
        </Button>
        <modalDistanceInfo.Component
          title="Comment bien choisir entre “sur site” et “à distance” ?"
          size="large"
        >
          <p className="my-4">
            Les accompagnements <strong>sur site </strong>
            sont réalisés directement dans les locaux de l’organisme
            sélectionné.
          </p>
          <p>
            Les accompagnements <strong>à distance</strong> se déroulent
            essentiellement par téléphone ou sur internet, via des outils de
            visio-conférence.
          </p>
        </modalDistanceInfo.Component>
      </div>
      {filterDistanceIsActive && (
        <OrganismDistanceFilter
          disabled={!searchIsOnlyOnsite}
          onChangeSearchZip={(zip) => {
            onSearch({
              ...filters,
              organismSearchZip: zip,
            });
          }}
        />
      )}
    </div>
  );
};
