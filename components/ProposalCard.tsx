import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Badge } from "./Badge";
import { format, getUnixTime, formatDistance } from "date-fns";
import numeral from "numeral";
import { useTheme } from "styled-components";
import { WalletIdentity } from "./WalletIdentity";
import { Typography } from "./Typography";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/pro-solid-svg-icons/faAngleDoubleRight";
import { useAppSelector } from "../hooks/redux";

interface ProposalCardProps {
  proposal: any;
  onClick: any;
  governance: any;
  mintSupply: string;
  mintDecimals: number;
  voteThresholdPercentage: number;
  creatorWalletId: string;
}

const proposalStatusKey = {
  Succeeded: "success",
  Completed: "success",
  Cancelled: "gray",
  Draft: "warning",
  Executing: "pending",
  Voting: "pending",
  Defeated: "error",
  ExecutingWithErrors: "error",
};

export const ProposalCard = ({
  proposal,
  onClick,
  governance,
  mintSupply,
  mintDecimals,
  voteThresholdPercentage,
  creatorWalletId,
}: ProposalCardProps) => {
  const {
    status,
    name,
    getStateTimestamp,
    getYesVoteCount,
    getNoVoteCount,
    isPreVotingState,
    votingAt,
    proposalId,
  } = proposal;

  const theme = useTheme();
  const { ownVotesMap } = useAppSelector((state) => state.members);

  // @ts-ignore
  const yesVotes = Number(getYesVoteCount);
  const noVotes = Number(getNoVoteCount);
  const totalVotes = yesVotes + noVotes;
  const yesPercentage = yesVotes
    ? Math.round((yesVotes / totalVotes) * 100)
    : 0;
  const noPercentage = noVotes ? Math.round((noVotes / totalVotes) * 100) : 0;
  const dateTimestamp = proposal?.votingCompletedAt || getStateTimestamp;

  const getTimeToVoteEnd = () => {
    const now = getUnixTime(new Date());

    let timeToVoteEnd = isPreVotingState
      ? governance?.maxVotingTime
      : (votingAt ?? 0) + governance?.maxVotingTime - now;

    const isTimeLeft = timeToVoteEnd > 0 ? true : false;

    const days = Math.floor(timeToVoteEnd / 86400);
    timeToVoteEnd -= days * 86400;

    const hours = Math.floor(timeToVoteEnd / 3600) % 24;
    timeToVoteEnd -= hours * 3600;

    const minutes = Math.floor(timeToVoteEnd / 60) % 60;
    timeToVoteEnd -= minutes * 60;

    const seconds = Math.floor(timeToVoteEnd % 60);
    return {
      days,
      hours,
      minutes,
      seconds,
      isTimeLeft,
    };
  };

  const getVoteFormatted = (votes: string) => {
    let voteString;
    if (mintDecimals === 0) {
      return numeral(Number(votes)).format("0,0");
    }

    voteString = votes.slice(0, -mintDecimals);
    return numeral(Number(voteString)).format("0,0");
  };

  const getQuorum = () => {
    if (!mintSupply)
      return {
        votesNeeded: "0",
        totalVotesNeededPercentage: 0,
        hasMetQuorum: false,
      };

    const mintSupplyFormatted =
      mintDecimals === 0 ? mintSupply : mintSupply.slice(0, -mintDecimals);
    const yesVoteFormatted =
      mintDecimals === 0
        ? getYesVoteCount
        : Number(getYesVoteCount.slice(0, -mintDecimals));

    const totalVotes =
      Number(mintSupplyFormatted) * (voteThresholdPercentage * 0.01);

    const totalVotesNeeded = Math.ceil(totalVotes - yesVoteFormatted);
    let totalVotesNeededPercentage = (yesVoteFormatted / totalVotes) * 100;
    totalVotesNeededPercentage =
      totalVotesNeededPercentage > 100 ? 100 : totalVotesNeededPercentage;

    return {
      votesNeeded: numeral(Number(totalVotesNeeded)).format("0,0"),
      totalVotesNeededPercentage: totalVotesNeededPercentage,
      hasMetQuorum: Number(totalVotesNeeded) < 0,
    };
  };

  const quorumData = getQuorum();
  const timeLeft = getTimeToVoteEnd();
  const isVoting = status === "Voting";

  const ownVote = ownVotesMap?.[proposalId]
    ? ownVotesMap?.[proposalId]?.voteWeightYes
      ? " - Yes"
      : " - No"
    : "";

  return (
    <Container onLongPress={onClick} activeOpacity={0.5}>
      <TextContainer>
        <ProposalTitle>{name}</ProposalTitle>
        <Badge
          title={
            isVoting && !timeLeft.isTimeLeft
              ? `Finalizing${ownVote}`
              : `${status}${ownVote}`
          }
          type={proposalStatusKey[status]}
        />
      </TextContainer>
      <ProposalSubData>
        <SubtextContainer>
          <DateText>{format(dateTimestamp * 1000, "MMM d, yyyy - p")}</DateText>
          {isVoting && timeLeft.isTimeLeft ? (
            <TimeContainer>
              <StatusText>Ends in </StatusText>
              <TimeText>
                {`${timeLeft.days ? timeLeft.days : 0}d: `}
                {`${timeLeft.hours ? timeLeft.hours : 0}h: `}
                {`${timeLeft.minutes ? timeLeft.minutes : 0}m`}
              </TimeText>
            </TimeContainer>
          ) : isVoting && !timeLeft.isTimeLeft ? (
            <StatusText>Voting ended </StatusText>
          ) : (
            <StatusText>
              {status}{" "}
              {formatDistance(getStateTimestamp * 1000, new Date(), {
                addSuffix: true,
              })}
            </StatusText>
          )}
        </SubtextContainer>
        <IconButton onPress={onClick} activeOpacity={0.5}>
          <FontAwesomeIcon
            icon={faAngleDoubleRight}
            size={18}
            color={theme.gray[400]}
          />
        </IconButton>
      </ProposalSubData>
      {creatorWalletId && (
        <CreatorRow>
          <WalletIdentity
            memberPublicKey={creatorWalletId}
            size="subtitle"
            shade="100"
          />
        </CreatorRow>
      )}

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
              <ApproveText>Minimum Participation</ApproveText>
              <VoteText>
                {quorumData.hasMetQuorum
                  ? "Quorum Reached"
                  : `${quorumData.votesNeeded} votes still needed.`}
              </VoteText>
            </VoteColumn>
          </VoteCountRow>
          <QuorumContainer>
            <VoteQuorum percent={quorumData.totalVotesNeededPercentage} />
          </QuorumContainer>
        </Votes>
      )}
    </Container>
  );
};

