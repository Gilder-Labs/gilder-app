import styled from "styled-components/native";
import { useState, useRef, useEffect } from "react";
import { Button, Typography, RealmIcon, Loading } from "../components";
import { StyleSheet } from "react-native";
import { useTheme } from "styled-components";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { PageControl } from "react-native-ui-lib";
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";
import { AnimatedImage } from "react-native-ui-lib";
import WelcomeImage from "../assets/images/onboarding/welcome.png";
import NotificationsImage from "../assets/images/onboarding/notifications.png";
import WalletImage from "../assets/images/onboarding/wallet.png";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { setToken } from "../store/notificationSlice";
import { Dimensions } from "react-native";
import { DaoWatchlistSelection } from "../elements";

export default function OnboardingScreen({ navigation }: any) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [selectedPage, setSelectedPage] = useState(0);
  const { width } = Dimensions.get("window");

  const handlePageScroll = async (event: PagerViewOnPageSelectedEvent) => {
    const index = event.nativeEvent.position;
    setSelectedPage(index);
    if (index === 3) {
      const token = await registerForPushNotificationsAsync();
      dispatch(setToken(token));
    }
  };

  const registerForPushNotificationsAsync = async () => {
    let token;
    console.log("trying to register for notifications");
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
    return token;
  };

  return (
    <Container>
      <PagerView
        style={styles.viewPager}
        initialPage={selectedPage}
        onPageSelected={handlePageScroll}
        pageMargin={24}
      >
        <OnboardingPageContainer key="1">
          <AnimatedImage
            style={{
              width: width,
              height: "100%",
            }}
            source={WelcomeImage}
          />
        </OnboardingPageContainer>
        <OnboardingPageContainer key="2">
          <AnimatedImage
            style={{
              width: width,
              height: "100%",
            }}
            source={NotificationsImage}
          />
        </OnboardingPageContainer>
        <OnboardingPageContainer key="3">
          <AnimatedImage
            style={{
              width: width,
              height: "100%",
            }}
            source={WalletImage}
          />
        </OnboardingPageContainer>
        <OnboardingPageContainer key="4">
          <DaoWatchlistSelection isOnboarding={true} />
        </OnboardingPageContainer>
      </PagerView>
      <PageControlContainer>
        <PageControl
          numOfPages={4}
          currentPage={selectedPage}
          inactiveColor={theme.gray[600]}
          color={theme.gray[200]}
          containerStyle={{
            marginBottom: 12,
            marginTop: 12,
          }}
          enlargeActive={true}
        />
      </PageControlContainer>
    </Container>
  );
}

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

const Container = styled.View`
  flex: 1;
  background: ${(props: any) => props.theme.gray[900]};
  padding-bottom: ${(props) => props.theme.spacing[3]};
  padding-top: ${(props) => props.theme.spacing[3]};

  justify-content: center;
  align-items: center;
  padding-top: 48;
`;

const PageControlContainer = styled.View`
  background: transparent;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing[3]};
`;

const OnboardingPageContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.gray[900]};
  align-items: center;
  justify-content: center;
  width: 100%;
`;
