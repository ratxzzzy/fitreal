import { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../../theme";

type Props = {
  visible: boolean;
  streak: number;
  onFinish?: () => void;
};

export function SuccessAnimation({ visible, streak, onFinish }: Props) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const streakScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    scale.setValue(0);
    opacity.setValue(0);
    streakScale.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(200),
      Animated.spring(streakScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => onFinish?.());
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <Animated.View style={[styles.content, { transform: [{ scale }] }]}>
        <Text style={styles.checkmark}>✅</Text>
        <Text style={styles.title}>Foto subida!</Text>
        <Text style={styles.subtitle}>Tu esfuerzo queda registrado</Text>
      </Animated.View>
      <Animated.View
        style={[styles.streakBox, { transform: [{ scale: streakScale }] }]}
      >
        <Text style={styles.flame}>🔥</Text>
        <Text style={styles.streakNumber}>{streak}</Text>
        <Text style={styles.streakLabel}>
          {streak === 1 ? "dia" : "dias"} de racha
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  content: {
    alignItems: "center",
    gap: spacing.sm,
  },
  checkmark: {
    fontSize: 72,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
  },
  streakBox: {
    marginTop: spacing.xl,
    alignItems: "center",
    backgroundColor: colors.accentDim,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  flame: {
    fontSize: 40,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: "900",
    color: colors.accent,
  },
  streakLabel: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
});
