import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Badge } from "./Badge";
import { format, getUnixTime, formatDistance } from "date-fns";
import numeral from "numeral";
import BigNumber from "big-number";

interface ProposalCardProps {
  proposal: any;
  onClick: any;
  governance: any;
  communityMintSupply: string;
  communityMintDecimals: number;
  voteThresholdPercentage: number;
  // councilToken: Token;
}

// "success" | "pending" | "error";

const proposalStatusKey = {
  Succeeded: "success",
  Completed: "success",
  Cancelled: "gray",
  Draft: "warning",
  Executing: "pending",
  Voting: "pending",
  Defeated: "error",
};

export const ProposalCard = ({
  proposal,
  onClick,
  governance,
  communityMintSupply,
  communityMintDecimals,
  voteThresholdPercentage,
}: ProposalCardProps) => {
  const {
    status,
    name,
    getStateTimestamp,
    getYesVoteCount,
    getNoVoteCount,
    isPreVotingState,
    votingAt,
  } = proposal;

  // @ts-ignore
  const yesVotes = Number(getYesVoteCount);
  const noVotes = Number(getNoVoteCount);

  const totalVotes = yesVotes + noVotes;

  const yesPercentage = yesVotes
    ? Math.round((yesVotes / totalVotes) * 100)
    : 0;
  const noPercentage = noVotes ? Math.round((noVotes / totalVotes) * 100) : 0;

  const dateTimestamp = proposal?.votingCompletedAt || getStateTimestamp;

  // const minimumYesVotes =
  //   fmtTokenAmount(maxVoteWeight, proposalMint.decimals) *
  //   (voteThresholdPct / 100)

  //   const yesVotesRequired =
  // proposalMint.decimals == 0
  // ? Math.ceil(rawYesVotesRequired)
  // : rawYesVotesRequired

  const getTimeToVoteEnd = () => {
    const now = getUnixTime(new Date());

    let timeToVoteEnd = isPreVotingState
      ? governance?.maxVotingTime
      : (votingAt ?? 0) + governance?.maxVotingTime - now;

    if (timeToVoteEnd <= 0) {
      return 0;
    }

    const days = Math.floor(timeToVoteEnd / 86400);
    timeToVoteEnd -= days * 86400;

    const hours = Math.floor(timeToVoteEnd / 3600) % 24;
    timeToVoteEnd -= hours * 3600;

    const minutes = Math.floor(timeToVoteEnd / 60) % 60;
    timeToVoteEnd -= minutes * 60;

    const seconds = Math.floor(timeToVoteEnd % 60);
    return { days, hours, minutes, seconds };
  };

  const getVoteFormatted = (votes: string) => {
    let voteString;
    voteString = votes.slice(0, -communityMintDecimals);

    return numeral(Number(voteString)).format("0,0");
  };

  const getQuorum = () => {
    const communityMintSupplyFormatted = communityMintSupply.slice(
      0,
      -communityMintDecimals
    );
    const yesVoteFormatted = Number(
      getYesVoteCount.slice(0, -communityMintDecimals)
    );

    const totalVotes =
      Number(communityMintSupplyFormatted) * (voteThresholdPercentage * 0.01);

    const totalVotesNeeded = totalVotes - yesVoteFormatted;
    let totalVotesNeededPercentage = (yesVoteFormatted / totalVotes) * 100;
    totalVotesNeededPercentage =
      totalVotesNeededPercentage > 100 ? 100 : totalVotesNeededPercentage;

    return {
      votesNeeded: numeral(Number(totalVotesNeeded)).format("0,0"),
      totalVotesNeededPercentage: totalVotesNeededPercentage,
    };
  };

  const quorumData = getQuorum();

  const timeLeft = getTimeToVoteEnd();
  const isVoting = status === "Voting";

  return (
    <Container isVoting={status === "Voting"} onPress={onClick}>
      <TextContainer>
        <ProposalTitle>{name}</ProposalTitle>
        <Badge title={status} type={proposalStatusKey[status]} />
      </TextContainer>
      <ProposalSubData>
        <DateText>{format(dateTimestamp * 1000, "MMM d, yyyy - p")}</DateText>
        {isVoting ? (
          <TimeContainer>
            <StatusText>Ends in </StatusText>
            <TimeText>
              {timeLeft.days && `${timeLeft.days}d: `}
              {timeLeft.hours && `${timeLeft.hours}h: `}
              {timeLeft.minutes && `${timeLeft.minutes}m`}
            </TimeText>
          </TimeContainer>
        ) : (
          <StatusText>
            {status}{" "}
            {formatDistance(getStateTimestamp * 1000, new Date(), {
              addSuffix: true,
            })}
          </StatusText>
        )}
      </ProposalSubData>
      {isVoting && (
        <Votes>
          <VoteCountRow>
            <VoteColumn>
              <ApproveText>Yes</ApproveText>
              <VoteText>
                {getVoteFormatted(getYesVoteCount)} ({yesPercentage}%)
              </VoteText>
            </VoteColumn>
            <VoteColumn>
              <ApproveText style={{ textAlign: "right" }}>No</ApproveText>
              <VoteText>
                {getVoteFormatted(getNoVoteCount)} ({noPercentage}%)
              </VoteText>
            </VoteColumn>
          </VoteCountRow>
          <VoteContainer>
            <VoteYes percent={yesPercentage} />
            <VoteNo percent={noPercentage} />
          </VoteContainer>

          {/* Quorum row */}
          <VoteCountRow>
            <VoteColumn>
              <ApproveText>Approval Quorum</ApproveText>
              <VoteText>
                {Number(quorumData.votesNeeded) < 0
                  ? "Quorum Reached"
                  : `${quorumData.votesNeeded} yes votes still needed.`}
              </VoteText>
            </VoteColumn>
          </VoteCountRow>
          <QuorumContainer>
            <VoteYes percent={quorumData.totalVotesNeededPercentage} />
          </QuorumContainer>
        </Votes>
      )}
    </Container>
  );
};

