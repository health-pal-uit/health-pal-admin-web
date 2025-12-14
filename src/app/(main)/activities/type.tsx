export interface Activity {
  id: string;
  name: string;
  met_value: number;
  categories: string[];
  created_at: string;
  deleted_at: string | null;
}
