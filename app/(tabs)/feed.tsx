import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";
import { supabase } from "../../src/lib/supabase";
import {
  Avatar,
  ScreenContainer,
  StreakBadge,
} from "../../src/components/ui";
import { colors, radius, spacing, typography } from "../../src/theme";
import { formatRelativeDate, formatTime } from "../../src/utils/date";

type FeedEntry = {
  id: string;
  photo_url: string;
  date: string;
  captured_at: string;
  user_id: string;
  username: string;
  current_streak: number;
  reactions: { emoji: string; count: number; mine: boolean }[];
};

const REACTION_EMOJIS = ["💪", "🔥", "🏆", "👏", "⚡"];

export default function FeedScreen() {
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchFeed = useCallback(async () => {
    if (!user) return;

    const { data: friendships } = await supabase
      .from("friendships")
      .select("user_id_a, user_id_b")
      .or(`user_id_a.eq.${user.id},user_id_b.eq.${user.id}`)
      .eq("status", "accepted");

    const friendIds = (friendships ?? []).map((f) =>
      f.user_id_a === user.id ? f.user_id_b : f.user_id_a
    );
    friendIds.push(user.id);

    const { data: rawEntries } = await supabase
      .from("daily_entries")
      .select("id, photo_url, date, captured_at, user_id")
      .in("user_id", friendIds)
      .order("captured_at", { ascending: false })
      .limit(50);

    if (!rawEntries) {
      setEntries([]);
      setLoading(false);
      return;
    }

    const userIds = [...new Set(rawEntries.map((e) => e.user_id))];
    const { data: users } = await supabase
      .from("users")
      .select("id, username, current_streak")
      .in("id", userIds);

    const userMap = new Map(
      (users ?? []).map((u) => [u.id, u as { id: string; username: string; current_streak: number }])
    );

    const entryIds = rawEntries.map((e) => e.id);
    const { data: reactions } = await supabase
      .from("reactions")
      .select("entry_id, emoji, user_id")
      .in("entry_id", entryIds);

    const reactionMap = new Map<
      string,
      Map<string, { count: number; mine: boolean }>
    >();
    (reactions ?? []).forEach((r) => {
      if (!reactionMap.has(r.entry_id)) reactionMap.set(r.entry_id, new Map());
      const emojiMap = reactionMap.get(r.entry_id)!;
      const prev = emojiMap.get(r.emoji) ?? { count: 0, mine: false };
      emojiMap.set(r.emoji, {
        count: prev.count + 1,
        mine: prev.mine || r.user_id === user.id,
      });
    });

    const feed: FeedEntry[] = rawEntries.map((e) => {
      const u = userMap.get(e.user_id);
      return {
        ...e,
        username: u?.username ?? "???",
        current_streak: u?.current_streak ?? 0,
        reactions: Array.from(reactionMap.get(e.id)?.entries() ?? []).map(
          ([emoji, info]) => ({ emoji, ...info })
        ),
      };
    });

    setEntries(feed);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFeed();
    setRefreshing(false);
  };

  const toggleReaction = async (entryId: string, emoji: string, mine: boolean) => {
    if (!user) return;
    if (mine) {
      await supabase
        .from("reactions")
        .delete()
        .eq("entry_id", entryId)
        .eq("user_id", user.id)
        .eq("emoji", emoji);
    } else {
      await supabase.from("reactions").insert({
        entry_id: entryId,
        user_id: user.id,
        emoji,
      });
    }
    fetchFeed();
  };

  const renderEntry = ({ item }: { item: FeedEntry }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Avatar
            username={item.username}
            streak={item.current_streak}
            size={40}
          />
          <View>
            <Text style={styles.username}>@{item.username}</Text>
            <Text style={styles.date}>
              {formatRelativeDate(item.date)} · {formatTime(item.captured_at)}
            </Text>
          </View>
        </View>
        <StreakBadge streak={item.current_streak} size="md" />
      </View>
      <Image source={{ uri: item.photo_url }} style={styles.photo} />
      <View style={styles.cardFooter}>
        <View style={styles.reactions}>
          {REACTION_EMOJIS.map((emoji) => {
            const existing = item.reactions.find((r) => r.emoji === emoji);
            return (
              <TouchableOpacity
                key={emoji}
                style={[
                  styles.reactionButton,
                  existing?.mine && styles.reactionMine,
                ]}
                onPress={() =>
                  toggleReaction(item.id, emoji, !!existing?.mine)
                }
              >
                <Text style={styles.reactionEmoji}>{emoji}</Text>
                {existing ? (
                  <Text style={styles.reactionCount}>{existing.count}</Text>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <Text style={styles.headerTitle}>FitReal</Text>
      <FlatList
        data={entries}
        renderItem={renderEntry}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
        ListEmptyComponent={
          loading ? null : (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🏋️</Text>
              <Text style={styles.emptyTitle}>Tu feed esta vacio</Text>
              <Text style={styles.emptyText}>
                Haz tu primera foto o anade amigos para ver su actividad.
              </Text>
            </View>
          )
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.accent,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    letterSpacing: -1,
  },
  list: {
    padding: spacing.md,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  username: {
    color: colors.text,
    ...typography.bodyBold,
  },
  date: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  photo: {
    width: "100%",
    aspectRatio: 3 / 4,
    backgroundColor: colors.surfaceElevated,
  },
  cardFooter: {
    padding: spacing.md,
  },
  reactions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  reactionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
  reactionMine: {
    backgroundColor: colors.accentDim,
    borderColor: colors.accent,
  },
  reactionEmoji: {
    fontSize: 16,
  },
  reactionCount: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  empty: {
    alignItems: "center",
    padding: spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: colors.text,
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  emptyText: {
    color: colors.textDim,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});
