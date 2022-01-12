import "react-native-url-polyfill/auto";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "styled-components/native";
import { darkTheme } from "./constants/Theme";
import { store } from "./store";
import { Provider } from "react-redux";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Provider store={store}>
          <ThemeProvider theme={darkTheme}>
            <Navigation />
            <StatusBar />
          </ThemeProvider>
        </Provider>
      </SafeAreaProvider>
    );
  }
}
