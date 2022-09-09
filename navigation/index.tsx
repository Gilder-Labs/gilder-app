import { useEffect, useRef, useState } from "react";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import * as React from "react";
import { DrawerContentContainer } from "../components/DrawerContentContainer";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Platform, Keyboard } from "react-native";
import { useTheme } from "styled-components";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchRealms, fetchRealm, fetchStorage } from "../store/realmSlice";
import { fetchRealmMembers } from "../store/memberSlice";
import { fetchRealmProposals } from "../store/proposalsSlice";
import { fetchRealmActivity } from "../store/activitySlice";
import { fetchVaults } from "../store/treasurySlice";
import { setShowToast, fetchOnboarding } from "../store/utilitySlice";
import { fetchWalletInfo } from "../store/walletSlice";
import {
  fetchNotificationSettings,
  setToken,
} from "../store/notificationSlice";
import styled from "styled-components/native";
import ActivityScreen from "../screens/ActivityScreen";
import TreasuryScreen from "../screens/TreasuryScreen";
import MembersScreen from "../screens/MembersScreen";
import ProposalsScreen from "../screens/ProposalsScreen";

import LinkingConfiguration from "./LinkingConfiguration";
import { MemberProfileScreen } from "../screens/MemberProfileScreen";
import { ProposalDetailScreen } from "../screens/ProposalDetailScreen";
import { WalletModal } from "../components/WalletModal";
import { SplashScreen } from "../components";
import { WalletTransactionModal } from "../components/WalletTransactionModal";
import RealmSettingsScreen from "../screens/RealmSettingsScreen";
import { Incubator } from "react-native-ui-lib";
const { Toast } = Incubator;
import DiscoverScreen from "../screens/DiscoverScreen";
import DiscoverDetailsScreen from "../screens/DiscoverDetailsScreen";
import InfoModalScreen from "../screens/InfoModalScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import WebViewScreen from "../screens/WebViewScreen";

import { chatApiKey } from "../constants/Chat";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-expo"; // Or stream-chat-expo
import ThreadScreen from "../screens/ThreadScreen";
import ChannelScreen from "../screens/ChannelScreen";

import { faBuildingColumns } from "@fortawesome/pro-regular-svg-icons/faBuildingColumns";
import { faUserGroup } from "@fortawesome/pro-solid-svg-icons/faUserGroup";
import { faTreasureChest } from "@fortawesome/pro-solid-svg-icons/faTreasureChest";
import { faListUl } from "@fortawesome/pro-regular-svg-icons/faListUl";
import { faInfoCircle } from "@fortawesome/pro-regular-svg-icons/faInfoCircle";

const chatClient = StreamChat.getInstance(chatApiKey);

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
  const { pushToken } = useAppSelector((state) => state.notifications);

  const responseListener = useRef();

  useEffect(() => {
    const openingDrawer = navigation.addListener("state", (e) => {
      Keyboard.dismiss();
    });

    return openingDrawer;
  }, [navigation]);

  useEffect(() => {
    const getPushToken = async () => {
      let token;
      if (!token) {
        token = await registerForPushNotificationsAsync();
      }
      if (token) {
        dispatch(setToken(token));
      }
    };

    getPushToken();

    // @ts-ignore
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response?.notification?.request?.content?.data;

        // @ts-ignore
        if (data?.realmId) {
          dispatch(fetchRealm(data?.realmId));
        }
        if (selectedRealm && selectedRealm?.pubKey === data?.realmId) {
          fetchRealmProposals({ realm: selectedRealm, isRefreshing: false });
        }
        if (data?.proposalId) {
          // @ts-ignore
          navigation.push("ProposalDetail", {
            proposalId: data.proposalId,
          });
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    if (pushToken) {
      dispatch(
        fetchNotificationSettings({
          pushToken: pushToken,
        })
      );
    }
  }, [pushToken]);

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
        keyboardDismissMode: "none",
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
            <FontAwesomeIcon
              icon={faTreasureChest}
              size={20}
              color={theme?.gray[500]}
            />
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
            <FontAwesomeIcon
              icon={faUserGroup}
              size={20}
              color={theme?.gray[500]}
            />
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
            <FontAwesomeIcon
              icon={faBuildingColumns}
              size={20}
              color={theme?.gray[500]}
            />
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
            <FontAwesomeIcon
              icon={faListUl}
              size={20}
              color={theme?.gray[500]}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="ChannelScreen"
        component={ChannelScreen}
        options={({ route }) => ({
          title: route?.params?.channel?.data?.name,
          drawerItemStyle: {
            display: "none",
          },
        })}
      />
      <Drawer.Screen name="WebViewScreen" component={WebViewScreen} />
    </Drawer.Navigator>
  );
}

