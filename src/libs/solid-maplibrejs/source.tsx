import { type SourceSpecification } from "maplibre-gl";
import { createContext, JSX, onCleanup, useContext, createUniqueId, createMemo, type Component } from "solid-js";
import { useMapEffect, useMap } from "./map";

const SourceIdContext = createContext<string>();
export const useSourceId = () => useContext(SourceIdContext);

export interface SourceProps {
  id?: string;
  source: SourceSpecification;
  children?: JSX.Element;
}

export const Source: Component<SourceProps> = (props) => {
  const id = createMemo(() => props.id ?? createUniqueId());

  useMapEffect((map) => {
    if (!map.getSource(id())) {
      map.addSource(id(), props.source);
    }
  });

  onCleanup(() => useMap()?.()?.getSource(id()) && useMap()?.()?.removeSource(id()));

  return (
    <SourceIdContext.Provider value={id()}>
      {props.children}
    </SourceIdContext.Provider>
  );
}
