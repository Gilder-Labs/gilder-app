import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Typography } from "./Typography";
import { useTheme } from "styled-components";
import { abbreviatePublicKey } from "../utils";
import { useQuery, gql } from "@apollo/client";
import { getColorType } from "../utils";
import { LinearGradient } from "expo-linear-gradient";
import { AnimatedImage } from "react-native-ui-lib";

interface ButtonProps {
  onPress(): void;
  isSelected: boolean;
  memberPublicKey: string;
  delegate: Member;
  isCommunityVote: boolean;
}

const GET_CYBERCONNECT_IDENTITY = gql`
  query FullIdentityQuery($publicKey: String!) {
    identity(address: $publicKey, network: SOLANA) {
      address
      domain
      social {
        twitter
      }
      avatar
    }
  }
`;

export const DelegateButton = ({
  onPress,
  isSelected,
  memberPublicKey,
  delegate,
  isCommunityVote,
}: ButtonProps) => {
  const theme = useTheme();
  const { loading, error, data } = useQuery(GET_CYBERCONNECT_IDENTITY, {
    variables: { publicKey: memberPublicKey },
  });

  const identityName = data?.identity?.social?.twitter
    ? data?.identity?.social?.twitter
    : data?.identity?.domain;

  const avatarUrl = data?.identity?.avatar;

  const color = getColorType(memberPublicKey);
  const color2 = getColorType(memberPublicKey.slice(-1) || "string");

  return (
    <DelegateButtonContainer isSelected={isSelected} onPress={onPress}>
      {avatarUrl ? (
        <IconContainer color={color}>
          <AnimatedImage
            style={{
              width: 32,
              height: 32,
              overflow: "hidden",
            }}
            source={{
              uri: avatarUrl,
            }}
          />
        </IconContainer>
      ) : (
        <IconContainer color={color}>
          <LinearGradient
            // Background Linear Gradient
            colors={[`${theme[color][500]}`, `${theme[color2][900]}`]}
            style={{ height: 32, width: 32 }}
            start={{ x: 0.1, y: 0.2 }}
          ></LinearGradient>
        </IconContainer>
      )}
      <Typography
        text={
          identityName ? identityName : abbreviatePublicKey(memberPublicKey)
        }
        size="caption"
        shade={"300"}
      />
      <Typography
        text={`${
          isCommunityVote
            ? delegate.communityDepositUiAmount
            : delegate.councilDepositUiAmount
        }
        `}
        textAlign="center"
        size="body"
        bold={true}
        shade={"300"}
      />
    </DelegateButtonContainer>
  );
};

const IconContainer = styled.View<{ color: string }>`
  background: ${(props: any) => props.theme[props.color][800]};
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  border: 2px solid ${(props: any) => props.theme.gray[900]};
  border-radius: 100px;
  margin-bottom: ${(props: any) => props.theme.spacing[1]};
`;

const DelegateButtonContainer = styled.TouchableOpacity<{
  isSelected: boolean;
}>`
  height: 120px;
  width: 120px;
  margin-left: ${(props: any) => props.theme.spacing[1]};
  margin-right: ${(props: any) => props.theme.spacing[1]};
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  background: ${(props: any) => props.theme.gray[900]};
  padding: ${(props: any) => props.theme.spacing[2]};
  border: ${(props: any) =>
    props.isSelected
      ? `1px solid  ${props.theme.secondary[500]}`
      : "1px solid transparent"};
`;
