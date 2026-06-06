import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme";

type Props = {
  children?: ReactNode;
  safe?: boolean;
  style?: ViewStyle;
};

export function ScreenContainer({ children, safe = true, style }: Props) {
  if (safe) {
    return (
      <SafeAreaView style={[styles.base, style]} edges={["top"]}>
        {children}
      </SafeAreaView>
    );
  }
  return <View style={[styles.base, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
