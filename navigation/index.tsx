import { useEffect, useState, useCallback } from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import * as React from "react";
import { DrawerContentContainer } from "../components/DrawerContentContainer";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Unicons from "@iconscout/react-native-unicons";

import { useTheme } from "styled-components";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchRealms, fetchRealm } from "../store/realmSlice";
import { fetchRealmMembers } from "../store/memberSlice";
import { fetchRealmProposals } from "../store/proposalsSlice";
import { fetchRealmActivity } from "../store/activitySlice";
import { fetchVaults } from "../store/treasurySlice";
import styled from "styled-components/native";

import ActivityScreen from "../screens/ActivityScreen";
import TreasuryScreen from "../screens/TreasuryScreen";
import MembersScreen from "../screens/MembersScreen";
import ProposalsScreen from "../screens/ProposalsScreen";

import LinkingConfiguration from "./LinkingConfiguration";
import { MemberProfile } from "../screens/MemberProfile";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function StackScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        fullScreenGestureEnabled: true, // kinda works?
      }}
      initialRouteName="MembersScreen"
    >
      <Stack.Screen
        name="MembersScreen"
        component={MembersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MemberDetails"
        component={MemberProfile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function Navigation({}: {}) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { selectedRealm } = useAppSelector((state) => state.realms);

  useEffect(() => {
    dispatch(fetchRealms());
  }, []);

  useEffect(() => {
    if (selectedRealm?.pubKey) {
      dispatch(fetchVaults(selectedRealm));
      dispatch(
        fetchRealmActivity({
          realm: selectedRealm,
          fetchAfterSignature: undefined,
        })
      );
      dispatch(fetchRealmProposals(selectedRealm));
      dispatch(fetchRealmMembers(selectedRealm));
    }
  }, [selectedRealm]);

  const NavigationTheme = {
    dark: false,
    colors: {
      primary: theme?.primary[400],
      background: theme?.gray[1000],
      card: theme?.gray[1000],
      text: theme?.gray[200],
      border: theme?.gray[1000],
      notification: theme?.primary[700],
    },
  };

  return (
    <RootContainer>
      <NavigationContainer
        linking={LinkingConfiguration}
        theme={NavigationTheme}
      >
        <Drawer.Navigator
          initialRouteName="Members"
          drawerContent={(props) => <DrawerContentContainer {...props} />}
          screenOptions={{
            drawerActiveBackgroundColor: theme?.gray[800],
            drawerActiveTintColor: theme?.primary[400],
            drawerInactiveTintColor: theme?.gray[400],
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
          <Drawer.Screen
            name="Treasury"
            component={TreasuryScreen}
            options={{
              drawerLabel: ({ focused, color }) => (
                <DrawerTabText color={color} focused={focused}>
                  Treasury
                </DrawerTabText>
              ),
              drawerIcon: ({ focused, color, size }) => (
                <Unicons.UilGold size="28" color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Members"
            component={StackScreen}
            options={{
              drawerLabel: ({ focused, color }) => (
                <DrawerTabText color={color} focused={focused}>
                  Members
                </DrawerTabText>
              ),
              drawerIcon: ({ focused, color, size }) => (
                <Unicons.UilUsersAlt size="28" color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Proposals"
            component={ProposalsScreen}
            options={{
              drawerLabel: ({ focused, color }) => (
                <DrawerTabText color={color} focused={focused}>
                  Proposals
                </DrawerTabText>
              ),
              drawerIcon: ({ focused, color, size }) => (
                <Unicons.UilFileAlt size="28" color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Activity"
            component={ActivityScreen}
            options={{
              drawerLabel: ({ focused, color }) => (
                <DrawerTabText color={color} focused={focused}>
                  Activity
                </DrawerTabText>
              ),
              drawerIcon: ({ focused, color, size }) => (
                <Unicons.UilListUl size="28" color={color} />
              ),
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </RootContainer>
  );
}

const DrawerTabText = styled.Text<{ color: string; focused: boolean }>`
  color: ${(props) => props.color};
  font-size: 16px;
  margin-left: -16px;
  font-weight: ${(props) => (props.focused ? "bold" : "normal")};
`;

const RootContainer = styled.View`
  flex: 1;
  background: black;
`;
