import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Button, ScreenContainer } from "../../src/components/ui";
import { colors, spacing, typography } from "../../src/theme";

export default function Welcome() {
  const router = useRouter();
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.flame}>🔥</Text>
          <Text style={styles.title}>Bienvenido a FitReal</Text>
          <Text style={styles.subtitle}>
            Una foto al dia. Sin galeria. Sin filtros. Solo tu esfuerzo real.
          </Text>
        </View>

        <View style={styles.features}>
          <Feature emoji="📸" title="Foto diaria" desc="Solo la camara, sin trucos" />
          <Feature emoji="🔥" title="Tu racha" desc="Cada dia que entrenas suma" />
          <Feature emoji="👥" title="Tus amigos" desc="Os empujais a entrenar" />
        </View>

        <Button title="Empezar" onPress={() => router.push("/(onboarding)/window")} />
      </View>
    </ScreenContainer>
  );
}

function Feature({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <View style={styles.feature}>
      <Text style={styles.featureEmoji}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "space-between",
  },
  hero: {
    alignItems: "center",
    paddingTop: spacing.xxl,
    gap: spacing.md,
  },
  flame: {
    fontSize: 80,
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
    paddingHorizontal: spacing.md,
    lineHeight: 22,
  },
  features: {
    gap: spacing.lg,
    paddingVertical: spacing.xl,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  featureEmoji: {
    fontSize: 36,
    width: 48,
    textAlign: "center",
  },
  featureTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
  featureDesc: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
});
