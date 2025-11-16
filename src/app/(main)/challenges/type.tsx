export type ChallengeStatus = "active" | "upcoming";

export type Challenge = {
  id: number;
  title: string;
  description: string;
  duration: string;
  participants: number;
  status: ChallengeStatus;
  startDate: string;
  endDate: string;
};

export const statusColors: Record<ChallengeStatus, string> = {
  active: "badge-primary",
  upcoming: "badge-ghost",
};
