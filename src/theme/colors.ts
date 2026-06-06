export const colors = {
  bg: "#000000",
  surface: "#111111",
  surfaceElevated: "#1a1a1a",
  border: "#2a2a2a",
  accent: "#FF6B35",
  accentDim: "#FF6B3522",
  white: "#FFFFFF",
  text: "#FFFFFF",
  textMuted: "#999999",
  textDim: "#666666",
  danger: "#FF4444",
  success: "#22C55E",
  gold: "#FFB800",
  overlay: "rgba(0,0,0,0.6)",
} as const;

export type ColorName = keyof typeof colors;
