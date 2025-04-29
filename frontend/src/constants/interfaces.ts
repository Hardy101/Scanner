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