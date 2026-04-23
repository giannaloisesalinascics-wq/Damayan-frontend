export const theme = {
  // Backgrounds
  bg: "#f5f7f5",
  surface: "#ffffff",
  surfaceSoft: "#f5f7f5",
  surfaceAlt: "#eef1ed",
  sidebar: "#f5f7f5",
  
  // Text
  text: "#1a1c19",
  textMuted: "#40493d",
  textLight: "#707a6c",
  
  // Borders & dividers
  line: "rgba(112, 122, 108, 0.15)",
  
  // Brand colors
  primary: "#2e7d32",
  primaryDeep: "#1b5e20",
  primaryLight: "#e8f5e9",
  tertiary: "#81c784",
  
  secondary: "#ffb300",
  secondaryLight: "#fff8e1",
  
  danger: "#ba1a1a",
  dangerLight: "#ffdad6",
  
  warning: "#f59e0b",
  warningLight: "#fef3c7",
  
  info: "#0061a4",
  infoLight: "#d1e4ff",
  
  success: "#2e7d32",
  successLight: "#e8f5e9",
  successSoft: "#e8f5e9",
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
