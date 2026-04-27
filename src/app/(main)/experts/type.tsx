export type ExpertStatus = "verified" | "pending";

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  fullname: string | null;
  gender: boolean;
  birth_date: string | null;
  avatar_url: string | null;
  created_at: string;
  isVerified: boolean;
}

export interface ExpertRole {
  id: string;
  name: string;
  can_do_video: boolean;
  description: string | null;
}

export interface ApiExpert {
  id: string;
  bio: string;
  token_per_minute: number;
  license_id: string;
  license_url: string;
  is_verified: boolean;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  deleted_at: string | null;
  user: User;
  expert_role: ExpertRole;
  booking_fee_tier: unknown;
}

export interface Expert {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  specialization: string;
  bio: string;
  status: ExpertStatus;
  application_date: string;
  licenseUrl: string;
  licenseId: string;
  rating: {
    avg: number;
    count: number;
  };
  isVerified: boolean;
  canDoVideo: boolean;
  created_at: string;
  tokenPerMinute: number;
}
