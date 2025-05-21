export interface EventFormData {
  name: string;
  date: string;
  time: string;
  image_url: string;
  location: string;
  expected_guests: number;
}

export interface Guest {
  name: string;
  tags: string;
  email: string;
  errors?: string;
}

export interface GuestResponse {
  id: number;
  name: string;
  tags: string;
  qr_token: string;
}

export interface CreateEventFormProps {
  isCreateEventActive: boolean;
  setIsCreateEventActive: (tab: boolean) => void;
}

export interface EventModalProps {
  guest: Guest;
  setGuest: React.Dispatch<React.SetStateAction<Guest>>;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
}
