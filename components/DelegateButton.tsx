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
import { useCardinalIdentity } from "../hooks/useCardinaldentity";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleCheck } from "@fortawesome/pro-regular-svg-icons/faCircleCheck";
import { faCheck } from "@fortawesome/pro-solid-svg-icons/faCheck";

import { faCircleXmark } from "@fortawesome/pro-regular-svg-icons/faCircleXmark";

interface ButtonProps {
  onPress(): void;
  isSelected: boolean;
  memberPublicKey: string;
  delegate: Member;
  isCommunityVote: boolean;
  isProposalFlow?: boolean;
}

// const GET_CYBERCONNECT_IDENTITY = gql`
//   query FullIdentityQuery($publicKey: String!) {
//     identity(address: $publicKey, network: SOLANA) {
//       address
//       domain
//       social {
//         twitter
//       }
//       avatar
//     }
//   }
// `;

export const DelegateButton = ({
  onPress,
  isSelected,
  memberPublicKey,
  delegate,
  isCommunityVote,
  isProposalFlow = false,
}: ButtonProps) => {
  const theme = useTheme();
  // const { loading, error, data } = useQuery(GET_CYBERCONNECT_IDENTITY, {
  //   variables: { publicKey: memberPublicKey },
  // });
  const { selectedRealm } = useAppSelector((state) => state.realms);
  const { walletToVoteMap } = useAppSelector((state) => state.proposals);
  const { twitterURL, twitterHandle } = useCardinalIdentity(memberPublicKey);

  const identityName = twitterHandle;
  const avatarUrl = twitterURL;

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

  const delegatesVote = walletToVoteMap?.[memberPublicKey];
  const isYesVote = delegatesVote?.voteWeightYes ? true : false;

  return (
    <DelegateButtonContainer
      isSelected={isSelected}
      onPress={onPress}
      disabled={!!delegatesVote && !isProposalFlow}
    >
      <IconContainer>
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
        marginBottom="0"
      />

      <Row>
        {delegatesVote && isYesVote && !isProposalFlow && (
          <FontAwesomeIcon
            size={16}
            icon={faCircleCheck}
            color={theme.success[400]}
            style={{ marginRight: 4 }}
          />
        )}
        {delegatesVote && !isYesVote && !isProposalFlow && (
          <FontAwesomeIcon
            size={16}
            icon={faCircleXmark}
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
          textAlign="center"
          size="body"
          bold={true}
          marginBottom="0"
          shade={"300"}
        />
      </Row>
      {isSelected && (
        <SelectedContainer>
          <FontAwesomeIcon
            icon={faCheck}
            size={12}
            color={`${theme.gray[200]}`}
          />
        </SelectedContainer>
      )}
    </DelegateButtonContainer>
  );
};

const IconContainer = styled.View<{ color: string }>`
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  border: 2px solid ${(props: any) => props.theme.gray[900]};
  border-radius: 100px;
  margin-bottom: ${(props: any) => props.theme.spacing[1]};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  height: 24px;
  justify-content: center;
`;

const SelectedContainer = styled.View`
  background: ${(props: any) => props.theme.gray[600]}88;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 8px;
  padding: 4px;

  top: 8px;
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
`;
