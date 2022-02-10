import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { SvgXml } from "react-native-svg";

import { useTheme } from "styled-components";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-jdenticon-sprites";
import { LinearGradient } from "expo-linear-gradient";
import * as Unicons from "@iconscout/react-native-unicons";

interface MemberCardProps {
  member: any;
}

export const MemberCard = ({ member }: MemberCardProps) => {
  const theme = useTheme();

  let jdenticonSvg = createAvatar(style, {
    seed: member.governingTokenOwner,
    // ... and other options
  });

  return (
    <Container>
      <LinearGradient
        // Background Linear Gradient
        colors={[`${theme.primary[600]}44`, `${theme.primary[800]}44`]}
        style={{ height: 48, flex: 1, width: "100%" }}
        start={{ x: 0.1, y: 0.2 }}
      ></LinearGradient>
      <IconContainer>
        <SvgXml xml={jdenticonSvg} width="44px" height="44px" />
      </IconContainer>
      <ContentContainer>
        <MemberName>{`${member.governingTokenOwner.slice(
          0,
          4
        )}...${member.governingTokenOwner.slice(0, 4)}`}</MemberName>

        <TextContainer>
          <VotesCast>Total Votes Cast: {member.totalVotesCount}</VotesCast>
          <VotesCast>Vote weight: {member.depositAmount}</VotesCast>
        </TextContainer>
      </ContentContainer>
    </Container>
  );
};

//           <VotesCast>Vote weight: {member.depositAmount}</VotesCast>

const Container = styled.View`
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 4px;
  background: ${(props: any) => props.theme.gray[800]};
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const ContentContainer = styled.View`
  padding: ${(props: any) => props.theme.spacing[5]};
  width: 100%;
  /* justify-content: space-between; */
`;

const MemberName = styled.Text`
  color: ${(props: any) => props.theme.gray[100]}
  font-weight: bold;
  font-size: 18px;
  margin-top:${(props: any) => props.theme.spacing[2]};
  margin-bottom: ${(props: any) => props.theme.spacing[3]};

`;

const TextContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const VotesCast = styled.Text`
  color: ${(props: any) => props.theme.gray[300]};
`;

const IconContainer = styled.View`
  /* border-radius: 100px, */
  background: ${(props: any) => props.theme.primary[800]};
  flex-direction: row;
  align-items: center;
  position: absolute;
  left: 20px;
  top: 24px;
  overflow: hidden;
  border: 2px solid black;
  border-radius: 100px;
`;
