import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useWindowStore = create(devtools((set, get)=>({
  deviceType: undefined,
  width: undefined,
  height: undefined,
  visibility: undefined,
  mouseX: 0,
  mouseY: 0,
  setState: ({ width, height, visibility }) => set({
    width,
    height,
    visibility
  }),
  setDeviceType: ( deviceType ) => set({ deviceType }),
  setWidth: ( width ) => set({ width }),
  setHeight: ( height ) => set({ height }),
  setVisibility: ( visibility ) => set({ visibility }),
  setMousePosition: ({ mouseX, mouseY }) => set({ mouseX, mouseY }),
})));

export default useWindowStore;