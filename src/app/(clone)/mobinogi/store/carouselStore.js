import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useCarouselStore = create(devtools((set, get)=>({
  running: false,
  index: 0,
  height: 0,
  setRunning: ( running ) => set({ running }),
  getRunning: () => get().running,
  setIndex: ( index ) => set({ index }),
  getIndex: () => get().index,
  setHeight: ( height ) => set({ height }),
  getHeight: () => get().height,
})));

export default useCarouselStore;