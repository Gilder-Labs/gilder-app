import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { SvgXml } from "react-native-svg";
import { useTheme } from "styled-components";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-jdenticon-sprites";
import { LinearGradient } from "expo-linear-gradient";
import * as Unicons from "@iconscout/react-native-unicons";
import { getColorType, abbreviatePublicKey } from "../utils";

interface MemberCardProps {
  member: any;
  onSelect: any;
  realm: any;
}

export const MemberCard = ({ member, onSelect, realm }: MemberCardProps) => {
  const theme = useTheme();

  let jdenticonSvg = createAvatar(style, {
    seed: member.walletId,
    // ... and other options
  });

  const color = getColorType(member.walletId);

  return (
    <Container>
      <LinearGradient
        // Background Linear Gradient
        colors={[`${theme[color][600]}66`, `${theme[color][800]}66`]}
        style={{ height: 48, flex: 1, width: "100%" }}
        start={{ x: 0.1, y: 0.2 }}
      ></LinearGradient>
      <IconContainer color={color}>
        <SvgXml xml={jdenticonSvg} width="44px" height="44px" />
      </IconContainer>
      <ContentContainer>
        <TitleRow>
          <MemberName>{abbreviatePublicKey(member.walletId)}</MemberName>
          <IconButton onPress={onSelect} activeOpacity={0.5}>
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
              {member?.communityDepositUiAmount
                ? member?.communityDepositUiAmount
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

const MemberName = styled.Text`
  color: ${(props: any) => props.theme.gray[300]}
  font-weight: bold;
  font-size: 18px;
  margin-top:${(props: any) => props.theme.spacing[4]};
  margin-bottom: ${(props: any) => props.theme.spacing[3]};

`;

const TextContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
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
