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

import * as Haptics from "expo-haptics";

export default function OnboardingScreen({ navigation }: any) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { selectedRealm } = useAppSelector((state) => state.realms);
  const [selectedPage, setSelectedPage] = useState(0);

  const handlePageScroll = (event: PagerViewOnPageSelectedEvent) => {
    const index = event.nativeEvent.position;
    setSelectedPage(index);
  };

  const handleFinishOnboarding = () => {
    navigation.replace("Root");
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
              width: 400,
              height: "100%",
            }}
            source={WelcomeImage}
          />
        </OnboardingPageContainer>
        <OnboardingPageContainer key="2">
          <AnimatedImage
            style={{
              width: 400,
              height: "100%",
            }}
            source={NotificationsImage}
          />
        </OnboardingPageContainer>
        <OnboardingPageContainer key="3">
          <AnimatedImage
            style={{
              width: 400,
              height: "100%",
            }}
            source={WalletImage}
          />
        </OnboardingPageContainer>
        <OnboardingPageContainer key="4">
          <Typography
            bold={true}
            size="h3"
            shade="300"
            text={"Selecting daos"}
            marginBottom="2"
          />
          <Button
            title="Approve"
            onPress={handleFinishOnboarding}
            shade="900"
            color="secondary"
          />
        </OnboardingPageContainer>
      </PagerView>
      <PageControl
        numOfPages={4}
        currentPage={selectedPage}
        inactiveColor={theme.gray[600]}
        color={theme.gray[200]}
        containerStyle={{ marginBottom: 40, marginTop: 40 }}
        enlargeActive={true}
      />
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
