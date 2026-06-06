import { View, Text, StyleSheet } from "react-native";
import { colors, radius, spacing } from "../../theme";

type Props = {
  streak: number;
  size?: "sm" | "md" | "lg";
};

export function StreakBadge({ streak, size = "md" }: Props) {
  const padding = size === "lg" ? spacing.md : size === "md" ? spacing.sm : 4;
  const fontSize = size === "lg" ? 24 : size === "md" ? 16 : 12;

  return (
    <View
      style={[
        styles.base,
        { paddingHorizontal: padding + 4, paddingVertical: padding / 2 },
      ]}
    >
      <Text style={[styles.emoji, { fontSize }]}>🔥</Text>
      <Text style={[styles.count, { fontSize }]}>{streak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.accentDim,
    borderRadius: radius.full,
  },
  emoji: {
    lineHeight: undefined,
  },
  count: {
    color: colors.accent,
    fontWeight: "800",
  },
});
