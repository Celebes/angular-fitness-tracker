export interface Exercise {
  id: string;
  name: string;
  duration: number;
  calories: number;
  date?: Date;
  lastSelectedDate?: Date;
  state?: 'completed' | 'cancelled' | null;
}
