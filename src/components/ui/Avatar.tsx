import { View, Text, Image, StyleSheet } from "react-native";
import { colors, radius } from "../../theme";

type Props = {
  username?: string | null;
  avatarUrl?: string | null;
  size?: number;
  streak?: number;
};

function ringColor(streak?: number) {
  if (!streak || streak < 7) return null;
  if (streak < 30) return "#CD7F32";
  if (streak < 100) return "#C0C0C0";
  if (streak < 365) return colors.gold;
  return colors.accent;
}

export function Avatar({ username, avatarUrl, size = 64, streak }: Props) {
  const initial = (username ?? "?").charAt(0).toUpperCase();
  const ring = ringColor(streak);
  const inner = size - (ring ? 6 : 0);

  return (
    <View
      style={[
        styles.outer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: ring ? 3 : 0,
          borderColor: ring ?? "transparent",
        },
      ]}
    >
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={{ width: inner, height: inner, borderRadius: inner / 2 }}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            { width: inner, height: inner, borderRadius: inner / 2 },
          ]}
        >
          <Text style={[styles.initial, { fontSize: inner * 0.45 }]}>
            {initial}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: "center",
    justifyContent: "center",
  },
  fallback: {
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  initial: {
    color: colors.white,
    fontWeight: "900",
  },
});
