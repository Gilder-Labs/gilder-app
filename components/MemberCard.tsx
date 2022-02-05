import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { SvgXml } from "react-native-svg";

import { FontAwesome5 as FontAwesome } from "@expo/vector-icons";
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
      <TextContainer>
        <IconContainer>
          <SvgXml xml={jdenticonSvg} width="44px" height="44px" />
        </IconContainer>
        <MemberName>{`${member.governingTokenOwner.slice(
          0,
          5
        )}...${member.governingTokenOwner.slice(0, 5)}`}</MemberName>
        <MemberName>{member.totalVotesCount}</MemberName>
      </TextContainer>
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

const TextContainer = styled.View``;

const IconContainer = styled.View`
  /* border-radius: 100px, */
`;
