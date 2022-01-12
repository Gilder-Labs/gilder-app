/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as React from "react";
import { Pressable } from "react-native";
import { useTheme } from "styled-components";

import ActivityScreen from "../screens/ActivityScreen";
import DashboardScreen from "../screens/DashboardScreen";
import VaultScreen from "../screens/VaultScreen";
import MembersScreen from "../screens/MembersScreen";
import ProposalsScreen from "../screens/ProposalsScreen";

import LinkingConfiguration from "./LinkingConfiguration";

const Drawer = createDrawerNavigator();

export default function Navigation({}: {}) {
  const theme = useTheme();

  const NavigationTheme = {
    dark: false,
    colors: {
      primary: theme.secondary[500],
      background: theme.gray[800],
      card: theme.gray[900],
      text: theme.gray[200],
      border: theme.gray[900],
      notification: theme.primary[700],
    },
  };

  return (
    <NavigationContainer linking={LinkingConfiguration} theme={NavigationTheme}>
      <Drawer.Navigator initialRouteName="Dashboard">
        <Drawer.Screen name="Dashboard" component={DashboardScreen} />
        <Drawer.Screen name="Vault" component={VaultScreen} />
        <Drawer.Screen name="Members" component={MembersScreen} />
        <Drawer.Screen name="Proposals" component={ProposalsScreen} />
        <Drawer.Screen name="Activity" component={ActivityScreen} />
      </Drawer.Navigator>
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
