import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { colors, radius, spacing } from "../../theme";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type Props = {
  onPress: () => void;
  title: string;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({
  onPress,
  title,
  variant = "primary",
  loading,
  disabled,
  style,
}: Props) {
  const bg = {
    primary: colors.accent,
    secondary: colors.surfaceElevated,
    ghost: "transparent",
    danger: colors.surfaceElevated,
  }[variant];
  const fg = {
    primary: colors.white,
    secondary: colors.white,
    ghost: colors.textMuted,
    danger: colors.danger,
  }[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        { backgroundColor: bg, opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[styles.text, { color: fg }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
});
