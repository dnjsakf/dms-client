import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useWindowEventStore = create(devtools((set, get)=>({
  mode: "scrollX",
  dragging: false,
  grabbing: false,
  startPosX: undefined,
  startPosY: undefined,
  scrollLeft: undefined,
  scrollTop: undefined,
  initPos: () => set({
    grabbing: false,
    startPosX: undefined,
    startPosY: undefined,
    scrollLeft: undefined,
    scrollTop: undefined,
  }),
  setPos: ({
    mode,
    startPosX,
    startPosY,
    scrollLeft,
    scrollTop,
    dragging,
    grabbing
  }) => set({
    mode,
    startPosX,
    startPosY,
    scrollLeft,
    scrollTop,
    dragging,
    grabbing
  }),
  getPos: () => get(),
  setDragging: ( dragging ) => set({ dragging }),
  setGrabbing: ( grabbing ) => set({ grabbing }),
})));

export default useWindowEventStore;