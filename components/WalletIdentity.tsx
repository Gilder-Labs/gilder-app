import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Typography } from "./Typography";
import { useTheme } from "styled-components";
import { abbreviatePublicKey } from "../utils";
import { getColorType } from "../utils";
import { LinearGradient } from "expo-linear-gradient";
import { AnimatedImage } from "react-native-ui-lib";
import { useCardinalIdentity } from "../hooks/useCardinaldentity";
import { useNavigation } from "@react-navigation/native";

interface WalletIdentity {
  memberPublicKey: string;
  shade?: "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
  size?: "h1" | "h2" | "h3" | "h4" | "body" | "subtitle" | "caption";
  avatarSize?: number;
}

export const WalletIdentity = ({
  memberPublicKey,
  shade = "100",
  size = "body",
  avatarSize = 32,
}: WalletIdentity) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const { twitterURL, twitterHandle } = useCardinalIdentity(memberPublicKey);

  const identityName = twitterHandle;
  const avatarUrl = twitterURL;

  const color = getColorType(memberPublicKey);
  const color2 = getColorType(memberPublicKey.slice(-1) || "string");

  const handleMemberSelect = () => {
    //@ts-ignore
    navigation.push("MemberDetails", {
      walletId: memberPublicKey,
    });
  };

  return (
    <WalletIdentityContainer onPress={() => handleMemberSelect()}>
      <IconContainer color={color}>
        <LinearGradient
          // Background Linear Gradient
          colors={[`${theme[color][500]}`, `${theme[color2][900]}`]}
          style={{ height: avatarSize, width: avatarSize }}
          start={{ x: 0.1, y: 0.2 }}
        >
          {!!avatarUrl && (
            <AnimatedImage
              style={{
                width: avatarSize,
                height: avatarSize,
                overflow: "hidden",
              }}
              source={{
                uri: avatarUrl,
              }}
            />
          )}
        </LinearGradient>
      </IconContainer>
      <Typography
        text={
          identityName ? identityName : abbreviatePublicKey(memberPublicKey)
        }
        size={size}
        shade={shade}
        bold={true}
      />
    </WalletIdentityContainer>
  );
};

const IconContainer = styled.View<{ color: string }>`
  background: ${(props: any) => props.theme[props.color][800]};
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  border: 1px solid ${(props: any) => props.theme.gray[900]};
  border-radius: 100px;
  margin-bottom: ${(props: any) => props.theme.spacing[1]};
  margin-right: ${(props: any) => props.theme.spacing[2]};
`;

const WalletIdentityContainer = styled.TouchableOpacity`
  border-radius: 4px;
  align-items: center;
  flex-direction: row;
`;
