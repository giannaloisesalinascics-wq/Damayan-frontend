export const theme = {
  // Backgrounds
  bg: "#f8f9f8",
  surface: "#ffffff",
  surfaceSoft: "#f5f7f5",
  surfaceAlt: "#eef1ed",
  sidebar: "#f8f8f6",
  
  // Text
  text: "#1a1d1b",
  textMuted: "#6b7469",
  textLight: "#9ca89f",
  
  // Borders & dividers
  line: "rgba(26, 29, 27, 0.08)",
  
  // Brand colors
  primary: "#1d7b3a",
  primaryDeep: "#165530",
  primaryLight: "#e8f5eb",
  
  secondary: "#ffc107",
  secondaryLight: "#fff9e6",
  
  danger: "#d32f2f",
  dangerLight: "#ffebee",
  
  warning: "#f57c00",
  warningLight: "#fff3e0",
  
  info: "#1976d2",
  infoLight: "#e3f2fd",
  
  success: "#388e3c",
  successLight: "#e8f5e9",
};

export const fonts = {
  regular: { fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif", fontWeight: "400" as const },
  medium: { fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif", fontWeight: "500" as const },
  semibold: { fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif", fontWeight: "600" as const },
  bold: { fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif", fontWeight: "700" as const },
  extrabold: { fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif", fontWeight: "800" as const },
  black: { fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif", fontWeight: "900" as const },
} as const;

export const roleColors = {
  admin: "#1976d2",
  dispatcher: "#f57c00",
  site_manager: "#1d7b3a",
  citizen: "#d32f2f"
} as const;
