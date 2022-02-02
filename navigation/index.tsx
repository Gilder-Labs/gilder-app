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
    dispatch(fetchRealms());
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
      <Tab.Navigator initialRouteName="Activity">
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          }}
        />
        <Tab.Screen
          name="Vault"
          component={VaultScreen}
          options={{
            title: "Vault",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="university" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Proposals"
          component={ProposalsScreen}
          options={{
            title: "Proposals",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="vote-yea" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Members"
          component={MembersScreen}
          options={{
            title: "Members",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="users" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Activity"
          component={ActivityScreen}
          options={{
            title: "Activity",
            tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}
