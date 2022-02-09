import { DefaultTheme } from "styled-components/native";

declare module "styled-components" {
  export interface DefaultTheme {
    primary: Color;
    secondary: Color;
    gray: Color;
    success: Color;
    error: Color;
    warning: Color;
    purple: Color;
    aqua: Color;
    blue: Color;
    spacing: {
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
      6: string;
    };
  }
}

interface Color {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  1000?: string;
}
