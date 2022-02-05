import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { createAvatar } from "@dicebear/avatars";

interface ProposalCardProps {
  proposal: any;
}

export const ProposalCard = ({ proposal }: ProposalCardProps) => {
  return (
    <Container>
      <IconContainer>
        <TextContainer>
          <MemberName>{proposal.name}</MemberName>
          <VotesCast>{proposal.description}</VotesCast>
        </TextContainer>
      </IconContainer>
    </Container>
  );
};

const Container = styled.View`
  /* height: 80px; */
  width: 100%%;
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 4px;
  background: ${(props: any) => props.theme.gray[800]};
  padding: ${(props: any) => props.theme.spacing[4]};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const MemberName = styled.Text`
  color: ${(props: any) => props.theme.gray[100]}
  font-weight: bold;
  margin-bottom:  ${(props: any) => props.theme.spacing[2]};
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
