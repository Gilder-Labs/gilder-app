import "react-native-url-polyfill/auto";
import "react-native-get-random-values";
import "react-native-gesture-handler";
import "./global";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./utils/styled-components";
import { darkTheme } from "./constants/Theme";
import { store } from "./store";
import { Provider } from "react-redux";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";

// For flipper
// import { connectToDevTools } from "react-devtools-core";
// if (__DEV__) {
//   connectToDevTools({
//     host: "localhost",
//     port: 8097,
//   });
// }

export default function App() {
  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Provider store={store}>
          <ThemeProvider theme={darkTheme}>
            <StatusBar style="light" />
            <Navigation />
          </ThemeProvider>
        </Provider>
      </SafeAreaProvider>
    );
  }
}
