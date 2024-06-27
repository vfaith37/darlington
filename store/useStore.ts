// store / useStore.ts;

import create from "zustand";

interface State {
  name: string;
  setName: (name: string) => void;
}

export const useStore = create<State>((set) => ({
  name: "",
  setName: (name) => set({ name }),
}));
