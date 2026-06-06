import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/contexts/AuthContext";
import { supabase } from "../../src/lib/supabase";

type Friend = {
  id: string;
  username: string;
  day_count: number;
};

type PendingRequest = {
  user_id_a: string;
  username: string;
};

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [dayCount, setDayCount] = useState(0);
  const [username, setUsername] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pending, setPending] = useState<PendingRequest[]>([]);
  const [friendSearch, setFriendSearch] = useState("");
  const [addingFriend, setAddingFriend] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from("users")
      .select("username")
      .eq("id", user.id)
      .single();

    if (profile) setUsername(profile.username);

    const year = new Date().getFullYear();
    const { count } = await supabase
      .from("daily_entries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("date", `${year}-01-01`);

    setDayCount(count ?? 0);

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
        .select("id, username")
        .in("id", friendIds);

      const { data: friendCounts } = await supabase
        .from("daily_entries")
        .select("user_id, date")
        .in("user_id", friendIds)
        .gte("date", `${year}-01-01`);

      const countMap = new Map<string, number>();
      (friendCounts ?? []).forEach((c) => {
        countMap.set(c.user_id, (countMap.get(c.user_id) ?? 0) + 1);
      });

      setFriends(
        (friendUsers ?? []).map((u) => ({
          ...u,
          day_count: countMap.get(u.id) ?? 0,
        }))
      );
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
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const addFriend = async () => {
    if (!user || !friendSearch.trim()) return;
    setAddingFriend(true);

    const { data: foundUser } = await supabase
      .from("users")
      .select("id")
      .eq("username", friendSearch.trim().toLowerCase())
      .single();

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

  const acceptFriend = async (friendUserId: string) => {
    if (!user) return;
    await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("user_id_a", friendUserId)
      .eq("user_id_b", user.id);

    loadProfile();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {username.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.username}>@{username}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{dayCount}</Text>
              <Text style={styles.statLabel}>dias este ano</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{friends.length}</Text>
              <Text style={styles.statLabel}>amigos</Text>
            </View>
          </View>
        </View>

        {pending.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Solicitudes pendientes</Text>
            {pending.map((p) => (
              <View key={p.user_id_a} style={styles.friendRow}>
                <Text style={styles.friendName}>@{p.username}</Text>
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
            <TextInput
              style={styles.input}
              placeholder="Nombre de usuario"
              placeholderTextColor="#666"
              value={friendSearch}
              onChangeText={setFriendSearch}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.addButton, addingFriend && styles.buttonDisabled]}
              onPress={addFriend}
              disabled={addingFriend}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {friends.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amigos</Text>
            {friends
              .sort((a, b) => b.day_count - a.day_count)
              .map((f) => (
                <View key={f.id} style={styles.friendRow}>
                  <Text style={styles.friendName}>@{f.username}</Text>
                  <View style={styles.friendCounter}>
                    <Text style={styles.friendCounterText}>
                      {f.day_count} dias
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            Alert.alert("Cerrar sesion", "Seguro que quieres salir?", [
              { text: "Cancelar", style: "cancel" },
              { text: "Salir", style: "destructive", onPress: signOut },
            ]);
          }}
        >
          <Text style={styles.logoutText}>Cerrar sesion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    padding: 24,
    gap: 24,
  },
  profileHeader: {
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
  },
  username: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  statsRow: {
    flexDirection: "row",
    gap: 32,
    marginTop: 8,
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FF6B35",
  },
  statLabel: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  addFriendRow: {
    flexDirection: "row",
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#333",
  },
  addButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
  },
  friendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 14,
    borderRadius: 12,
  },
  friendName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  friendCounter: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  friendCounterText: {
    color: "#FF6B35",
    fontSize: 13,
    fontWeight: "700",
  },
  acceptButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  acceptText: {
    color: "#fff",
    fontWeight: "700",
  },
  logoutButton: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  logoutText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
  },
});
