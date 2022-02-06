import { useEffect } from "react";
import { FontAwesome5 as FontAwesome } from "@expo/vector-icons";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import * as React from "react";
import { Button, View, Text } from "react-native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DrawerContentContainer } from "../components/DrawerContentContainer";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { useTheme } from "styled-components";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchRealms,
  fetchRealmTokens,
  fetchRealm,
  fetchRealmActivity,
  fetchRealmMembers,
  fetchRealmProposals,
} from "../store/realmSlice";
import { SvgUri } from "react-native-svg";
import styled from "styled-components/native";

import ActivityScreen from "../screens/ActivityScreen";
import VaultScreen from "../screens/VaultScreen";
import MembersScreen from "../screens/MembersScreen";
import ProposalsScreen from "../screens/ProposalsScreen";

import LinkingConfiguration from "./LinkingConfiguration";
// import { setupWalletConnect } from "../utils";

// const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

export default function Navigation({}: {}) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { selectedRealm } = useAppSelector((state) => state.realms);

  useEffect(() => {
    dispatch(fetchRealms());
    // TODO: Replace this with modal popping up and letting user select a DAO on initial load
    // mango key: DPiH3H3c7t47BMxqTxLsuPQpEC6Kne8GA9VXbxpnZxFE
    // monkedao: 39aX7mDZ1VLpZcPWstBhQBoqwNkhf5f1KDACguvrryi6
    dispatch(fetchRealm("B1CxhV1khhj7n5mi5hebbivesqH9mvXr5Hfh2nD2UCh6"));
    // TODO: connect to solana wallet
    // setupWalletConnect();
  }, []);

  useEffect(() => {
    if (selectedRealm?.pubKey) {
      dispatch(fetchRealmTokens(selectedRealm));
      dispatch(fetchRealmActivity(selectedRealm));
      dispatch(fetchRealmProposals(selectedRealm));
      dispatch(fetchRealmMembers(selectedRealm));
    }
  }, [selectedRealm]);

  const NavigationTheme = {
    dark: false,
    colors: {
      primary: theme?.primary[500],
      background: theme?.gray[900],
      card: theme?.gray[900],
      text: theme?.gray[200],
      border: theme?.gray[900],
      notification: theme?.primary[700],
    },
  };

  return (
    <NavigationContainer linking={LinkingConfiguration} theme={NavigationTheme}>
      <Drawer.Navigator
        initialRouteName="Proposals" // Dashboard
        drawerContent={(props) => <DrawerContentContainer {...props} />}
        screenOptions={{
          drawerStyle: {
            width: 320,
          },
          headerTintColor: "#f4f4f5", //Set Header text color
          swipeEdgeWidth: 500, // Allows user to open drawer swiping left with on any part of screen
        }}
        // screenOptions={{
        //   drawerType: Layout.window.width >= 768 ? "permanent" : "front",
        // }}
      >
        {/* <Drawer.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesome
                size={32}
                style={{ marginRight: -10 }}
                color={color}
                name="home"
              />
            ),
          }}
        /> */}
        <Drawer.Screen
          name="Vault"
          component={VaultScreen}
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesome
                size={24}
                style={{ minWidth: 30 }}
                color={color}
                name="university"
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Members"
          component={MembersScreen}
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesome
                size={24}
                style={{ minWidth: 30 }}
                color={color}
                name="user-friends"
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Proposals"
          component={ProposalsScreen}
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesome
                size={24}
                style={{ minWidth: 30 }}
                color={color}
                name="vote-yea"
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Activity"
          component={ActivityScreen}
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesome
                size={24}
                style={{ minWidth: 30 }}
                color={color}
                name="list"
              />
            ),
          }}
        />
      </Drawer.Navigator>
      {/* <Tab.Navigator initialRouteName="Vault">
        <Tab.Screen
          name="Vault"
          component={VaultScreen}
          options={{
            title: `Vault`,
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="university" color={color} />
            ),
            headerLeft: () => <HeaderLeft realm={selectedRealm} />,
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
            headerLeft: () => <HeaderLeft realm={selectedRealm} />,
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
            headerLeft: () => <HeaderLeft realm={selectedRealm} />,
          }}
        />
        <Tab.Screen
          name="Activity"
          component={ActivityScreen}
          options={{
            title: "Activity",
            tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
            headerLeft: () => <HeaderLeft realm={selectedRealm} />,
          }}
        />
      </Tab.Navigator> */}
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

const HeaderTitle = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const HeaderTitleText = styled.Text`
  color: ${(props: any) => props.theme.gray[100]};
  font-weight: bold;
`;
