import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Badge } from "./Badge";
import { format } from "date-fns";
import numeral from "numeral";

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

  // @ts-ignore
  const yesVotes = Number(getYesVoteCount);
  const noVotes = Number(getNoVoteCount);

  const totalVotes = yesVotes + noVotes;

  const yesPercentage = yesVotes
    ? Math.round((yesVotes / totalVotes) * 100)
    : 0;
  const noPercentage = noVotes ? Math.round((noVotes / totalVotes) * 100) : 0;
  // console.log("yes votes", yesPercentage);

  const dateTimestamp = proposal?.votingCompletedAt || getStateTimestamp;

  return (
    <Container>
      <TextContainer>
        <ProposalTitle>{name}</ProposalTitle>
      </TextContainer>
      <BadgeRow>
        <DateText>{format(dateTimestamp * 1000, "MMM d, yyyy - p")}</DateText>
        {/* @ts-ignore */}
        <Badge title={status} type={proposalStatusKey[status]} />
      </BadgeRow>
      <Description>{description}</Description>
      <VoteCountRow>
        <VoteText>
          YES - {numeral(yesVotes).format("0.00a")} ({yesPercentage}%)
        </VoteText>
        <VoteText>
          NO - {numeral(noVotes).format("0.00a")} ({noPercentage}%)
        </VoteText>
      </VoteCountRow>
      <VoteContainer>
        <VoteYes percent={yesPercentage} />
        <VoteNo percent={noPercentage} />
      </VoteContainer>
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
  justify-content: space-between;
  /* align-items: center; */
  margin-bottom: ${(props: any) => props.theme.spacing[2]};
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
  /* margin-bottom: ${(props: any) => props.theme.spacing[2]}; */
`;

const Description = styled.Text`
  color: ${(props: any) => props.theme.gray[200]};
  margin-bottom: ${(props: any) => props.theme.spacing[2]};
  line-height: 20px;
  font-size: 14px;
`;

const VoteContainer = styled.View`
  flex-direction: row;
  background: ${(props: any) => props.theme.gray[600]};
  border-radius: 2px;
`;

const VoteNo = styled.View<{ percent: any }>`
  width: ${(props) => props.percent}%;
  height: 8px;
  background: ${(props) => props.theme.error[300]};

  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
`;
const VoteYes = styled.View<{ percent: any }>`
  width: ${(props) => props.percent}%;
  height: 8px;
  background: ${(props) => props.theme.success[300]};
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
`;

const VoteCountRow = styled.View`
  justify-content: space-between;
  flex-direction: row;
`;

const VoteText = styled.Text`
  color: ${(props: any) => props.theme.gray[300]};
  margin-bottom: ${(props: any) => props.theme.spacing[2]};
  font-size: 12px;
`;
