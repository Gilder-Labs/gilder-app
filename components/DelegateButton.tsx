import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Typography } from "./Typography";
import { useTheme } from "styled-components";
import { abbreviatePublicKey } from "../utils";
import { useQuery, gql } from "@apollo/client";
import { getColorType } from "../utils";
import { LinearGradient } from "expo-linear-gradient";
import { AnimatedImage } from "react-native-ui-lib";
import numeral from "numeral";
import { useAppSelector } from "../hooks/redux";
import * as Unicons from "@iconscout/react-native-unicons";

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
  const { selectedRealm } = useAppSelector((state) => state.realms);
  const { walletToVoteMap } = useAppSelector((state) => state.proposals);
  const identityName = data?.identity?.social?.twitter
    ? data?.identity?.social?.twitter
    : data?.identity?.domain;

  const avatarUrl = data?.identity?.avatar;

  const color = getColorType(memberPublicKey);
  const color2 = getColorType(memberPublicKey.slice(-1) || "string");

  const getVoteFormatted = (votes: string) => {
    let voteString = votes;
    let mintDecimals = isCommunityVote
      ? selectedRealm?.communityMintDecimals
      : selectedRealm?.councilMintDecimals;

    if (!mintDecimals || mintDecimals === 0) {
      return numeral(Number(votes)).format("0,0");
    }

    voteString = voteString.slice(0, -mintDecimals);
    return numeral(Number(voteString)).format("0,0");
  };

  const delegatesVote = walletToVoteMap[memberPublicKey];
  const isYesVote = delegatesVote?.voteWeightYes ? true : false;

  return (
    <DelegateButtonContainer
      isSelected={isSelected}
      onPress={onPress}
      disabled={!!delegatesVote}
    >
      <IconContainer color={color}>
        <LinearGradient
          // Background Linear Gradient
          colors={[`${theme[color][500]}`, `${theme[color2][900]}`]}
          style={{ height: 32, width: 32 }}
          start={{ x: 0.1, y: 0.2 }}
        >
          {!!avatarUrl && (
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
          )}
        </LinearGradient>
      </IconContainer>
      <Typography
        text={
          identityName ? identityName : abbreviatePublicKey(memberPublicKey)
        }
        size="caption"
        shade={"400"}
      />

      <Row>
        {delegatesVote && isYesVote && (
          <Unicons.UilCheckCircle
            size="20"
            color={theme.success[400]}
            style={{ marginRight: 4 }}
          />
        )}
        {delegatesVote && !isYesVote && (
          <Unicons.UilTimesCircle
            size="20"
            color={theme.error[400]}
            style={{ marginRight: 4 }}
          />
        )}
        <Typography
          text={`${
            isCommunityVote
              ? getVoteFormatted(delegate?.communityDepositAmount)
              : getVoteFormatted(delegate?.councilDepositAmount)
          }
        `}
          size="body"
          bold={true}
          marginBottom="0"
          shade={"300"}
        />
      </Row>
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

const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const DelegateButtonContainer = styled.TouchableOpacity<{
  isSelected: boolean;
  disabled?: boolean;
}>`
  opacity: ${(props: any) => (props.disabled ? 0.5 : 1)};
  height: 120px;
  width: 120px;
  margin-left: ${(props: any) => props.theme.spacing[1]};
  margin-right: ${(props: any) => props.theme.spacing[1]};
  border-radius: 4px;
  align-items: center;
  background: ${(props: any) =>
    props.disabled ? props.theme.gray[800] : props.theme.gray[900]};
  padding: ${(props: any) => props.theme.spacing[2]};
  padding-top: ${(props: any) => props.theme.spacing[4]};
  border: ${(props: any) =>
    props.isSelected
      ? `2px solid  ${props.theme.secondary[700]}`
      : "2px solid transparent"};
`;
