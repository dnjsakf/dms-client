import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useWindowStore = create(devtools((set, get)=>({
  width: undefined,
  height: undefined,
  visibility: undefined,
  setState: ({ width, height, visibility }) => set({
    width,
    height,
    visibility
  }),
  setWidth: ( width ) => set({ width }),
  setHeight: ( height ) => set({ height }),
  setVisibility: ( visibility ) => set({ visibility }),
})));

export default useWindowStore;