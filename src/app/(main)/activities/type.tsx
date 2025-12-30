export enum ActivityType {
  CARDIO = "cardio",
  STRENGTH = "strength",
  FLEXIBILITY = "flexibility",
  BALANCE = "balance",
  SPORTS = "sports",
  HOUSEHOLD = "household",
  OCCUPATION = "occupation",
  OTHER = "other",
}

export const ActivityTypeLabels: Record<ActivityType, string> = {
  [ActivityType.CARDIO]: "Cardio",
  [ActivityType.STRENGTH]: "Strength",
  [ActivityType.FLEXIBILITY]: "Flexibility",
  [ActivityType.BALANCE]: "Balance",
  [ActivityType.SPORTS]: "Sports",
  [ActivityType.HOUSEHOLD]: "Household",
  [ActivityType.OCCUPATION]: "Occupation",
  [ActivityType.OTHER]: "Other",
};

export interface Activity {
  id: string;
  name: string;
  met_value: number;
  categories: string[];
  created_at: string;
  deleted_at: string | null;
}
