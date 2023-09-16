import {MD3DarkTheme, useTheme } from "react-native-paper";

  export const darkTheme = {
    ...MD3DarkTheme,
    roundness: 20,
    colors: {
        ...MD3DarkTheme.colors,
        primary: "#9D44B5",
        primaryContainer: "#6D8EA0",
        secondary: "#71F79F",
        secondaryContainer: "#618294",
        tertiary: "#000000",
        tertiaryContainer: "#2980b9",
        surface: "#000000",
        surfaceVariant: "#1E1E1E",
        surfaceDisabled: "rgba(189, 195, 199, 0.5)",
        background: "#000000",
        error: "#FF6663",
        errorContainer: "#c0392b",
        onPrimary: "#ffffff",
        onPrimaryContainer: "#FF6663",
        onSecondary: "#ffffff",
        onSecondaryContainer: "#ffffff",
        onTertiary: "#ffffff",
        onTertiaryContainer: "#ffffff",
        onSurface: "#ffffff", // Text
        onSurfaceVariant: "#cccccc", // color of secondary text e.g like on the bottom navigation
        onSurfaceDisabled: "rgba(204, 204, 204, 0.5)",
        onError: "#ffffff",
        onErrorContainer: "#ffffff",
        onBackground: "#ffffff",
        outline: "#666666",
        outlineVariant: "#999999",
        inverseSurface: "#000000",
        inverseOnSurface: "#ffffff",
        inversePrimary: "#9D44B5",
        shadow: "rgba(0, 0, 0, 0.2)",
        scrim: "rgba(0, 0, 0, 0.5)",
        backdrop: "#000000",
        elevation: {
          level0: "#FF6663",
          level1: 'rgb(37, 35, 42)', // palette.primary80, alpha 0.05
          level2: 'rgb(44, 40, 49)', // palette.primary80, alpha 0.08
          level3: 'rgb(49, 44, 56)', // palette.primary80, alpha 0.11
          level4: 'rgb(51, 46, 58)', // palette.primary80, alpha 0.12
          level5: 'rgb(52, 49, 63)', // palette.primary80, alpha 0.14
          // level1: "rgba(157, 68, 181, 0.05)",
          // level2: "rgba(109, 142, 160, 0.08)",
          // level3: "rgba(255, 102, 99, 0.11)",
          // level4: "rgba(7, 30, 34, 0.12)",
          // level5: "rgba(113, 247, 159, 0.14)",
        },
      },
      animation: {
        scale: 1.0,
      },
      animationColors: {
        rippleColor: "rgba(113, 247, 159, 0.3)"
      },
      text :{
        textInputPlaceholder: "#808080"
      }
  }

  export type AppTheme = typeof darkTheme;

  export const useAppTheme = () => useTheme<AppTheme>();