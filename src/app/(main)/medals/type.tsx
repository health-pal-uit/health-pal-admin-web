export type Tier = "bronze" | "silver" | "gold";

export interface Challenge {
  id: string;
  name: string;
  note: string | null;
  image_url: string | null;
  difficulty: "easy" | "medium" | "hard";
  created_at: string;
  deleted_at: string | null;
}

export interface ChallengeMedal {
  id: string;
  challenge: Challenge;
}

export interface Medal {
  id: string;
  name: string;
  image_url: string | { url: string } | null;
  tier: Tier;
  note: string | null;
  created_at: string;
  deleted_at: string | null;
  challenges_medals: ChallengeMedal[];
}

export const tierColors: Record<Tier, string> = {
  bronze: "bg-orange-100 text-orange-700",
  silver: "bg-gray-100 text-gray-700",
  gold: "bg-yellow-100 text-yellow-700",
};

export const tierLabels: Record<Tier, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
};
