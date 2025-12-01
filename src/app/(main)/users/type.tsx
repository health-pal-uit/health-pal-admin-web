export type ApiUser = {
  id: string;
  username: string;
  email: string;
  fullname: string;
  phone: string;
  gender: boolean;
  birth_date: string | null;
  avatar_url: string | null;
  created_at: string;
  deactivated_at: string | null;
  isVerified: boolean;
  google_fit_connected_at: string | null;
  google_fit_refresh_token: string | null;
  google_fit_access_token: string | null;
  google_fit_token_expires_at: string | null;
  google_fit_email: string | null;
  hashed_password?: string | null;
  role?: {
    id: string;
    name: string;
    created_at: string;
    deleted_at: string | null;
  };
};

export type PaginationData = {
  total: number;
  page: number;
  limit: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "suspended";
  joined: string;
  avatar: string;
  username: string;
  phone: string;
  gender: string;
  birthDate: string;
  birthDateRaw?: string | null; // For age calculation
};
