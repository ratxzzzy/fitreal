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
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/contexts/AuthContext";
import { supabase } from "../../src/lib/supabase";

type FeedEntry = {
  id: string;
  photo_url: string;
  date: string;
  captured_at: string;
  user_id: string;
  username: string;
  day_count: number;
  reactions: { emoji: string; count: number }[];
};

const REACTION_EMOJIS = ["\u{1F4AA}", "\u{1F525}", "\u{1F3C6}", "\u{1F44F}", "\u{26A1}"];

export default function FeedScreen() {
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
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

    if (!rawEntries) return;

    const userIds = [...new Set(rawEntries.map((e) => e.user_id))];
    const { data: users } = await supabase
      .from("users")
      .select("id, username")
      .in("id", userIds);

    const userMap = new Map((users ?? []).map((u) => [u.id, u.username]));

    const entryIds = rawEntries.map((e) => e.id);
    const { data: reactions } = await supabase
      .from("reactions")
      .select("entry_id, emoji")
      .in("entry_id", entryIds);

    const reactionMap = new Map<string, Map<string, number>>();
    (reactions ?? []).forEach((r) => {
      if (!reactionMap.has(r.entry_id)) reactionMap.set(r.entry_id, new Map());
      const emojiMap = reactionMap.get(r.entry_id)!;
      emojiMap.set(r.emoji, (emojiMap.get(r.emoji) ?? 0) + 1);
    });

    const year = new Date().getFullYear();
    const { data: counts } = await supabase
      .from("daily_entries")
      .select("user_id, date")
      .in("user_id", userIds)
      .gte("date", `${year}-01-01`);

    const countMap = new Map<string, number>();
    (counts ?? []).forEach((c) => {
      countMap.set(c.user_id, (countMap.get(c.user_id) ?? 0) + 1);
    });

    const feed: FeedEntry[] = rawEntries.map((e) => ({
      ...e,
      username: userMap.get(e.user_id) ?? "???",
      day_count: countMap.get(e.user_id) ?? 0,
      reactions: Array.from(reactionMap.get(e.id)?.entries() ?? []).map(
        ([emoji, count]) => ({ emoji, count })
      ),
    }));

    setEntries(feed);
  }, [user]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFeed();
    setRefreshing(false);
  };

  const addReaction = async (entryId: string, emoji: string) => {
    if (!user) return;
    await supabase.from("reactions").insert({
      entry_id: entryId,
      user_id: user.id,
      emoji,
    });
    fetchFeed();
  };

  const renderEntry = ({ item }: { item: FeedEntry }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.username}>@{item.username}</Text>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>{item.day_count} dias</Text>
        </View>
      </View>
      <Image source={{ uri: item.photo_url }} style={styles.photo} />
      <View style={styles.cardFooter}>
        <Text style={styles.date}>
          {new Date(item.captured_at).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        <View style={styles.reactions}>
          {REACTION_EMOJIS.map((emoji) => {
            const existing = item.reactions.find((r) => r.emoji === emoji);
            return (
              <TouchableOpacity
                key={emoji}
                style={[
                  styles.reactionButton,
                  existing && styles.reactionActive,
                ]}
                onPress={() => addReaction(item.id, emoji)}
              >
                <Text style={styles.reactionEmoji}>
                  {emoji}
                  {existing ? ` ${existing.count}` : ""}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
            tintColor="#FF6B35"
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>&#x1F3CB;&#xFE0F;</Text>
            <Text style={styles.emptyTitle}>Tu feed esta vacio</Text>
            <Text style={styles.emptyText}>
              Haz tu primera foto o anade amigos para ver su actividad.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FF6B35",
    padding: 16,
    paddingBottom: 8,
    letterSpacing: -1,
  },
  list: {
    padding: 16,
    gap: 20,
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 16,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
  },
  username: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  counterBadge: {
    backgroundColor: "#FF6B35",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  counterText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  photo: {
    width: "100%",
    aspectRatio: 3 / 4,
    backgroundColor: "#222",
  },
  cardFooter: {
    padding: 14,
    gap: 10,
  },
  date: {
    color: "#666",
    fontSize: 13,
  },
  reactions: {
    flexDirection: "row",
    gap: 8,
  },
  reactionButton: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  reactionActive: {
    backgroundColor: "#2a1a10",
    borderWidth: 1,
    borderColor: "#FF6B35",
  },
  reactionEmoji: {
    fontSize: 16,
  },
  empty: {
    alignItems: "center",
    padding: 48,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyText: {
    color: "#666",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});
