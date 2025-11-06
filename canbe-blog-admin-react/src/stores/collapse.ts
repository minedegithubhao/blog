import { create } from "zustand";

type TabStore = {
  isCollapse: boolean;
  changeCollapse: () => void;
};
const useTabStore = create<TabStore>((set) => ({
  isCollapse: false,
  changeCollapse: () => set((state) => ({ isCollapse: !state.isCollapse })),
}));

export default useTabStore;
