export type Difficulty = "easy" | "medium" | "hard";

export interface ActivityRecord {
  id: string;
  // Add other activity record fields as needed
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
