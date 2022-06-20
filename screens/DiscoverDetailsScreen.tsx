import { RootStackScreenProps } from "../types";
import styled from "styled-components/native";
import { useState, useRef, useEffect } from "react";
import { Button, Typography, RealmIcon, Loading } from "../components";
import { useTheme } from "styled-components";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { ImageBackground } from "react-native";
import TransparentImage from "../assets/images/transparent.png";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import * as Unicons from "@iconscout/react-native-unicons";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import { AnimatedImage } from "react-native-ui-lib";

export default function DiscoverDetailsScreen({
  route,
}: RootStackScreenProps<"RealmSettings">) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  // @ts-ignore
  const { data } = route?.params;

  const {
    symbol,
    displayName,
    realmId,
    website,
    twitter,
    discord,
    ogImage,
    description,
    howToJoin,
    nftMarketPlace,
    tags,
    color1,
    color2,
  } = data as Feature;

  const handleWebClick = async () => {
    await WebBrowser.openBrowserAsync(website);
  };

  const handleMarketplaceClick = async () => {
    await WebBrowser.openBrowserAsync(nftMarketPlace);
  };

  const handleDiscordLink = () => {
    console.log("trying to open discord");
    Linking.openURL(discord);
  };

  const handleTwitterLink = () => {
    console.log("trying to open discord");
    Linking.openURL(`https://twitter.com/${twitter}`);
  };

  return (
    <Container>
      <LinearGradient
        colors={[
          color1 ? color1 : theme.gray[600],
          color2 ? color2 : theme.gray[800],
        ]}
        style={{ minHeight: 200 }}
        start={{ x: 0.1, y: 0.2 }}
      >
        <ImageBackground
          source={!color1 || !color2 ? { uri: ogImage } : TransparentImage}
          resizeMode="cover"
          blurRadius={120}
        >
          <HeaderRow>
            <IconContainer>
              <AnimatedImage
                style={{
                  width: 64,
                  height: 64,
                  overflow: "hidden",
                  borderRadius: 100,
                }}
                source={{
                  uri: ogImage,
                }}
              />
            </IconContainer>
            <Typography
              bold={true}
              size="h3"
              shade="100"
              text={displayName}
              marginBottom="4"
              hasTextShadow={true}
            />
            <LinkRow>
              {!!website && (
                <IconContainerButton
                  activeOpacity={0.4}
                  onPress={handleWebClick}
                >
                  <Unicons.UilGlobe size="32" color={theme.gray[300]} />
                </IconContainerButton>
              )}
              {!!discord && (
                <IconContainerButton
                  activeOpacity={0.4}
                  onPress={handleDiscordLink}
                >
                  <Unicons.UilDiscord size="32" color={"#5865F2"} />
                </IconContainerButton>
              )}
              {!!twitter && (
                <IconContainerButton
                  activeOpacity={0.4}
                  onPress={handleTwitterLink}
                >
                  <Unicons.UilTwitter size="32" color={"#1DA1F2"} />
                </IconContainerButton>
              )}
              {!!nftMarketPlace && (
                <IconContainerButton
                  activeOpacity={0.4}
                  onPress={handleMarketplaceClick}
                >
                  <Unicons.UilShoppingCart size="32" color={theme.gray[300]} />
                </IconContainerButton>
              )}
            </LinkRow>
          </HeaderRow>
        </ImageBackground>
      </LinearGradient>
      <ContentContainer>
        <Typography
          size="h4"
          bold={true}
          shade="100"
          text={"Description"}
          marginBottom="2"
        />
        <Typography
          size="body"
          shade="100"
          text={description}
          marginBottom="4"
        />
        {howToJoin && (
          <>
            <Typography
              size="h4"
              bold={true}
              shade="100"
              text={"How to join"}
              marginBottom="2"
            />
            <Typography
              size="body"
              shade="100"
              text={howToJoin}
              marginBottom="4"
            />
          </>
        )}
      </ContentContainer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background: ${(props: any) => props.theme.gray[900]};
`;

const HeaderRow = styled.View`
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.theme.spacing[3]};
  /* height: 200px; */
  min-height: 200px;
  margin-top: ${(props: any) => props.theme.spacing[3]};
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
`;

const LinkRow = styled.View`
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
  width: 100%;
`;

const IconContainer = styled.View`
  border-radius: 100px;
  padding: ${(props: any) => props.theme.spacing[2]};
  background: ${(props: any) => props.theme.gray[900]};
`;

const IconContainerButton = styled.TouchableOpacity`
  border-radius: 100px;
  padding: ${(props: any) => props.theme.spacing[2]};
  background: ${(props: any) => props.theme.gray[900]};
`;

const ContentContainer = styled.View`
  padding: ${(props: any) => props.theme.spacing[4]};
`;
