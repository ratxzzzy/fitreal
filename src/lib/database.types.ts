export type NotificationWindow = "morning" | "afternoon" | "random";

export type FriendshipStatus = "pending" | "accepted";

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  notification_window: NotificationWindow;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  timezone: string;
  current_streak: number;
  best_streak: number;
  last_entry_date: string | null;
  streak_freezes: number;
  deleted_at: string | null;
  onboarded_at: string | null;
  created_at: string;
};

export type WorkoutType =
  | "weights"
  | "cardio"
  | "mobility"
  | "calisthenics"
  | "sport"
  | "rest";

export const WORKOUT_TYPES: { value: WorkoutType; label: string; emoji: string }[] = [
  { value: "weights", label: "Pesas", emoji: "💪" },
  { value: "cardio", label: "Cardio", emoji: "🏃" },
  { value: "calisthenics", label: "Calistenia", emoji: "🤸" },
  { value: "sport", label: "Deporte", emoji: "🥊" },
  { value: "mobility", label: "Movilidad", emoji: "🧘" },
  { value: "rest", label: "Descanso", emoji: "😌" },
];

export type DailyEntry = {
  id: string;
  user_id: string;
  photo_url: string;
  captured_at: string;
  date: string;
  gps_lat: number | null;
  gps_lng: number | null;
  workout_type: WorkoutType | null;
  caption: string | null;
};

export type Friendship = {
  user_id_a: string;
  user_id_b: string;
  status: FriendshipStatus;
  created_at: string;
};

export type Reaction = {
  id: string;
  entry_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
};
