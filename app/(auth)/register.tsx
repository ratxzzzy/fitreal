import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { Button, Input } from "../../src/components/ui";
import { colors, spacing, typography } from "../../src/theme";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    setError(null);
    if (!username || !email || !password) {
      setError("Rellena todos los campos");
      return;
    }
    if (password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres");
      return;
    }
    if (!/^[a-z0-9_]{3,20}$/i.test(username.trim())) {
      setError("Usuario: 3-20 caracteres, solo letras, numeros y guion bajo");
      return;
    }
    setLoading(true);
    try {
      await signUp(email.trim().toLowerCase(), password, username.trim());
      Alert.alert("Cuenta creada", "Bienvenido a FitReal", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e: any) {
      setError(e.message ?? "No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>FitReal</Text>
        <Text style={styles.subtitle}>Unete al reto diario</Text>
      </View>

      <View style={styles.form}>
        <Input
          placeholder="Nombre de usuario"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoComplete="username"
        />
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <Input
          placeholder="Contrasena (min. 6 caracteres)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password-new"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          title="Crear cuenta"
          onPress={handleRegister}
          loading={loading}
        />
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.linkText}>
            Ya tienes cuenta?{" "}
            <Text style={styles.linkBold}>Inicia sesion</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    padding: spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  logo: {
    ...typography.display,
    color: colors.accent,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  form: {
    gap: spacing.md,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    textAlign: "center",
  },
  linkText: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.md,
    fontSize: 15,
  },
  linkBold: {
    color: colors.accent,
    fontWeight: "700",
  },
});
