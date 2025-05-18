import { create } from "zustand";
import { Guest, EventFormData } from "../constants/interfaces";

interface GuestStore {
  guest: Guest;
  formData: EventFormData;
  setGuest: (guest: Guest) => void;
  setFormData: (formData: EventFormData) => void;
  resetGuest: () => void;
  resetFormData: () => void;
}

const initialGuest: Guest = {
  name: "",
  tags: "",
  email: "",
  errors: "",
};

const initialFormData: EventFormData = {
  name: "",
  date: "",
  location: "",
  expected_guests: 0,
};

export const useGuestStore = create<GuestStore>((set) => ({
  guest: initialGuest,
  formData: initialFormData,
  setGuest: (guest) => set({ guest }),
  setFormData: (formData) => set({ formData }),
  resetGuest: () => set({ guest: initialGuest }),
  resetFormData: () => set({ formData: initialFormData }),
}));
