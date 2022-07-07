import "react-native-url-polyfill/auto";
import "react-native-get-random-values";
import "react-native-gesture-handler";
import "text-encoding-polyfill";
import "./global";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./utils/styled-components";
import { darkTheme } from "./constants/Theme";
import { store } from "./store";
import { Provider } from "react-redux";
import { SplashScreen } from "./components";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import { LogBox } from "react-native";
import * as Sentry from "sentry-expo";
import { OverlayProvider } from "stream-chat-expo"; // Or stream-chat-expo
import { defaultTheme as ChatTheme } from "./constants/ChatTheme";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// If we are in prod we wanna catch bugs
Sentry.init({
  dsn: "https://ab84075ed2ab481c80a159488d0fdab8@o1171301.ingest.sentry.io/6265617",
  enableInExpoDevelopment: false,
  debug: process.env.NODE_ENV === "development" ? true : false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

LogBox.ignoreAllLogs();

// Appolo client for cyberconnect data
const client = new ApolloClient({
  uri: "https://api.cybertino.io/connect/",
  cache: new InMemoryCache(),
});

export default function App() {
  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) {
    return <SplashScreen />;
  } else {
    // TODO: purge store whenever there is a new version to make sure we don't have wonky data till release
    // persistor.purge();
    return (
      <SafeAreaProvider style={{ backgroundColor: "black" }}>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <ThemeProvider theme={darkTheme}>
              <OverlayProvider value={{ style: ChatTheme }}>
                <StatusBar style="light" />
                <Navigation />
              </OverlayProvider>
            </ThemeProvider>
          </ApolloProvider>
        </Provider>
      </SafeAreaProvider>
    );
  }
}
