import { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { useAuth } from "../../src/contexts/AuthContext";
import { supabase } from "../../src/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">("front");
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [todayDone, setTodayDone] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { user } = useAuth();

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Necesitamos tu camara</Text>
          <Text style={styles.permissionText}>
            FitReal usa la camara para hacer la foto diaria de tu entrenamiento.
            Sin galeria, sin filtros, solo tu esfuerzo real.
          </Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Permitir camara</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (todayDone) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.doneContainer}>
          <Text style={styles.doneEmoji}>&#x2705;</Text>
          <Text style={styles.doneTitle}>Hecho por hoy!</Text>
          <Text style={styles.doneText}>
            Ya has subido tu foto de hoy. Vuelve manana para seguir sumando
            dias.
          </Text>
        </View>
      </SafeAreaView>
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
    }
  };

  const uploadPhoto = async () => {
    if (!photo || !user) return;
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

      const today = new Date().toISOString().split("T")[0];

      const response = await fetch(photo);
      const blob = await response.blob();

      const filePath = `${user.id}/${today}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("daily-photos")
        .upload(filePath, blob, {
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
          photo_url: publicUrl,
          date: today,
          gps_lat: gpsLat,
          gps_lng: gpsLng,
        });

      if (entryError) {
        if (entryError.code === "23505") {
          Alert.alert("Ya subiste", "Ya has subido tu foto de hoy!");
          setTodayDone(true);
          return;
        }
        throw entryError;
      }

      setTodayDone(true);
      Alert.alert("Hecho!", "Tu foto de hoy se ha subido. Sigue asi!");
    } catch (error: any) {
      Alert.alert("Error", error.message ?? "No se pudo subir la foto");
    } finally {
      setUploading(false);
    }
  };

  if (photo) {
    return (
      <SafeAreaView style={styles.container}>
        <Image source={{ uri: photo }} style={styles.preview} />
        <View style={styles.previewButtons}>
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => setPhoto(null)}
          >
            <Text style={styles.buttonText}>Repetir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, uploading && styles.buttonDisabled]}
            onPress={uploadPhoto}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Subir foto</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
              <Text style={styles.flipText}>&#x1F504;</Text>
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
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
  },
  cameraTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 16,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#fff",
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
  preview: {
    flex: 1,
  },
  previewButtons: {
    flexDirection: "row",
    gap: 16,
    padding: 24,
    paddingBottom: 40,
  },
  retakeButton: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  button: {
    flex: 1,
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  permissionTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  permissionText: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  doneContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  doneEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  doneTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },
  doneText: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});
