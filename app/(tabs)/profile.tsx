import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
  Share,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { useProfile } from "../../src/contexts/ProfileContext";
import { supabase } from "../../src/lib/supabase";
import {
  Avatar,
  Badge,
  Button,
  Input,
  ScreenContainer,
  StreakBadge,
} from "../../src/components/ui";
import { ActivityCalendar } from "../../src/components/profile/ActivityCalendar";
import { colors, radius, spacing, typography } from "../../src/theme";

type Friend = {
  id: string;
  username: string;
  current_streak: number;
};

type PendingRequest = {
  user_id_a: string;
  username: string;
};

export default function ProfileScreen() {
  const { user } = useAuth();
  const { profile, refresh: refreshProfile } = useProfile();
  const router = useRouter();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [pending, setPending] = useState<PendingRequest[]>([]);
  const [friendSearch, setFriendSearch] = useState("");
  const [addingFriend, setAddingFriend] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activityDates, setActivityDates] = useState<{ date: string }[]>([]);

  const loadSocial = useCallback(async () => {
    if (!user) return;

    const since = new Date();
    since.setDate(since.getDate() - 140);
    const { data: activity } = await supabase
      .from("daily_entries")
      .select("date")
      .eq("user_id", user.id)
      .gte("date", since.toISOString().split("T")[0]);
    setActivityDates(activity ?? []);

    const { data: friendships } = await supabase
      .from("friendships")
      .select("user_id_a, user_id_b")
      .or(`user_id_a.eq.${user.id},user_id_b.eq.${user.id}`)
      .eq("status", "accepted");

    const friendIds = (friendships ?? []).map((f) =>
      f.user_id_a === user.id ? f.user_id_b : f.user_id_a
    );

    if (friendIds.length > 0) {
      const { data: friendUsers } = await supabase
        .from("users")
        .select("id, username, current_streak")
        .in("id", friendIds);
      setFriends((friendUsers as Friend[]) ?? []);
    } else {
      setFriends([]);
    }

    const { data: pendingRequests } = await supabase
      .from("friendships")
      .select("user_id_a")
      .eq("user_id_b", user.id)
      .eq("status", "pending");

    if (pendingRequests && pendingRequests.length > 0) {
      const { data: pendingUsers } = await supabase
        .from("users")
        .select("id, username")
        .in(
          "id",
          pendingRequests.map((p) => p.user_id_a)
        );
      setPending(
        (pendingUsers ?? []).map((u) => ({
          user_id_a: u.id,
          username: u.username,
        }))
      );
    } else {
      setPending([]);
    }
  }, [user]);

  useEffect(() => {
    loadSocial();
  }, [loadSocial]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshProfile(), loadSocial()]);
    setRefreshing(false);
  }, [refreshProfile, loadSocial]);

  const addFriend = async () => {
    if (!user || !friendSearch.trim()) return;
    setAddingFriend(true);

    const { data: foundUser } = await supabase
      .from("users")
      .select("id")
      .ilike("username", friendSearch.trim())
      .maybeSingle();

    if (!foundUser) {
      Alert.alert("No encontrado", "No existe un usuario con ese nombre");
      setAddingFriend(false);
      return;
    }

    if (foundUser.id === user.id) {
      Alert.alert("Error", "No puedes anadirte a ti mismo");
      setAddingFriend(false);
      return;
    }

    const { error } = await supabase.from("friendships").insert({
      user_id_a: user.id,
      user_id_b: foundUser.id,
      status: "pending",
    });

    if (error) {
      if (error.code === "23505") {
        Alert.alert("Ya enviada", "Ya tienes una solicitud con este usuario");
      } else {
        Alert.alert("Error", error.message);
      }
    } else {
      Alert.alert("Enviada", "Solicitud de amistad enviada!");
      setFriendSearch("");
    }
    setAddingFriend(false);
  };

  const shareFitReal = async () => {
    await Share.share({
      message: `Unete a FitReal y entrena conmigo! Mi usuario es @${profile?.username}. Descarga la app y anademe como amigo 💪🔥`,
    });
  };

  const acceptFriend = async (friendUserId: string) => {
    if (!user) return;
    await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("user_id_a", friendUserId)
      .eq("user_id_b", user.id);
    loadSocial();
  };

  if (!profile) return <ScreenContainer />;

  return (
    <ScreenContainer>
      <View style={styles.topBar}>
        <View style={{ width: 32 }} />
        <Text style={styles.topTitle}>Perfil</Text>
        <TouchableOpacity onPress={() => router.push("/settings")} hitSlop={12}>
          <Text style={styles.gear}>⚙</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
      >
        <View style={styles.profileHeader}>
          <Avatar
            username={profile.username}
            avatarUrl={profile.avatar_url}
            streak={profile.current_streak}
            size={96}
          />
          <Text style={styles.username}>
            {profile.display_name ?? `@${profile.username}`}
          </Text>
          {profile.display_name && (
            <Text style={styles.handle}>@{profile.username}</Text>
          )}
          {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <View style={styles.streakWrap}>
                <Text style={styles.flame}>🔥</Text>
                <Text style={styles.statNumber}>{profile.current_streak}</Text>
              </View>
              <Text style={styles.statLabel}>racha actual</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{profile.best_streak}</Text>
              <Text style={styles.statLabel}>mejor racha</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{friends.length}</Text>
              <Text style={styles.statLabel}>amigos</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad</Text>
          <View style={styles.activityCard}>
            <ActivityCalendar entries={activityDates} weeks={20} />
          </View>
        </View>

        {pending.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Solicitudes pendientes</Text>
            {pending.map((p) => (
              <View key={p.user_id_a} style={styles.friendRow}>
                <View style={styles.friendInfo}>
                  <Avatar username={p.username} size={36} />
                  <Text style={styles.friendName}>@{p.username}</Text>
                </View>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => acceptFriend(p.user_id_a)}
                >
                  <Text style={styles.acceptText}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Anadir amigo</Text>
          <View style={styles.addFriendRow}>
            <View style={{ flex: 1 }}>
              <Input
                placeholder="Nombre de usuario"
                value={friendSearch}
                onChangeText={setFriendSearch}
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity
              style={[styles.addButton, addingFriend && styles.disabled]}
              onPress={addFriend}
              disabled={addingFriend}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.inviteButton} onPress={shareFitReal}>
            <Text style={styles.inviteEmoji}>📲</Text>
            <Text style={styles.inviteText}>Invitar amigos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Amigos</Text>
            {friends.length > 0 && <Badge text={`${friends.length}`} />}
          </View>
          {friends.length === 0 ? (
            <Text style={styles.empty}>
              Aun no tienes amigos. Anade alguno arriba!
            </Text>
          ) : (
            friends
              .sort((a, b) => b.current_streak - a.current_streak)
              .map((f) => (
                <View key={f.id} style={styles.friendRow}>
                  <View style={styles.friendInfo}>
                    <Avatar
                      username={f.username}
                      streak={f.current_streak}
                      size={40}
                    />
                    <Text style={styles.friendName}>@{f.username}</Text>
                  </View>
                  <StreakBadge streak={f.current_streak} size="sm" />
                </View>
              ))
          )}
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
  },
  topTitle: {
    ...typography.h2,
    color: colors.text,
  },
  gear: {
    fontSize: 24,
    color: colors.textMuted,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  profileHeader: {
    alignItems: "center",
    gap: spacing.sm,
  },
  username: {
    ...typography.h1,
    color: colors.text,
    marginTop: spacing.sm,
  },
  handle: {
    color: colors.textMuted,
    fontSize: 14,
  },
  bio: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    marginTop: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.xl,
    marginTop: spacing.md,
  },
  stat: {
    alignItems: "center",
    minWidth: 70,
  },
  streakWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  flame: {
    fontSize: 20,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.accent,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textDim,
    marginTop: 2,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
  },
  addFriendRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start",
  },
  addButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  addButtonText: {
    fontSize: 28,
    color: colors.white,
    fontWeight: "700",
  },
  friendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  friendName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  acceptButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  acceptText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
  inviteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  inviteEmoji: {
    fontSize: 20,
  },
  inviteText: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: "600",
  },
  empty: {
    color: colors.textDim,
    fontSize: 14,
    textAlign: "center",
    padding: spacing.lg,
  },
  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
});
