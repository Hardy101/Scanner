import { create } from "zustand";

interface ToastData {
  isToastActive: boolean;
  text: string;
  setIsToastActive: (open: boolean) => void;
  setText: (text: string) => void;
}

export const useToastStore = create<ToastData>((set) => ({
  isToastActive: false,
  text: "",
  setIsToastActive: (open) => {
    set({ isToastActive: open });
    if (open) {
      setTimeout(() => set({ isToastActive: false }), 3000); // Auto-close after 3 seconds
    }
  },
  setText: (text) => set({ text }),
}));
