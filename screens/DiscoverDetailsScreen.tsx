import { RootStackScreenProps } from "../types";
import styled from "styled-components/native";
import { useState, useRef, useEffect } from "react";
import { Button, Typography, RealmIcon, Loading } from "../components";
import { useTheme } from "styled-components";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { ImageBackground } from "react-native";
import TransparentImage from "../assets/images/transparent.png";
import { useNavigation } from "@react-navigation/native";
import { fetchRealm } from "../store/realmSlice";
import ImageView from "react-native-image-viewing";

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
  const navigation = useNavigation();
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
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
    features,
    color1,
    color2,
    screenshots,
  } = data as Feature;

  const handleWebClick = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await WebBrowser.openBrowserAsync(website);
  };

  const handleMarketplaceClick = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await WebBrowser.openBrowserAsync(nftMarketPlace);
  };

  const handleDiscordLink = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(discord);
  };

  const handleTwitterLink = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(`https://twitter.com/${twitter}`);
  };

  const handleSelect = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dispatch(fetchRealm(realmId));
    navigation.popToTop();
  };

  const imageArrayUri = screenshots.map((image) => {
    return {
      uri: image,
    };
  });

  const isNFTDao = tags.includes("NFT");

  return (
    <Container>
      <FloatingBarContainer>
        <FloatingBar />
      </FloatingBarContainer>
      <LinearGradient
        colors={[
          color1 ? color1 : theme.gray[600],
          color2 ? color2 : theme.gray[800],
        ]}
        style={{ minHeight: 200 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
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
      <ContentContainer
        contentContainerStyle={{ padding: 16, paddingBottom: 64 }}
      >
        <Row>
          <Typography
            size="h4"
            bold={true}
            shade="100"
            text={"Description"}
            marginBottom="3"
          />
          {!!realmId && (
            <DaoViewButton onPress={handleSelect} activeOpacity={0.4}>
              <Typography
                text="View DAO"
                marginBottom="0"
                marginRight="1"
                shade="100"
              />
              <Unicons.UilArrowRight size="24" color={theme.gray[100]} />
            </DaoViewButton>
          )}
        </Row>
        <Typography
          size="body"
          shade="400"
          text={description}
          marginBottom="4"
        />
        {!!howToJoin && (
          <>
            <Typography
              size="h4"
              bold={true}
              shade="100"
              text={"How to join"}
              marginBottom="3"
            />
            <Typography
              size="body"
              shade="400"
              text={howToJoin}
              marginBottom="4"
            />
          </>
        )}
        {!!features && (
          <>
            <Typography
              size="h4"
              bold={true}
              shade="100"
              text={"Features"}
              marginBottom="3"
            />
            <Typography
              size="body"
              shade="400"
              text={features}
              marginBottom="4"
            />
          </>
        )}

        <ImageView
          images={imageArrayUri}
          imageIndex={0}
          visible={isImageViewerOpen}
          onRequestClose={() => setIsImageViewerOpen(false)}
          swipeToCloseEnabled={true}
          doubleTapToZoomEnabled
        />
        {!!screenshots.length && (
          <>
            <Typography
              size="h4"
              bold={true}
              shade="100"
              text={isNFTDao ? "NFT" : "Product"}
              marginBottom="3"
            />
            <HorizontalScrollView
              horizontal={true}
              scrollIndicatorInsets={{ bottom: -16 }}
              contentContainerStyle={{ padding: 12 }}
            >
              {screenshots.map((url, index) => (
                <ImageContainer
                  key={index}
                  onPress={() => setIsImageViewerOpen(true)}
                >
                  <AnimatedImage
                    source={{ uri: url }}
                    // cover={true}
                    style={{
                      minWidth: 240,
                      height: 240,
                      width: isNFTDao ? 240 : 360,

                      overflow: "hidden",
                      borderRadius: 8,
                      resizeMode: isNFTDao ? "cover" : "contain",
                    }}
                  />
                </ImageContainer>
              ))}
            </HorizontalScrollView>
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

const Row = styled.View`
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
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

const ContentContainer = styled.ScrollView``;

const DaoViewButton = styled.TouchableOpacity`
  padding: ${(props: any) => props.theme.spacing[1]};
  padding-left: ${(props: any) => props.theme.spacing[4]};
  padding-right: ${(props: any) => props.theme.spacing[3]};

  flex-direction: row;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  background: ${(props: any) => props.theme.gray[700]};
`;

const FloatingBarContainer = styled.View`
  position: absolute;

  width: 100%;
  padding-top: ${(props: any) => props.theme.spacing[2]};
  top: 0;
  left: 0;
  z-index: 100;

  justify-content: center;
  align-items: center;
`;

const FloatingBar = styled.View`
  height: 4px;
  width: 40px;
  z-index: 100;
  background: #ffffff88;
  top: 0;
  border-radius: 8px;
`;

const HorizontalScrollView = styled.ScrollView`
  margin-bottom: ${(props) => props.theme.spacing[3]};
  border-radius: 8px;
  background: ${(props: any) => props.theme.gray[1000]};
`;

const ImageContainer = styled.TouchableOpacity`
  overflow: hidden;
  border-radius: 8px;
  margin-right: 12px;
`;
