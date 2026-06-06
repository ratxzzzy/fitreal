import { View, Text, StyleSheet } from "react-native";
import { colors, radius, spacing } from "../../theme";

type Props = {
  text: string;
  tone?: "default" | "accent" | "danger" | "success";
};

export function Badge({ text, tone = "default" }: Props) {
  const bg = {
    default: colors.surfaceElevated,
    accent: colors.accentDim,
    danger: "#FF444422",
    success: "#22C55E22",
  }[tone];
  const fg = {
    default: colors.textMuted,
    accent: colors.accent,
    danger: colors.danger,
    success: colors.success,
  }[tone];

  return (
    <View style={[styles.base, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: fg }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
  },
});
