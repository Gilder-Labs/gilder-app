import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { SvgXml } from "react-native-svg";

import { useTheme } from "styled-components";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-jdenticon-sprites";

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
      <IconContainer>
        <SvgXml xml={jdenticonSvg} width="36px" height="36px" />
        <TextContainer>
          <VotesCast>Total Votes Cast: {member.totalVotesCount}</VotesCast>
          <VotesCast>Vote weight: {member.depositAmount}</VotesCast>
        </TextContainer>
      </IconContainer>
      <MemberName>{`${member.governingTokenOwner.slice(
        0,
        4
      )}...${member.governingTokenOwner.slice(0, 4)}`}</MemberName>
    </Container>
  );
};

const Container = styled.View`
  height: 80px;
  width: 100%%;
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 4px;
  background: ${(props: any) => props.theme.gray[800]};
  padding-left: ${(props: any) => props.theme.spacing[4]};
  padding-right: ${(props: any) => props.theme.spacing[4]};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const MemberName = styled.Text`
  color: ${(props: any) => props.theme.gray[100]}
  font-weight: bold;

`;

const TextContainer = styled.View`
  margin-left: ${(props: any) => props.theme.spacing[2]};
`;

const VotesCast = styled.Text`
  color: ${(props: any) => props.theme.gray[300]};
`;

const IconContainer = styled.View`
  /* border-radius: 100px, */
  flex-direction: row;
  align-items: center;
`;
