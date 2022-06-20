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

import { TouchableOpacity } from "react-native";
import { AnimatedImage } from "react-native-ui-lib";

export default function DiscoverDetailsScreen({
  route,
}: RootStackScreenProps<"RealmSettings">) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { selectedRealm } = useAppSelector((state) => state.realms);
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

  return (
    <Container>
      <LinearGradient
        colors={[
          color1 ? color1 : theme.gray[600],
          color2 ? color2 : theme.gray[800],
        ]}
        style={{ height: 200 }}
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
            <Typography bold={true} size="h3" shade="100" text={displayName} />
          </HeaderRow>
        </ImageBackground>
      </LinearGradient>
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
  height: 200px;
`;

const Divider = styled.View`
  /* width: 48px; */
  height: 2px;
  max-height: 2px;
  background-color: ${(props) => props.theme.gray[800]};
  margin-bottom: ${(props) => props.theme.spacing[3]};
`;

const IconContainer = styled.View`
  border-radius: 100px;
  padding: ${(props: any) => props.theme.spacing[2]};
  background: ${(props: any) => props.theme.gray[900]};
`;