const Container = styled.TouchableOpacity<{ isVoting: boolean }>`
  /* height: 80px; */
  width: 100%%;
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 8px;
  background: ${(props: any) => props.theme.gray[800]};
  flex-direction: column;
  /* border: ${(props: any) =>
    props.isVoting
      ? `2px solid ${props.theme.gray[400]}}`
      : "2px solid transparent"}; */
`;

const ProposalSubData = styled.View`
  justify-content: flex-start;
  padding-left: ${(props: any) => props.theme.spacing[4]};
  padding-right: ${(props: any) => props.theme.spacing[4]};
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  align-items: flex-start;
`;

const ProposalTitle = styled.Text`
  color: ${(props: any) => props.theme.gray[100]}
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  flex-wrap: wrap;
  max-width: 240px;
  padding-right: ${(props: any) => props.theme.spacing[2]};
`;

const DateText = styled.Text`
  color: ${(props: any) => props.theme.gray[500]}
  font-weight: bold;
  font-size: 12px;
  margin-bottom:  ${(props: any) => props.theme.spacing[2]};
`;

const StatusText = styled.Text`
  color: ${(props: any) => props.theme.gray[300]}
  font-size: 16px;
`;

const TextContainer = styled.View`
  padding: ${(props: any) => props.theme.spacing[4]};
  padding-bottom: ${(props: any) => props.theme.spacing[1]};
  flex-direction: row;
  justify-content: space-between;
  /* margin-bottom: ${(props: any) => props.theme.spacing[2]}; */
`;

const TimeContainer = styled.View`
  flex: 1;
  border-radius: 4px;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`;

const TimeText = styled.Text`
  color: ${(props: any) => props.theme.gray[300]};
  font-size: 16px;
  font-weight: bold;
`;

const VoteContainer = styled.View`
  flex-direction: row;
  background: ${(props: any) => props.theme.gray[900]};
  border-radius: 2px;
  margin-bottom: ${(props: any) => props.theme.spacing[2]};
`;

const QuorumContainer = styled.View`
  flex-direction: row;
  background: ${(props: any) => props.theme.gray[900]};
  border-radius: 2px;
`;

const VoteNo = styled.View<{ percent: any }>`
  width: ${(props) => props.percent}%;
  height: 8px;
  background: ${(props) => props.theme.gray[900]};

  border-radius: 4px;
`;
const VoteYes = styled.View<{ percent: any }>`
  width: ${(props) => props.percent}%;
  height: 8px;
  background: ${(props) => props.theme.gray[400]};
  border-radius: 4px;
`;

const VoteCountRow = styled.View`
  justify-content: space-between;
  flex-direction: row;
`;

const VoteText = styled.Text`
  color: ${(props: any) => props.theme.gray[200]};
  margin-bottom: ${(props: any) => props.theme.spacing[2]};
  font-size: 16px;
  font-weight: bold;
  margin-top: -${(props: any) => props.theme.spacing[1]};
`;

const Votes = styled.View`
  background: ${(props) => props.theme.gray[700]};
  padding: ${(props: any) => props.theme.spacing[4]};
  border-radius: 8px;
`;

const VoteColumn = styled.View``;

const ApproveText = styled.Text`
color: ${(props: any) => props.theme.gray[400]}
  font-weight: bold;
  font-size: 12px;
  margin-bottom:  ${(props: any) => props.theme.spacing[2]};
`;
