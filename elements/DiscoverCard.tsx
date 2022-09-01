import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "styled-components";
import { Typography } from "../components";
import { AnimatedImage } from "react-native-ui-lib";
import { ImageBackground } from "react-native";
import TransparentImage from "../assets/images/transparent.png";
import { useNavigation } from "@react-navigation/native";

interface DiscoverCardProps {
  data: Feature;
  isHorizontal?: boolean;
  useBackgroundImage?: boolean;
}

export const DiscoverCard = ({
  data,
  isHorizontal = false,
  useBackgroundImage = false,
}: DiscoverCardProps) => {
  const theme = useTheme();
  const navigation = useNavigation();
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

  const handleCardClick = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.push("DiscoverDetails", {
      data: data,
    });
  };

  return (
    <ContainerButton
      onPress={handleCardClick}
      activeOpacity={0.4}
      isHorizontal={isHorizontal}
    >
      <LinearGradient
        colors={[
          color1 ? color1 : theme.gray[600],
          color2 ? color2 : theme.gray[800],
        ]}
        style={{ flex: 1, height: 140, borderRadius: 8 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ImageBackground
          source={!color1 || !color2 ? { uri: ogImage } : TransparentImage}
          resizeMode="cover"
          blurRadius={120}
        >
          <Container>
            <Row>
              <IconContainer>
                <AnimatedImage
                  style={{
                    width: 40,
                    height: 40,
                    overflow: "hidden",
                    borderRadius: "100px",
                  }}
                  source={{
                    uri: ogImage,
                  }}
                />
              </IconContainer>
              <Typography
                text={displayName}
                marginLeft={"2"}
                size="h3"
                shade="100"
                bold={true}
                marginBottom={"0"}
                hasTextShadow={true}
              />
            </Row>
            <RowEnd>
              {tags.map((tag) => (
                <BadgeContainer key={tag}>
                  <Typography
                    text={tag}
                    marginBottom="0"
                    size="caption"
                    shade="300"
                  />
                </BadgeContainer>
              ))}
            </RowEnd>
          </Container>
        </ImageBackground>
      </LinearGradient>
    </ContainerButton>
  );
};

const ContainerButton = styled.TouchableOpacity<{ isHorizontal: boolean }>`
  height: 140px;
  margin-bottom: ${(props: any) =>
    !props.isHorizontal ? props.theme.spacing[3] : "0px"};
  border-radius: 8px;
  overflow: hidden;
  background: ${(props: any) => props.theme.gray[800]};
  min-width: 200px;
  margin-right: ${(props: any) =>
    props.isHorizontal ? props.theme.spacing[3] : "0px"};
`;

const Container = styled.View`
  height: 140px;
  border-radius: 8px;
  justify-content: space-between;
  padding: ${(props: any) => props.theme.spacing[2]};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RowEnd = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const IconContainer = styled.View`
  border-radius: 100px;
  padding: ${(props: any) => props.theme.spacing[1]};
  background: ${(props: any) => props.theme.gray[900]};
`;

const BadgeContainer = styled.View`
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.gray[300]};
  background: ${(props) => props.theme.gray[900]}88;
  padding: ${(props: any) => props.theme.spacing[1]};
  margin-left: ${(props: any) => props.theme.spacing[1]};
`;
