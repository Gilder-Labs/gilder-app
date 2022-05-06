import { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import { DrawerContentContainer } from "../components/DrawerContentContainer";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Unicons from "@iconscout/react-native-unicons";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "styled-components";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchRealms, fetchRealm } from "../store/realmSlice";
import { fetchRealmMembers } from "../store/memberSlice";
import { fetchRealmProposals } from "../store/proposalsSlice";
import { fetchRealmActivity } from "../store/activitySlice";
import { fetchVaults } from "../store/treasurySlice";
import {
  fetchNotificationSettings,
  setToken,
} from "../store/notificationSlice";
import styled from "styled-components/native";

import ActivityScreen from "../screens/ActivityScreen";
import TreasuryScreen from "../screens/TreasuryScreen";
import MembersScreen from "../screens/MembersScreen";
import ProposalsScreen from "../screens/ProposalsScreen";

// Test lab, remove before prod.
import TestLabScreen from "../screens/TestLabScreen";

import LinkingConfiguration from "./LinkingConfiguration";
import { MemberProfile } from "../screens/MemberProfile";
import { ProposalDetailScreen } from "../screens/ProposalDetailScreen";
import { WalletModal } from "../components/WalletModal";
import { WalletTransactionModal } from "../components/WalletTransactionModal";
import RealmSettingsScreen from "../screens/RealmSettingsScreen";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerScreen() {
  const theme = useTheme();
  const { activeProposals, isLoadingVaults } = useAppSelector(
    (state) => state.treasury
  );
  const { selectedRealm } = useAppSelector((state) => state.realms);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const responseListener = useRef();

  useEffect(() => {
    const getPushToken = async () => {
      const token = await registerForPushNotificationsAsync();

      dispatch(setToken(token));
    };

    getPushToken();

    // @ts-ignore
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("response:", response);
        console.log("Data", response.notification.request.content.data);

        // @ts-ignore
        dispatch(fetchRealm(data?.realmId));
        if (selectedRealm.pubKey === data?.realmId) {
          fetchRealmProposals({ realm: selectedRealm, isRefreshing: false });
        }
        // @ts-ignore
        navigation.push("ProposalDetail", {
          proposalId: data.proposalId,
        });
      });

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <Drawer.Navigator
      initialRouteName="Proposals"
      drawerContent={(props) => <DrawerContentContainer {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: `${theme?.gray[800]}aa`,
        drawerActiveTintColor: theme?.gray[300],
        drawerInactiveTintColor: theme?.gray[500],
        drawerStyle: {
          width: 320,
        },
        headerTintColor: "#f4f4f5", //Set Header text color
        swipeEdgeWidth: 500, // Allows user to open drawer swiping left with on any part of screen
      }}
      useLegacyImplementation={false}
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
        component={MembersScreen}
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
            <DrawerLabelContainer>
              <DrawerTabText color={color} focused={focused}>
                Proposals
              </DrawerTabText>
              {activeProposals > 0 && !isLoadingVaults && (
                <NotificationContainer>
                  <DrawerTabNotification>
                    {activeProposals}
                  </DrawerTabNotification>
                </NotificationContainer>
              )}
            </DrawerLabelContainer>
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
      {/* Comment out before going to prod.  */}
      {/* <Drawer.Screen
        name="TestLab"
        component={TestLabScreen}
        options={{
          drawerLabel: ({ focused, color }) => (
            <DrawerTabText color={color} focused={focused}>
              Test Lab
            </DrawerTabText>
          ),
          drawerIcon: ({ focused, color, size }) => (
            <Unicons.UilFlask size="28" color={color} />
          ),
        }}
      /> */}
      {/* End comment out before prod */}
    </Drawer.Navigator>
  );
}

export default function Navigation({}: {}) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { selectedRealm, selectedRealmId } = useAppSelector(
    (state) => state.realms
  );
  const { pushToken } = useAppSelector((state) => state.notifications);

  // fetch realms on devnet toggle
  useEffect(() => {
    dispatch(fetchRealms());
  }, []);

  // Run immediately if we have communityMint/councilMint, otherwies for custom daos we wait till we get a response
  useEffect(() => {
    if (
      selectedRealm?.pubKey === selectedRealmId &&
      (selectedRealm?.communityMint || selectedRealm?.councilMint)
    ) {
      dispatch(fetchVaults(selectedRealm));
      dispatch(
        fetchRealmActivity({
          realm: selectedRealm,
          fetchAfterSignature: undefined,
        })
      );
      dispatch(
        fetchRealmProposals({ realm: selectedRealm, isRefreshing: false })
      );
      dispatch(fetchRealmMembers({ realm: selectedRealm }));
    }
  }, [selectedRealm?.pubKey, selectedRealm?.communityMint]);

  useEffect(() => {
    if (pushToken) {
      dispatch(
        fetchNotificationSettings({
          pushToken: pushToken,
        })
      );
    }
  }, [pushToken]);

  const NavigationTheme = {
    dark: false,
    colors: {
      primary: theme?.gray[400],
      background: theme?.gray[1000],
      card: theme?.gray[1000],
      text: theme?.gray[200],
      border: theme?.gray[1000],
      notification: theme?.gray[700],
    },
  };

  return (
    <RootContainer>
      <WalletModal />
      <WalletTransactionModal />
      <NavigationContainer
        linking={LinkingConfiguration}
        theme={NavigationTheme}
      >
        <Stack.Navigator
          screenOptions={{
            fullScreenGestureEnabled: true,
            headerTintColor: "#f4f4f5", //Set Header text color
          }}
          initialRouteName="Root"
        >
          <Stack.Screen
            name="Root"
            component={DrawerScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MemberDetails"
            component={MemberProfile}
            // options={{ headerShown: false }}
            options={({ route }) => ({
              title: route.params.memberInfo.name
                ? route.params.memberInfo.name
                : `${route.params.member.walletId.slice(
                    0,
                    4
                  )}...${route.params.member.walletId.slice(-4)}`,
            })}
          />
          <Stack.Screen
            name="RealmSettings"
            component={RealmSettingsScreen}
            options={({ route }) => ({
              title: "Realm Settings", // update to realm name
            })}
          />
          <Stack.Screen
            name="ProposalDetail"
            component={ProposalDetailScreen}
            options={({ route }) => ({
              title: "Proposal Details",
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </RootContainer>
  );
}

const registerForPushNotificationsAsync = async () => {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  } else {
    alert("Must use physical device for Push Notifications");
  }
  return token;
};

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

const DrawerTabNotification = styled.Text`
  color: ${(props) => props.theme.secondary[400]};
`;

const NotificationContainer = styled.View`
  background: ${(props) => props.theme.secondary[800]}55;
  border: 1px solid ${(props) => props.theme.secondary[800]};
  height: 24px;
  width: 24px;
  margin-top: -4px;
  margin-bottom: -4px;

  border-radius: 100px;
  justify-content: center;
  align-items: center;
`;

const DrawerLabelContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
