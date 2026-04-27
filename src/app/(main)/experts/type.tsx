export type ExpertStatus = "pending" | "approved" | "rejected";

export interface Expert {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
  specialization: string;
  experience_years: number;
  certificates_count?: number;
  status: ExpertStatus;
  application_date: string;
  reviewed_at?: string | null;
  reviewer_id?: string | null;
  rejection_reason?: string | null;
  bio?: string;
  qualifications?: string[];
  phone?: string;
  created_at: string;
  updated_at?: string;
}