const Container = styled.TouchableOpacity`
  /* height: 80px; */
  width: 100%;
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 8px;
  background: ${(props: any) => props.theme.gray[800]};
  flex-direction: column;
`;

const ProposalSubData = styled.View`
  justify-content: space-between;
  padding-left: ${(props: any) => props.theme.spacing[4]};
  padding-right: ${(props: any) => props.theme.spacing[4]};
  margin-top: ${(props: any) => props.theme.spacing[2]};
  margin-bottom: ${(props: any) => props.theme.spacing[1]};

  align-items: flex-start;
  flex-direction: row;
`;

const ProposalTitle = styled.Text`
  color: ${(props: any) => props.theme.gray[100]}
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  flex-wrap: wrap;
  padding-right: ${(props: any) => props.theme.spacing[2]};
  flex: 1;
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
  overflow: hidden;
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
`;

const QuorumContainer = styled.View`
  flex-direction: row;
  background: ${(props: any) => props.theme.gray[900]};
  border-radius: 2px;
  overflow: hidden;
`;

const VoteNo = styled.View<{ percent: any }>`
  width: ${(props) => props.percent}%;
  height: 8px;
  background: ${(props) => props.theme.gray[600]};
`;
const VoteYes = styled.View<{ percent: any }>`
  width: ${(props) => props.percent}%;
  height: 8px;
  background: ${(props) => props.theme.aqua[500]};
`;

const VoteQuorum = styled.View<{ percent: any }>`
  width: ${(props) => props.percent}%;
  height: 8px;
  background: ${(props) => props.theme.gray[400]};
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

const IconButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 100px;
  background: ${(props: any) => props.theme.gray[700]};
  /* margin-left: ${(props: any) => props.theme.spacing[3]}; */
`;

const SubtextContainer = styled.View`
  flex-direction: column;
`;

const CreatorRow = styled.View`
  padding: ${(props: any) => props.theme.spacing[1]};
  padding-left: ${(props: any) => props.theme.spacing[4]};
  padding-right: ${(props: any) => props.theme.spacing[4]};

  margin-bottom: ${(props: any) => props.theme.spacing[2]};
  align-items: center;
  flex-direction: row;
`;
