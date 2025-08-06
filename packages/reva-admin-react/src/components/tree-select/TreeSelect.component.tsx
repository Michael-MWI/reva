import Accordion from "@codegouvfr/react-dsfr/Accordion";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { SearchBar } from "@codegouvfr/react-dsfr/SearchBar";
import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch";
import { useState } from "react";

import {
  checkIfAllItemsSelected,
  getFilteredItems,
} from "./TreeSelect.helpers";
import { TreeSelectItem } from "./TreeSelect.types";

interface Props {
  title: string;
  label: string;
  items: TreeSelectItem[];
  onClickSelectAll: (checked: boolean) => void;
  onClickItem: (item: TreeSelectItem) => void;
  readonly?: boolean;
  toggleButtonIsSelected?: boolean;
  fullHeight?: boolean;
  fullWidth?: boolean;
  hideToggleButton?: boolean;
}

export const TreeSelect = (props: Props) => {
  const {
    title,
    label,
    items,
    onClickSelectAll,
    onClickItem,
    readonly,
    toggleButtonIsSelected,
    fullHeight,
    fullWidth,
    hideToggleButton,
  } = props;

  const isAllSelected = checkIfAllItemsSelected(items);

  const [search, onSearchChange] = useState("");

  const filteredItems = getFilteredItems(search, items);

  const renderItems = (items: TreeSelectItem[]) => {
    return (
      <>
        {items.map((item) => {
          const availableChildren = item.children && item.children.length > 0;
          const isPartiallySelected = item?.children?.some(
            (child) => child.selected,
          );

          return (
            <div
              key={item.id}
              data-test={`tree-select-item-${item.label}`}
              className={
                availableChildren ? "relative fix-accordion" : "fix-accordion"
              }
            >
              <Checkbox
                disabled={readonly}
                className={
                  availableChildren
                    ? `absolute z-10 top-0.5 pt-2.5 bg-white w-[calc(100%-36px)] mb-0 ${
                        isPartiallySelected ? "checkbox-partial" : ""
                      }`
                    : "top-0.5 pt-2.5 bg-white w-full mb-0"
                }
                key={item.id}
                options={[
                  {
                    label: (
                      <span className="text-xs sm:text-base">{item.label}</span>
                    ),
                    nativeInputProps: {
                      checked: item.selected,
                      onChange: () => {
                        onClickItem(item);
                      },
                    },
                  },
                ]}
              />
              {item.children && item.children.length > 0 && (
                <Accordion label="">{renderItems(item.children)}</Accordion>
              )}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div
      className={`flex-1 flex flex-col gap-2 ${fullWidth ? "w-full" : "max-w-[450px]"}`}
    >
      {title && <div>{title}</div>}
      <SearchBar
        renderInput={({ className, id, placeholder, type }) => (
          <input
            className={className}
            id={id}
            placeholder={placeholder}
            type={type}
            value={search}
            onChange={(event) => onSearchChange(event.currentTarget.value)}
          />
        )}
      />
      {!hideToggleButton && (
        <div>
          <ToggleSwitch
            disabled={readonly}
            inputTitle={label}
            label={label}
            labelPosition="left"
            showCheckedHint={false}
            checked={toggleButtonIsSelected || isAllSelected}
            onChange={onClickSelectAll}
          />
        </div>
      )}
      <div
        className={`${
          fullHeight ? "overflow-y-hidden" : "max-h-[500px] overflow-y-auto"
        } overflow-x-hidden`}
      >
        {renderItems(filteredItems)}
      </div>
    </div>
  );
};
