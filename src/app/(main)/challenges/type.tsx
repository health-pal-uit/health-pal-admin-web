export type Difficulty = "easy" | "medium" | "hard";

export interface Activity {
  id: string;
  name: string;
  met_value: number;
  categories: string[];
  deleted_at?: string | null;
}

export interface ActivityRecord {
  id: string;
  duration_minutes: number;
  kcal_burned: number | null;
  rhr: number | null;
  ahr: number | null;
  user_owned: boolean;
  type: string;
  intensity_level: string | null;
  created_at: string;
  deleted_at: string | null;
  activity?: Activity;
}

export interface Challenge {
  id: string;
  name: string;
  note: string | null;
  image_url: string | { url: string } | null;
  difficulty: Difficulty;
  created_at: string;
  deleted_at: string | null;
  activity_records: ActivityRecord[];
}

export const difficultyColors: Record<Difficulty, string> = {
  easy: "badge-success",
  medium: "badge-warning",
  hard: "badge-error",
};

export const difficultyLabels: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};
