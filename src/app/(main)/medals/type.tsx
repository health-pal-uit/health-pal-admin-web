export type Tier = "Bronze" | "Silver" | "Gold";

export type Medal = {
  id: number;
  name: string;
  tier: Tier;
  description: string;
  icon: string;
};

export const tierColors: Record<Tier, string> = {
  Bronze: "bg-orange-100 text-orange-700",
  Silver: "bg-gray-100 text-gray-700",
  Gold: "bg-yellow-100 text-yellow-700",
};