export default function Navigation({}: {}) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { selectedRealm, selectedRealmId, isLoadingRealms, isFetchingStorage } =
    useAppSelector((state) => state.realms);
  const { isShowingToast, hasCompletedOnboarding, isFetchingOnboarding } =
    useAppSelector((state) => state.utility);

  useEffect(() => {
    dispatch(fetchRealms());
    dispatch(fetchStorage());
    dispatch(fetchWalletInfo());
    dispatch(fetchOnboarding());
  }, []);

  // Run immediately if we have communityMint/councilMint, otherwies for custom daos we wait till we get a response
  useEffect(() => {
    if (
      !isFetchingStorage &&
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
  }, [selectedRealm?.pubKey, selectedRealm?.communityMint, isFetchingStorage]);

  const handleDismiss = () => {
    dispatch(setShowToast(false));
  };

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

  if (isFetchingStorage || isFetchingOnboarding) {
    return <SplashScreen />;
  }

  return (
    <RootContainer>
      <Toast
        visible={isShowingToast}
        position={"bottom"}
        preset="success"
        message="Public key copied."
        onDismiss={handleDismiss}
        autoDismiss={1000}
        backgroundColor={theme.gray[1000]}
        zIndex={100000}
        containerStyle={{
          width: 240,
          marginLeft: "auto",
          marginRight: "auto",
        }}
        messageStyle={{
          color: theme?.gray[400],
        }}
        elevation={0}
        centerMessage={true}
      />
      <WalletTransactionModal />
      <Chat client={chatClient}>
        <NavigationContainer
          linking={LinkingConfiguration}
          theme={NavigationTheme}
        >
          <Stack.Navigator
            screenOptions={{
              fullScreenGestureEnabled: true,
              headerTintColor: "#f4f4f5", //Set Header text color
            }}
            initialRouteName={hasCompletedOnboarding ? "Root" : "Onboarding"}
          >
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{ headerShown: false, headerTransparent: true }}
            />
            <Stack.Screen
              name="Root"
              component={DrawerScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MemberDetails"
              component={MemberProfileScreen}
              // options={{ headerShown: false }}
              options={({ route }) => ({
                title: "Profile",
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
            <Stack.Screen
              name="ThreadScreen"
              component={ThreadScreen}
              options={({ route }) => ({
                title: "Thread",
              })}
            />
            <Stack.Screen
              name="Discover"
              component={DiscoverScreen}
              options={({ route, navigation }) => ({
                title: "Discover",
                headerRight: () => {
                  return (
                    <InfoButton onPress={() => navigation.push("InfoScreen")}>
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        size={16}
                        color={theme?.gray[300]}
                      />
                    </InfoButton>
                  );
                },
              })}
            />
            <Stack.Screen
              name="DiscoverDetails"
              component={DiscoverDetailsScreen}
              options={({ route }) => ({
                title: "",
                headerBackTitle: "Back",
                presentation: "modal",
                headerTransparent: true,
              })}
            />
            <Stack.Screen
              name="WalletModal"
              component={WalletModal}
              options={({ route }) => ({
                title: "",
                presentation: "modal",
                headerTransparent: true,
                headerShown: false,
              })}
            />
            <Stack.Screen
              name="InfoScreen"
              component={InfoModalScreen}
              options={({ route }) => ({
                title: "",
                presentation: "modal",
                headerTransparent: true,
                headerShown: false,
                contentStyle: {
                  height: "50%",
                  maxHeight: "50%",
                  marginTop: "100%",
                  backgroundColor: "red",
                  borderTopEndRadius: 16,
                  borderTopLeftRadius: 16,
                },
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Chat>
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
      // alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  } else {
    // alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#fcd34d",
    });
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
  height: 100%;
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

const InfoButton = styled.TouchableOpacity`
  padding: ${(props) => props.theme.spacing[1]};
`;
