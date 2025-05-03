import { create } from "zustand";

export interface ToastData {
  isToastActive: boolean;
  text: string;
  subtext: string;
  setIsToastActive: (open: boolean) => void;
  setText: (text: string) => void;
  setSubText: (subtext: string) => void;
}

export const useToastStore = create<ToastData>((set) => ({
  isToastActive: false,
  text: "",
  subtext: "",
  setIsToastActive: (open) => {
    set({ isToastActive: open });
    if (open) {
      setTimeout(() => set({ isToastActive: false }), 3000);
    }
  },
  setText: (text) => set({ text }),
  setSubText: (subtext) => set({ subtext }),
}));
