export interface EventformData {
  name: string;
  date: string;
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
