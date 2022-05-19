import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { LinearGradient } from "expo-linear-gradient";
import * as Unicons from "@iconscout/react-native-unicons";
import { getColorType } from "../utils";
import { useQuery, gql } from "@apollo/client";
import { Typography } from "../components";
import { AnimatedImage } from "react-native-ui-lib";
import { formatVoteWeight } from "../utils";
import { useAppSelector } from "../hooks/redux";
import { PublicKeyTextCopy } from "./PublicKeyTextCopy";

interface MemberCardProps {
  member: any;
  onSelect: any;
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

export const MemberCard = ({ member, onSelect }: MemberCardProps) => {
  const theme = useTheme();
  // Fetch cyberconnect wallet data
  const { loading, error, data } = useQuery(GET_CYBERCONNECT_IDENTITY, {
    variables: { publicKey: member.walletId },
  });
  const { selectedRealm } = useAppSelector((state) => state.realms);

  const color = getColorType(member.walletId);
  const color2 = getColorType(member?.walletId.slice(-1) || "string");

  const identityName = data?.identity?.social?.twitter
    ? data?.identity?.social?.twitter
    : data?.identity?.domain;

  const avatarUrl = data?.identity?.avatar;

  const handleProfileClick = () => {
    onSelect({ name: identityName, avatarUrl: avatarUrl });
  };

  // console.log("member", member);

  return (
    <Container>
      <LinearGradient
        // Background Linear Gradient
        colors={[`${theme[color][500]}44`, `${theme[color][700]}aa`]}
        style={{ height: 48, flex: 1, width: "100%" }}
        start={{ x: 0.1, y: 0.2 }}
      ></LinearGradient>
      {avatarUrl ? (
        <IconContainer color={color}>
          <AnimatedImage
            style={{
              width: 44,
              height: 44,
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
            style={{ height: 44, width: 44 }}
            start={{ x: 0.1, y: 0.2 }}
          ></LinearGradient>
        </IconContainer>
      )}
      <ContentContainer>
        <TitleRow>
          <Column>
            <MemberNameContainer>
              {identityName ? (
                <Typography
                  text={identityName}
                  shade="300"
                  size="h4"
                  bold={true}
                  marginBottom={"0"}
                />
              ) : (
                <PublicKeyTextCopy
                  shade="300"
                  size="h4"
                  publicKey={member.walletId}
                  noPadding={true}
                  hideIcon={true}
                  bold={true}
                />
              )}
              {identityName ? (
                <PublicKeyTextCopy
                  shade="500"
                  size="subtitle"
                  publicKey={member.walletId}
                  noPadding={true}
                  hideIcon={true}
                />
              ) : null}
            </MemberNameContainer>
          </Column>
          <IconButton onPress={handleProfileClick} activeOpacity={0.5}>
            <Unicons.UilAngleDoubleRight size="28" color={theme.gray[400]} />
          </IconButton>
        </TitleRow>

        <TextContainer>
          <DetailContainer>
            <SubtitleText>Community Votes</SubtitleText>
            <VotesCast>
              {member.totalVotesCommunity ? member.totalVotesCommunity : 0}
            </VotesCast>
          </DetailContainer>

          <DetailContainer>
            <SubtitleText style={{ textAlign: "right" }}>
              Vote Weight
            </SubtitleText>
            <VoteWeight>
              {member?.communityDepositAmount &&
              selectedRealm?.communityMintDecimals
                ? formatVoteWeight(
                    member.communityDepositAmount,
                    selectedRealm?.communityMintDecimals
                  )
                : 0}
            </VoteWeight>
          </DetailContainer>
        </TextContainer>
        {member?.councilDepositUiAmount && (
          <TextContainer style={{ marginTop: 4 }}>
            <DetailContainer>
              <SubtitleText>Council Votes</SubtitleText>
              <VotesCast>{member.totalVotesCouncil}</VotesCast>
            </DetailContainer>
            <DetailContainer>
              <SubtitleText>Council Vote Weight</SubtitleText>
              <VoteWeight>{member?.councilDepositUiAmount}</VoteWeight>
            </DetailContainer>
          </TextContainer>
        )}
      </ContentContainer>
    </Container>
  );
};

const Container = styled.View`
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 4px;
  background: ${(props: any) => props.theme.gray[800]};
  align-items: center;
  justify-content: space-between;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
`;

const ContentContainer = styled.View`
  padding: ${(props: any) => props.theme.spacing[3]};
  padding-left: ${(props: any) => props.theme.spacing[5]};
  padding-right: ${(props: any) => props.theme.spacing[5]};
  width: 100%;
  /* justify-content: space-between; */
`;

const MemberNameContainer = styled.View`
  margin-top: ${(props: any) => props.theme.spacing[4]};
  align-items: flex-start;
`;

const TextContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const Column = styled.View`
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  align-items: flex-start;
`;

const VotesCast = styled.Text`
  color: ${(props: any) => props.theme.gray[100]};
  font-size: 24px;
  font-weight: bold;
`;

const VoteWeight = styled.Text`
  color: ${(props: any) => props.theme.gray[100]};
  font-size: 24px;
  font-weight: bold;
  text-align: right;
`;

const DetailContainer = styled.View``;

const SubtitleText = styled.Text`
  color: ${(props: any) => props.theme.gray[400]};
  font-size: 12px;
`;

const IconContainer = styled.View<{ color: string }>`
  /* border-radius: 100px, */
  background: ${(props: any) => props.theme[props.color][800]};
  flex-direction: row;
  align-items: center;
  position: absolute;
  left: 20px;
  top: 24px;
  overflow: hidden;
  border: 2px solid ${(props: any) => props.theme.gray[900]};
  border-radius: 100px;
`;

const IconButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 100px;
  background: ${(props: any) => props.theme.gray[700]};
  /* margin-left: ${(props: any) => props.theme.spacing[3]}; */
`;

const TitleRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
