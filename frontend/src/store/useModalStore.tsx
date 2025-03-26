import { create } from "zustand";

type ModalState = {
  isModalActive: boolean;
  setIsModalActive: (open: boolean) => void;
};

export const useModalStore = create<ModalState>((set) => ({
  isModalActive: false,
  setIsModalActive: (open) => set({ isModalActive: open }),
}));
