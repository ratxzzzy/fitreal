import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "../src/contexts/AuthContext";
import { useProfile } from "../src/contexts/ProfileContext";
import { Button, Input, ScreenContainer } from "../src/components/ui";
import { colors, radius, spacing } from "../src/theme";
import { NotificationWindow } from "../src/lib/database.types";

const WINDOWS: { value: NotificationWindow; label: string; emoji: string }[] = [
  { value: "morning", label: "Manana (7-11h)", emoji: "🌅" },
  { value: "afternoon", label: "Tarde (17-21h)", emoji: "🌆" },
  { value: "random", label: "Aleatoria", emoji: "🎲" },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut, deleteAccount } = useAuth();
  const { profile, updateProfile, loading } = useProfile();

  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [window, setWindow] = useState<NotificationWindow>(
    profile?.notification_window ?? "random"
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await updateProfile({
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
        notification_window: window,
      });
      Alert.alert("Guardado", "Tus cambios se han guardado");
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  const confirmLogout = () =>
    Alert.alert("Cerrar sesion", "Seguro que quieres salir?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Salir", style: "destructive", onPress: signOut },
    ]);

  const confirmDelete = () =>
    Alert.alert(
      "Eliminar cuenta",
      "Esta accion no se puede deshacer. Perderas tu racha, fotos y amigos.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
            } catch (e: any) {
              Alert.alert("Error", e.message);
            }
          },
        },
      ]
    );

  if (loading || !profile) {
    return <ScreenContainer />;
  }

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backText}>‹ Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Ajustes</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Perfil</Text>
          <Input
            label="Nombre publico"
            placeholder={profile.username}
            value={displayName}
            onChangeText={setDisplayName}
            maxLength={30}
          />
          <Input
            label="Bio"
            placeholder="Cuenta algo de ti..."
            value={bio}
            onChangeText={setBio}
            multiline
            maxLength={140}
            style={styles.bioInput}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Ventana de notificacion</Text>
          {WINDOWS.map((w) => (
            <TouchableOpacity
              key={w.value}
              style={[
                styles.windowOption,
                window === w.value && styles.windowSelected,
              ]}
              onPress={() => setWindow(w.value)}
            >
              <Text style={styles.windowEmoji}>{w.emoji}</Text>
              <Text style={styles.windowLabel}>{w.label}</Text>
              {window === w.value && (
                <Text style={styles.windowCheck}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Button title="Guardar cambios" onPress={save} loading={saving} />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Cuenta</Text>
          <Button
            title="Cerrar sesion"
            variant="secondary"
            onPress={confirmLogout}
          />
          <Button
            title="Eliminar cuenta"
            variant="danger"
            onPress={confirmDelete}
          />
        </View>

        <Text style={styles.version}>FitReal v1.0.0</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: "600",
    width: 60,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    padding: spacing.lg,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  windowOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  windowSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentDim,
  },
  windowEmoji: {
    fontSize: 22,
  },
  windowLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  windowCheck: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "900",
  },
  version: {
    color: colors.textDim,
    fontSize: 12,
    textAlign: "center",
    marginTop: spacing.lg,
  },
});
