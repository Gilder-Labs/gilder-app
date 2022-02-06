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
      <TextContainer>
        <ProposalTitle>{name}</ProposalTitle>
      </TextContainer>
      <BadgeRow>
        <DateText>{transactionDate}</DateText>
        <Badge title={status} type={badgeStatus} />
      </BadgeRow>
      <Description>{description}</Description>
      <Description>{`Votes Yes ${getYesVoteCount}`}</Description>
      <Description>{`Votes Yes ${getNoVoteCount}`}</Description>
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
  flex-direction: column;
`;

const BadgeRow = styled.View`
  flex-direction: row;
  flex: 1;
  width: auto;
  justify-content: space-between;
`;

const ProposalTitle = styled.Text`
  color: ${(props: any) => props.theme.gray[100]}
  font-weight: bold;
  font-size: 16px;
`;

const DateText = styled.Text`
  color: ${(props: any) => props.theme.gray[400]}
  font-weight: bold;
  font-size: 12px;
`;

const TextContainer = styled.View`
  padding-bottom: ${(props: any) => props.theme.spacing[2]};
  margin-bottom: ${(props: any) => props.theme.spacing[2]};

  border-bottom-color: ${(props) => props.theme.gray[500]};
  border-bottom-width: 1px;
`;

const Description = styled.Text`
  color: ${(props: any) => props.theme.gray[200]};
`;
