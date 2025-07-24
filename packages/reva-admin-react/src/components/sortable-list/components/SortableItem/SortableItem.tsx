import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { createContext, useContext, useMemo } from "react";

import type {
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from "@dnd-kit/core";
import type { CSSProperties, PropsWithChildren } from "react";

import "./SortableItem.css";

interface Props {
  id: UniqueIdentifier;
  className?: string;
}

interface Context {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export function SortableItem({
  children,
  id,
  className,
}: PropsWithChildren<Props>) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef],
  );
  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <div className={className} ref={setNodeRef} style={style}>
        {children}
      </div>
    </SortableItemContext.Provider>
  );
}

interface DragHandleProps {
  className?: string;
}

export function DragHandle(props: DragHandleProps) {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  const { className } = props;

  return (
    <button
      className={`DragHandle ${className || ""}`}
      {...attributes}
      {...listeners}
      ref={ref}
    >
      <svg viewBox="0 0 20 20" width="12">
        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
      </svg>
    </button>
  );
}
