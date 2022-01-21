// styled-components.ts
import * as styledComponents from "styled-components/native";

// Temp till I figure this out a bit.
interface DefaultTheme {
  primary: Color;
  secondary: Color;
  gray: Color;
  success: Color;
  Error: Color;
  Spacing: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
  };
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
}

const {
  default: styled,
  css,
  ThemeProvider,
} = styledComponents as styledComponents.ReactNativeThemedStyledComponentsModule<DefaultTheme>;

export { css, ThemeProvider };
export default styled;
