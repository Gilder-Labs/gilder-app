import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { toggleRealmInWatchlist } from "../store/realmSlice";
import * as Haptics from "expo-haptics";
import { subscribeToNotifications } from "../store/notificationSlice";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "styled-components";
import { RealmIcon } from "../components";
import { AnimatedImage } from "react-native-ui-lib";
import { ImageBackground } from "react-native";
import TransparentImage from "../assets/images/transparent.png";

interface DiscoverCardProps {
  data: Feature;
  isHorizontal?: boolean;
  useBackgroundImage?: boolean;
}

export const DiscoverCard = ({
  data,
  isHorizontal = false,
  useBackgroundImage = true,
}: DiscoverCardProps) => {
  const theme = useTheme();
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
  } = data;

  return (
    <ContainerButton
      onPress={() => {}}
      activeOpacity={0.4}
      isHorizontal={isHorizontal}
    >
      <LinearGradient
        colors={[
          color1 ? color1 : theme.gray[700],
          color2 ? color2 : theme.gray[900],
        ]}
        style={{ flex: 1, height: 140, borderRadius: 8 }}
        start={{ x: 0.1, y: 0.2 }}
      >
        <ImageBackground
          source={useBackgroundImage ? { uri: ogImage } : TransparentImage}
          resizeMode="cover"
          blurRadius={"40"}
        >
          <Container>
            <IconContainer>
              <AnimatedImage
                style={{
                  width: 48,
                  height: 48,
                  overflow: "hidden",
                  borderRadius: 100,
                }}
                source={{
                  uri: ogImage,
                }}
              />
            </IconContainer>

            <RealmName>{displayName}</RealmName>
          </Container>
        </ImageBackground>
      </LinearGradient>
    </ContainerButton>
  );
};

const ContainerButton = styled.TouchableOpacity<{ isHorizontal: boolean }>`
  height: 140px;
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 4px;
  background: ${(props: any) => props.theme.gray[800]};
  border-radius: 8;
  min-width: 200px;
  margin-right: ${(props: any) =>
    props.isHorizontal ? props.theme.spacing[3] : "0px"};
`;

const RealmName = styled.Text`
  margin-top: ${(props: any) => props.theme.spacing[3]}
  color: ${(props: any) => props.theme.gray[100]};
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;

const Container = styled.View`
  justify-content: center;
  align-items: center;
  height: 140px;
  border-radius: 8px;
`;

const IconContainer = styled.View`
  margin-bottom: ${(props: any) => props.theme.spacing[4]};
  border-radius: 100px;
  padding: ${(props: any) => props.theme.spacing[2]};
  background: ${(props: any) => props.theme.gray[900]};
`;
