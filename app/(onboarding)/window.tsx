import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Button, ScreenContainer } from "../../src/components/ui";
import { useProfile } from "../../src/contexts/ProfileContext";
import { colors, radius, spacing, typography } from "../../src/theme";
import { NotificationWindow } from "../../src/lib/database.types";
import { getDeviceTimezone } from "../../src/utils/date";

const WINDOWS: { value: NotificationWindow; label: string; emoji: string; desc: string }[] = [
  { value: "morning", label: "Manana", emoji: "🌅", desc: "Entre 7h y 11h" },
  { value: "afternoon", label: "Tarde", emoji: "🌆", desc: "Entre 17h y 21h" },
  { value: "random", label: "Aleatoria", emoji: "🎲", desc: "Te sorprendemos" },
];

export default function WindowStep() {
  const router = useRouter();
  const { updateProfile } = useProfile();
  const [selected, setSelected] = useState<NotificationWindow>("random");
  const [saving, setSaving] = useState(false);

  const next = async () => {
    setSaving(true);
    try {
      await updateProfile({
        notification_window: selected,
        timezone: getDeviceTimezone(),
      });
      router.push("/(onboarding)/permissions");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Cuando entrenas?</Text>
          <Text style={styles.subtitle}>
            Te enviaremos una notificacion en esa ventana para subir tu foto.
          </Text>
        </View>

        <View style={styles.options}>
          {WINDOWS.map((w) => (
            <TouchableOpacity
              key={w.value}
              style={[
                styles.option,
                selected === w.value && styles.selected,
              ]}
              onPress={() => setSelected(w.value)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{w.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{w.label}</Text>
                <Text style={styles.desc}>{w.desc}</Text>
              </View>
              {selected === w.value && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <Button title="Continuar" onPress={next} loading={saving} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "space-between",
    paddingTop: spacing.xxl,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  options: {
    gap: spacing.md,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentDim,
  },
  emoji: {
    fontSize: 32,
  },
  label: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
  desc: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  check: {
    color: colors.accent,
    fontSize: 22,
    fontWeight: "900",
  },
});
