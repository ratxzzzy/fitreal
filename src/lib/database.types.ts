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
  created_at: string;
};

export type DailyEntry = {
  id: string;
  user_id: string;
  photo_url: string;
  captured_at: string;
  date: string;
  gps_lat: number | null;
  gps_lng: number | null;
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
