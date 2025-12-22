export type PostStatus = "pending" | "approved" | "rejected" | "flagged";

export type AttachType = "none" | "meal" | "ingredient" | "challenge" | "medal";

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  fullname: string;
  gender: boolean;
  birth_date: string;
  avatar_url: string;
  created_at: string;
  deactivated_at: string | null;
  isVerified: boolean;
}

export interface Post {
  id: string;
  content: string;
  attach_type: AttachType;
  is_approved: boolean;
  created_at: string;
  deleted_at: string | null;
  user: User | null;
}
