import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { FlatList, View, Text } from "react-native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useTheme } from "styled-components";
import {
  Badge,
  ChatMessage,
  Button,
  Loading,
  WalletIdentity,
  Typography,
} from "../components";
import { format, getUnixTime, formatDistance } from "date-fns";
import numeral from "numeral";
import {
  fetchProposalChat,
  fetchProposalVotes,
  fetchProposalInstructions,
} from "../store/proposalsSlice";
import { openTransactionModal } from "../store/walletSlice";
import * as Haptics from "expo-haptics";
import { InstructionCard } from "../elements";

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
  ExecutingWithErrors: "error",
};

export const ProposalDetailScreen = ({ route }: ProposalDetailScreen) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { selectedRealm, isLoadingRealms } = useAppSelector(
    (state) => state.realms
  );
  const { governancesMap, isLoadingVaults } = useAppSelector(
    (state) => state.treasury
  );
  const { isLoadingMembers, tokenRecordToWalletMap, delegateMap } =
    useAppSelector((state) => state.members);
  const { chatMessages, isLoadingChatMessages, walletToVoteMap } =
    useAppSelector((state) => state.proposals);
  const { membersMap } = useAppSelector((state) => state.members);
  const { publicKey } = useAppSelector((state) => state.wallet);
  const { proposalsMap, proposalInstructions } = useAppSelector(
    (state) => state.proposals
  );
  const [githubGist, setGithubGist] = useState<string>("");

  const { proposalId } = route?.params;

  useEffect(() => {
    if (proposalId && proposalsMap?.[proposalId]) {
      dispatch(fetchProposalChat(proposalId));
      dispatch(fetchProposalVotes(proposalId));
    }
  }, [proposalId, proposalsMap]);

  useEffect(() => {
    if (
      proposalId &&
      proposalsMap?.[proposalId] &&
      selectedRealm?.governanceId
    ) {
      dispatch(
        fetchProposalInstructions({
          proposalId,
          programId: selectedRealm.governanceId,
        })
      );
    }
  }, [proposalId, proposalsMap, selectedRealm]);

  if (
    !proposalId ||
    !selectedRealm ||
    isLoadingRealms ||
    isLoadingVaults ||
    isLoadingMembers ||
    !proposalsMap ||
    !proposalsMap?.[proposalId]
  ) {
    return <Loading />;
  }

  const proposal = proposalsMap[proposalId];
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

  const governance = governancesMap?.[proposal?.governanceId];

  const {
    communityMint,
    communityMintSupply,
    communityMintDecimals,
    councilMint,
    councilMintSupply,
    councilMintDecimals,
  } = selectedRealm;

  useEffect(() => {
    const fetchGithubGist = async () => {
      const gistId = description?.split("gist.github.com/")[1]?.split("/")[1];

      const response = await fetch(`https://api.github.com/gists/${gistId}`);
      const data = await response.json();
      const gist = Object.values(data?.files)[0];
      setGithubGist(gist?.content);
    };

    if (description?.includes("https://gist.github.com/")) {
      console.log("fetching description");
      fetchGithubGist();
    }
  }, [description]);

  const voteThresholdPercentage =
    governingTokenMint === communityMint
      ? governance?.communityVoteThresholdPercentage
      : governance?.councilVoteThresholdPercentage;

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

  const renderChatMessage = ({ item }: any) => {
    const vote = walletToVoteMap[item.author];
    const voteWeight = vote?.voteWeightYes
      ? vote?.voteWeightYes
      : vote?.voteWeightNo;

    return (
      <ChatMessage
        message={item}
        key={item.postedAt}
        proposal={proposal}
        isInProposal={true}
        voteWeight={voteWeight ? getVoteFormatted(voteWeight.toString()) : ""}
        isYesVote={vote?.voteWeightYes ? true : false}
      />
    );
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

  const vote = (type: number) => {
    dispatch(
      openTransactionModal({
        type: "VoteOnProposal",
        transactionData: { proposal: proposal, action: type },
      })
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderInstructions = () => {
    return proposalInstructions.map((instruction: any, index: number) => {
      return <InstructionCard instruction={instruction} key={index} />;
    });
  };

  const quorumData = getQuorum();

  const timeLeft = getTimeToVoteEnd();
  const isVoting = status === "Voting";
  const isMember = membersMap[publicKey];

  return (
    <ScreenContainer>
      <FlatList
        data={chatMessages}
        renderItem={renderChatMessage}
        keyExtractor={(item: any) => item.postedAt.toString()}
        style={{
          backgroundColor: theme.gray[900],
          minHeight: "100%",
        }}
        ListFooterComponent={<EmptyView />}
        scrollIndicatorInsets={{ right: 1 }}
        removeClippedSubviews={true}
        initialNumToRender={10}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        ListHeaderComponent={
          <Container>
            <TextContainer>
              <ProposalTitle>{name}</ProposalTitle>
              <Badge
                title={isVoting && !timeLeft.isTimeLeft ? "Finalizing" : status}
                type={proposalStatusKey[status]}
              />
            </TextContainer>
            <ProposalSubData>
              <DateText>
                {format(dateTimestamp * 1000, "MMM d, yyyy - p")}
              </DateText>
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
            </ProposalSubData>
            {tokenRecordToWalletMap &&
              tokenRecordToWalletMap[proposal.tokenOwnerRecord] && (
                <CreatorRow>
                  <WalletIdentity
                    memberPublicKey={
                      tokenRecordToWalletMap[proposal.tokenOwnerRecord]
                    }
                    size="subtitle"
                    shade="100"
                  />
                </CreatorRow>
              )}
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
                      ? "Required votes met"
                      : `${quorumData.votesNeeded} votes still needed`}
                  </VoteText>
                </VoteColumn>
              </VoteCountRow>
              <QuorumContainer>
                <VoteQuorum percent={quorumData.totalVotesNeededPercentage} />
              </QuorumContainer>
            </Votes>
            {/* {isVoting && isMember && ( */}

            <>
              <Typography
                text="Voting"
                bold={true}
                size="h4"
                shade={"200"}
                marginLeft={"3"}
                marginBottom={"1"}
              />
              <VoteButtonContainer>
                <Button
                  title="Vote No"
                  onPress={() => vote(1)}
                  marginRight={true}
                  disabled={
                    !publicKey ||
                    (!delegateMap[publicKey] && !membersMap[publicKey]) ||
                    !timeLeft?.isTimeLeft
                  }
                />
                <Button
                  disabled={
                    !publicKey ||
                    (!delegateMap[publicKey] && !membersMap[publicKey]) ||
                    !timeLeft?.isTimeLeft
                  }
                  title="Vote Yes"
                  onPress={() => vote(0)}
                />
              </VoteButtonContainer>
            </>
            <Typography
              text="Description"
              bold={true}
              size="h4"
              shade={"200"}
              marginLeft={"3"}
              marginBottom="1"
            />
            <Typography
              text={
                githubGist
                  ? githubGist
                  : description
                  ? description
                  : "No description added."
              }
              size="body"
              shade={"300"}
              marginLeft={"3"}
              marginRight="3"
              marginBottom="3"
              selectable={true}
              hasLinks={true}
            />
            <Typography
              text="Instructions"
              bold={true}
              size="h4"
              shade={"200"}
              marginLeft={"3"}
              marginBottom={"1"}
            />
            {proposalInstructions?.length ? (
              <>{renderInstructions()}</>
            ) : (
              <Typography
                text="0 instructions in this proposal"
                size="body"
                shade={"300"}
                marginLeft={"3"}
                marginBottom={"3"}
              />
            )}
            <Typography
              text="Discussion"
              bold={true}
              size="h4"
              shade={"200"}
              marginLeft={"3"}
              marginBottom="1"
            />
            {isLoadingChatMessages && (
              <LoadingContainer>
                <Loading size={48} />
              </LoadingContainer>
            )}
          </Container>
        }
      />
    </ScreenContainer>
  );
};

const Container = styled.View`
  flex-direction: column;
  background: ${(props: any) => props.theme.gray[900]};
  padding-top: ${(props: any) => props.theme.spacing[2]};
`;

const ScreenContainer = styled.View``;

const ProposalSubData = styled.View`
  justify-content: flex-start;
  padding-left: ${(props: any) => props.theme.spacing[3]};
  padding-right: ${(props: any) => props.theme.spacing[3]};
  margin-bottom: ${(props: any) => props.theme.spacing[1]};
  align-items: flex-start;
`;

const VoteButtonContainer = styled.View`
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  margin-left: ${(props: any) => props.theme.spacing[3]};
  margin-right: ${(props: any) => props.theme.spacing[3]};
  flex-direction: row;
`;

const ProposalTitle = styled.Text`
  color: ${(props: any) => props.theme.gray[100]}
  font-weight: bold;
  font-size: 26px;
  line-height: 32px;
  flex-wrap: wrap;
  flex:1;
  padding-right: ${(props: any) => props.theme.spacing[2]};
`;

const DescriptionText = styled.Text`
  color: ${(props: any) => props.theme.gray[100]};
  font-size: 16px;
  line-height: 24px;
  padding-left: ${(props: any) => props.theme.spacing[3]};
  padding-right: ${(props: any) => props.theme.spacing[3]};
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
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
  /* flex: 1; */
  width: 100%;
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

const LoadingContainer = styled.View``;

const CreatorRow = styled.View`
  padding: ${(props: any) => props.theme.spacing[1]};
  padding-left: ${(props: any) => props.theme.spacing[3]};
  padding-right: ${(props: any) => props.theme.spacing[3]};

  margin-bottom: ${(props: any) => props.theme.spacing[2]};
  align-items: center;
  flex-direction: row;
`;
