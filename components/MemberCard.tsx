import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { SvgXml } from "react-native-svg";
import { useTheme } from "styled-components";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-jdenticon-sprites";
import { LinearGradient } from "expo-linear-gradient";
import * as Unicons from "@iconscout/react-native-unicons";
import numeral from "numeral";
import { getColorType, abbreviatePublicKey } from "../utils";
import { formatVoteWeight } from "../utils";

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
    <Container onPress={onSelect}>
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
        <MemberName>{abbreviatePublicKey(member.walletId)}</MemberName>

        <TextContainer>
          <DetailContainer>
            <SubtitleText>Total Votes</SubtitleText>
            <VotesCast>{member.totalVotesCount}</VotesCast>
          </DetailContainer>
          <DetailContainer>
            <SubtitleText>Council Votes</SubtitleText>
            <VoteWeight>
              {member?.councilDepositUiAmount
                ? member?.councilDepositUiAmount
                : 0}
            </VoteWeight>
          </DetailContainer>
          <DetailContainer>
            <SubtitleText style={{ textAlign: "right" }}>
              Community Votes
            </SubtitleText>
            <VoteWeight>
              {member?.communityDepositUiAmount
                ? member?.communityDepositUiAmount
                : 0}
            </VoteWeight>
          </DetailContainer>
        </TextContainer>
      </ContentContainer>
    </Container>
  );
};

const Container = styled.TouchableOpacity`
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
