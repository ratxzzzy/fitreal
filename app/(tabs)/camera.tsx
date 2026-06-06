import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { decode } from "base64-arraybuffer";
import { useAuth } from "../../src/contexts/AuthContext";
import { useProfile } from "../../src/contexts/ProfileContext";
import { supabase } from "../../src/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ScreenContainer, SuccessAnimation } from "../../src/components/ui";
import {
  WORKOUT_TYPES,
  WorkoutType,
} from "../../src/lib/database.types";
import { colors, radius, spacing, typography } from "../../src/theme";
import { todayISO } from "../../src/utils/date";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">("front");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [todayDone, setTodayDone] = useState(false);
  const [workoutType, setWorkoutType] = useState<WorkoutType>("weights");
  const [checkingToday, setCheckingToday] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { user } = useAuth();
  const { profile, refresh: refreshProfile } = useProfile();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("daily_entries")
      .select("id")
      .eq("user_id", user.id)
      .eq("date", todayISO())
      .maybeSingle()
      .then(({ data }) => {
        if (data) setTodayDone(true);
        setCheckingToday(false);
      });
  }, [user]);

  if (!permission || checkingToday) {
    return <ScreenContainer />;
  }

  if (!permission.granted) {
    return (
      <ScreenContainer>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionEmoji}>📷</Text>
          <Text style={styles.permissionTitle}>Necesitamos tu camara</Text>
          <Text style={styles.permissionText}>
            FitReal usa la camara para hacer la foto diaria de tu entrenamiento.
            Sin galeria, sin filtros, solo tu esfuerzo real.
          </Text>
          <Button title="Permitir camara" onPress={requestPermission} />
        </View>
      </ScreenContainer>
    );
  }

  if (todayDone) {
    return (
      <ScreenContainer>
        <View style={styles.doneContainer}>
          <Text style={styles.doneEmoji}>✅</Text>
          <Text style={styles.doneTitle}>Hecho por hoy!</Text>
          <Text style={styles.doneText}>
            Ya has subido tu foto de hoy. Vuelve manana para seguir sumando dias
            a tu racha.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const result = await cameraRef.current.takePictureAsync({
      quality: 0.7,
      base64: true,
    });
    if (result) {
      setPhoto(result.uri);
      setPhotoBase64(result.base64 ?? null);
    }
  };

  const uploadPhoto = async () => {
    if (!photo || !photoBase64 || !user) return;
    setUploading(true);

    try {
      let gpsLat: number | null = null;
      let gpsLng: number | null = null;

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({});
          gpsLat = location.coords.latitude;
          gpsLng = location.coords.longitude;
        }
      } catch {
        // Location is optional
      }

      const today = todayISO();
      const arrayBuffer = decode(photoBase64);

      const filePath = `${user.id}/${today}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("daily-photos")
        .upload(filePath, arrayBuffer, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("daily-photos").getPublicUrl(filePath);

      const { error: entryError } = await supabase
        .from("daily_entries")
        .insert({
          user_id: user.id,
          photo_url: `${publicUrl}?v=${Date.now()}`,
          date: today,
          gps_lat: gpsLat,
          gps_lng: gpsLng,
          workout_type: workoutType,
        });

      if (entryError) {
        if (entryError.code === "23505") {
          Alert.alert("Ya subiste", "Ya has subido tu foto de hoy!");
          setTodayDone(true);
          return;
        }
        throw entryError;
      }

      await refreshProfile();
      setShowSuccess(true);
    } catch (error: any) {
      Alert.alert("Error", error.message ?? "No se pudo subir la foto");
    } finally {
      setUploading(false);
    }
  };

  if (photo) {
    return (
      <ScreenContainer>
        <SuccessAnimation
          visible={showSuccess}
          streak={(profile?.current_streak ?? 0) + 1}
          onFinish={() => setTodayDone(true)}
        />
        <ScrollView contentContainerStyle={styles.previewWrap}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.workoutTypes}>
            <Text style={styles.workoutTitle}>Tipo de entreno</Text>
            <View style={styles.workoutGrid}>
              {WORKOUT_TYPES.map((wt) => (
                <TouchableOpacity
                  key={wt.value}
                  style={[
                    styles.workoutChip,
                    workoutType === wt.value && styles.workoutChipActive,
                  ]}
                  onPress={() => setWorkoutType(wt.value)}
                >
                  <Text style={styles.workoutEmoji}>{wt.emoji}</Text>
                  <Text
                    style={[
                      styles.workoutLabel,
                      workoutType === wt.value && styles.workoutLabelActive,
                    ]}
                  >
                    {wt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.previewButtons}>
            <Button
              title="Repetir"
              variant="secondary"
              onPress={() => {
                setPhoto(null);
                setPhotoBase64(null);
              }}
              style={{ flex: 1 }}
            />
            <Button
              title="Subir foto"
              onPress={uploadPhoto}
              loading={uploading}
              style={{ flex: 1 }}
            />
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <SafeAreaView style={styles.cameraOverlay}>
          <Text style={styles.cameraTitle}>Tu entreno de hoy</Text>
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={() =>
                setFacing((f) => (f === "front" ? "back" : "front"))
              }
            >
              <Text style={styles.flipText}>🔄</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
            <View style={styles.flipButton} />
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: spacing.lg,
  },
  cameraTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: spacing.md,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  captureButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.accent,
  },
  captureInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.white,
  },
  flipButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  flipText: {
    fontSize: 28,
  },
  previewWrap: {
    padding: spacing.md,
    gap: spacing.md,
  },
  preview: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  workoutTypes: {
    gap: spacing.sm,
  },
  workoutTitle: {
    ...typography.h2,
    color: colors.text,
  },
  workoutGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  workoutChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  workoutChipActive: {
    backgroundColor: colors.accentDim,
    borderColor: colors.accent,
  },
  workoutEmoji: {
    fontSize: 18,
  },
  workoutLabel: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  workoutLabelActive: {
    color: colors.accent,
    fontWeight: "700",
  },
  previewButtons: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.md,
  },
  permissionEmoji: {
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  permissionTitle: {
    color: colors.text,
    ...typography.title,
    textAlign: "center",
  },
  permissionText: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: "center",
    marginBottom: spacing.md,
    lineHeight: 24,
  },
  doneContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  doneEmoji: {
    fontSize: 80,
    marginBottom: spacing.md,
  },
  doneTitle: {
    color: colors.text,
    ...typography.title,
    marginBottom: spacing.sm,
  },
  doneText: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});
