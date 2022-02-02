import { useEffect } from "react";
import { FontAwesome5 as FontAwesome } from "@expo/vector-icons";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import * as React from "react";
import { Pressable } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "styled-components";
import Layout from "../constants/Layout";
import { useAppDispatch } from "../hooks/redux";
import { fetchRealmTokens, fetchRealms } from "../store/realmSlice";

import ActivityScreen from "../screens/ActivityScreen";
import DashboardScreen from "../screens/DashboardScreen";
import VaultScreen from "../screens/VaultScreen";
import MembersScreen from "../screens/MembersScreen";
import ProposalsScreen from "../screens/ProposalsScreen";

import LinkingConfiguration from "./LinkingConfiguration";

const Tab = createBottomTabNavigator();

export default function Navigation({}: {}) {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // dispatch(fetchRealms());
    // dispatch(fetchRealmTokens());
  }, []);

  const NavigationTheme = {
    dark: false,
    colors: {
      primary: theme?.gray[400],
      background: theme?.gray[900],
      card: theme?.gray[900],
      text: theme?.gray[200],
      border: theme?.gray[900],
      notification: theme?.primary[700],
    },
  };

  return (
    <NavigationContainer linking={LinkingConfiguration} theme={NavigationTheme}>
      <Tab.Navigator initialRouteName="Dashboard">
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Activity" component={ActivityScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
// const Stack = createNativeStackNavigator<RootStackParamList>();

// function RootNavigator() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="Root"
//         component={BottomTabNavigator}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="NotFound"
//         component={NotFoundScreen}
//         options={{ title: "Oops!" }}
//       />
//       <Stack.Group screenOptions={{ presentation: "modal" }}>
//         <Stack.Screen name="Modal" component={ModalScreen} />
//       </Stack.Group>
//     </Stack.Navigator>
//   );
// }

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
