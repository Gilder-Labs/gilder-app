import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { FlatList } from "react-native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useTheme } from "styled-components";
import { Badge, ChatMessage, Button } from "../components";
import { format, getUnixTime, formatDistance } from "date-fns";
import numeral from "numeral";
import { fetchProposalChat } from "../store/proposalsSlice";

interface ProposalDetailScreen {
  route: any;
  navigation: any;
}

const proposalStatusKey = {
  Succeeded: "success",
  Completed: "success",
  Cancelled: "gray",
  Draft: "warning",
  Executing: "pending",
  Voting: "pending",
  Defeated: "error",
};

export const ProposalDetailScreen = ({ route }: ProposalDetailScreen) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { selectedRealm } = useAppSelector((state) => state.realms);
  const { governancesMap, isLoadingVaults } = useAppSelector(
    (state) => state.treasury
  );
  const { chatMessages, isLoadingChatMessages } = useAppSelector(
    (state) => state.proposals
  );

  const { proposal } = route?.params;
  const {
    status,
    name,
    getStateTimestamp,
    getYesVoteCount,
    getNoVoteCount,
    isPreVotingState,
    votingAt,
    description,
    governingTokenMint,
  } = proposal;

  useEffect(() => {
    dispatch(fetchProposalChat(proposal.proposalId));
  }, [proposal]);

  const governance = governancesMap?.[proposal.governanceId];

  const voteThresholdPercentage = governance?.voteThresholdPercentage || 0;

  // Return empty view till we have loaded
  if (!selectedRealm) {
    return <VoteColumn />;
  }

  const {
    communityMint,
    communityMintSupply,
    communityMintDecimals,
    councilMint,
    councilMintSupply,
    councilMintDecimals,
  } = selectedRealm;

  const mintSupply =
    governingTokenMint === communityMint
      ? communityMintSupply
      : councilMintSupply;
  const mintDecimals =
    governingTokenMint === communityMint
      ? communityMintDecimals
      : councilMintDecimals;

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

  const renderChatMessage = ({ item }: any) => {
    return (
      <ChatMessage
        message={item}
        key={item.postedAt}
        proposal={proposal}
        isInProposal={true}
      />
    );
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
    const mintSupplyFormatted =
      mintDecimals === 0 ? mintSupply : mintSupply.slice(0, -mintDecimals);
    const yesVoteFormatted =
      mintDecimals === 0
        ? getYesVoteCount
        : Number(getYesVoteCount.slice(0, -mintDecimals));

    const totalVotes =
      Number(mintSupplyFormatted) * (voteThresholdPercentage * 0.01);

    const totalVotesNeeded = totalVotes - yesVoteFormatted;
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

  return (
    <FlatList
      data={chatMessages}
      renderItem={renderChatMessage}
      keyExtractor={(item: any) => item.postedAt.toString()}
      style={{
        backgroundColor: theme.gray[900],
      }}
      ListFooterComponent={<EmptyView />}
      scrollIndicatorInsets={{ right: 1 }}
      removeClippedSubviews={true}
      initialNumToRender={10}
      ListHeaderComponent={
        <Container>
          <TextContainer>
            <ProposalTitle>{name}</ProposalTitle>
            <Badge title={status} type={proposalStatusKey[status]} />
          </TextContainer>
          <ProposalSubData>
            <DateText>
              {format(dateTimestamp * 1000, "MMM d, yyyy - p")}
            </DateText>
            {isVoting ? (
              <TimeContainer>
                <StatusText>Ends in </StatusText>
                <TimeText>
                  {`${timeLeft.days}d: `}
                  {`${timeLeft.hours}h: `}
                  {`${timeLeft.minutes}m`}
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
                  {quorumData.hasMetQuorum
                    ? "Quorum Reached"
                    : `${quorumData.votesNeeded} yes votes still needed.`}
                </VoteText>
              </VoteColumn>
            </VoteCountRow>
            <QuorumContainer>
              <VoteYes percent={quorumData.totalVotesNeededPercentage} />
            </QuorumContainer>
          </Votes>
          {isVoting && (
            <>
              <Title>Voting</Title>
              <Divider />
              <VoteButtonContainer>
                <Button
                  title="Vote Yes"
                  onPress={() => {}}
                  marginRight={true}
                />
                <Button title="Vote No" onPress={() => {}} />
              </VoteButtonContainer>
            </>
          )}
          <Title>Description</Title>
          <Divider />

          <DescriptionText>{description} </DescriptionText>

          <Title>Discussion</Title>
          <Divider />
        </Container>
      }
    />
  );
};

const Container = styled.View`
  flex-direction: column;
  background: ${(props: any) => props.theme.gray[900]};
`;

const ProposalSubData = styled.View`
  justify-content: flex-start;
  padding-left: ${(props: any) => props.theme.spacing[3]};
  padding-right: ${(props: any) => props.theme.spacing[3]};
  margin-bottom: ${(props: any) => props.theme.spacing[4]};
  align-items: flex-start;
`;

const VoteButtonContainer = styled.View`
  padding: ${(props: any) => props.theme.spacing[3]};
  flex-direction: row;
`;

const ProposalTitle = styled.Text`
  color: ${(props: any) => props.theme.gray[100]}
  font-weight: bold;
  font-size: 22px;
  line-height: 24px;
  flex-wrap: wrap;
  max-width: 240px;
  padding-right: ${(props: any) => props.theme.spacing[2]};
`;

const DescriptionText = styled.Text`
  color: ${(props: any) => props.theme.gray[100]};
  font-size: 16px;
  line-height: 24px;
  padding-left: ${(props: any) => props.theme.spacing[3]};
  padding-right: ${(props: any) => props.theme.spacing[3]};
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
  padding: ${(props: any) => props.theme.spacing[3]};
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
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
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
  margin-left: ${(props: any) => props.theme.spacing[3]};
  margin-right: ${(props: any) => props.theme.spacing[3]};
  margin-bottom: ${(props: any) => props.theme.spacing[4]};
`;

const VoteColumn = styled.View``;

const EmptyView = styled.View`
  height: 200px;
`;

const ApproveText = styled.Text`
  color: ${(props: any) => props.theme.gray[400]}
  font-weight: bold;
  font-size: 12px;
  margin-bottom:  ${(props: any) => props.theme.spacing[2]};
`;

const Title = styled.Text`
  color: ${(props: any) => props.theme.gray[100]}
  font-weight: bold;
  font-size: 20px;
  padding-left: ${(props: any) => props.theme.spacing[3]};
  padding-right: ${(props: any) => props.theme.spacing[4]};
  margin-top: ${(props: any) => props.theme.spacing[4]};
  margin-bottom: ${(props: any) => props.theme.spacing[2]};

`;

const Divider = styled.View`
  height: 2px;
  background: ${(props: any) => props.theme.gray[700]};
  margin-left: ${(props: any) => props.theme.spacing[3]};
  margin-right: ${(props: any) => props.theme.spacing[3]};
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
`;
