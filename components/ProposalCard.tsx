import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Badge } from ".";
import { format } from "date-fns";

interface ProposalCardProps {
  proposal: any;
}

// "success" | "pending" | "error";

const proposalStatusKey = {
  Succeeded: "success",
  Completed: "success",
  Cancelled: "error",
  Draft: "pending",
  Executing: "pending",
  Voting: "pending",
  Defeated: "error",
};

export const ProposalCard = ({ proposal }: ProposalCardProps) => {
  const {
    status,
    name,
    description,
    getStateTimestamp,
    getYesVoteCount,
    getNoVoteCount,
  } = proposal;
  const transactionDate = getStateTimestamp
    ? format(getStateTimestamp * 1000, "LLL cc, yyyy")
    : "";

  // @ts-ignore
  const badgeStatus = proposalStatusKey[status];

  return (
    <Container>
      <IconContainer>
        <TextContainer>
          <MemberName>{name}</MemberName>

          <Badge title={status} type={badgeStatus} />
          <Description>{description}</Description>
          <Description>{transactionDate}</Description>
          <Description>{`Votes Yes ${getYesVoteCount}`}</Description>
          <Description>{`Votes Yes ${getNoVoteCount}`}</Description>
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
  font-size: 16px;
  margin-bottom:  ${(props: any) => props.theme.spacing[2]};
`;

const TextContainer = styled.View`
  margin-left: ${(props: any) => props.theme.spacing[2]};
`;

const Description = styled.Text`
  color: ${(props: any) => props.theme.gray[300]};
`;

const IconContainer = styled.View`
  /* border-radius: 100px, */
  flex-direction: row;
  align-items: center;
`;
