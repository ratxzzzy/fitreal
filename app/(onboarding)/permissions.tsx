import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useCameraPermissions } from "expo-camera";
import { Button, ScreenContainer } from "../../src/components/ui";
import {
  requestNotificationPermission,
  scheduleDailyReminder,
} from "../../src/lib/notifications";
import { useProfile } from "../../src/contexts/ProfileContext";
import { colors, radius, spacing, typography } from "../../src/theme";

export default function PermissionsStep() {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();
  const [, requestCameraPerm] = useCameraPermissions();
  const [loading, setLoading] = useState(false);

  const next = async () => {
    setLoading(true);
    try {
      await requestCameraPerm();
      const notifOk = await requestNotificationPermission();
      if (notifOk && profile?.notification_window) {
        await scheduleDailyReminder(profile.notification_window);
      }
      await updateProfile({ onboarded_at: new Date().toISOString() });
      router.replace("/(tabs)/feed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Activa los permisos</Text>
          <Text style={styles.subtitle}>
            Necesitamos estos permisos para que FitReal funcione.
          </Text>
        </View>

        <View style={styles.list}>
          <PermissionItem
            emoji="📷"
            title="Camara"
            desc="Solo para tu foto diaria. No accedemos a tu galeria."
          />
          <PermissionItem
            emoji="🔔"
            title="Notificaciones"
            desc="Te recordamos subir tu foto y avisamos si tu racha esta en peligro."
          />
        </View>

        <Button title="Permitir y continuar" onPress={next} loading={loading} />
      </View>
    </ScreenContainer>
  );
}

function PermissionItem({
  emoji,
  title,
  desc,
}: {
  emoji: string;
  title: string;
  desc: string;
}) {
  return (
    <View style={styles.item}>
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDesc}>{desc}</Text>
      </View>
    </View>
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
  list: {
    gap: spacing.md,
  },
  item: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  emoji: {
    fontSize: 36,
  },
  itemTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  itemDesc: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
});
