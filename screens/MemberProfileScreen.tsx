import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useTheme } from "styled-components";
import {
  fetchWalletSolDomains,
  fetchMemberVotes,
  fetchMemberDaos,
} from "../store/memberSlice";
import {
  VoteCard,
  PublicKeyTextCopy,
  RealmCard,
  RealmIcon,
  ProposalCard,
} from "../components";
import { useCardinalIdentity } from "../hooks/useCardinaldentity";
import { Typography } from "../components";
import { AnimatedImage } from "react-native-ui-lib";
import { getColorType } from "../utils";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator } from "react-native";
import { formatVoteWeight } from "../utils";
import numeral from "numeral";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheckToSlot } from "@fortawesome/pro-solid-svg-icons/faCheckToSlot";

interface MemberProfileProps {
  open: boolean;
  route: any;
  navigation: any;
}

export const MemberProfileScreen = ({ route }: MemberProfileProps) => {
  const dispatch = useAppDispatch();
  const {
    isLoadingVotes,
    memberDAOs,
    memberVotes,
    membersMap,
    tokenRecordToWalletMap,
    isLoadingMemberDaos,
  } = useAppSelector((state) => state.members);
  const theme = useTheme();
  const navigation = useNavigation();

  const { governancesMap, isLoadingVaults } = useAppSelector(
    (state) => state.treasury
  );

  const { selectedRealm, realmsMap } = useAppSelector((state) => state.realms);
  const { proposalsMap, proposals, isLoadingProposals } = useAppSelector(
    (state) => state.proposals
  );
  const { walletId } = route?.params;
  const member = membersMap?.[walletId];
  const { twitterURL, twitterHandle, twitterDescription } = useCardinalIdentity(
    member?.walletId
  );
  const identityName = twitterHandle;

  const color = getColorType(member?.walletId);
  const color2 = getColorType(member?.walletId.slice(-1) || "string");

  useEffect(() => {
    if (member) {
      dispatch(fetchMemberVotes({ member, realm: selectedRealm }));
      dispatch(fetchWalletSolDomains(member.walletId));
      dispatch(fetchMemberDaos(member.walletId));
    }
  }, [member]);

  const renderVotes = ({ item }: any) => {
    return (
      <VoteCard
        member={member}
        vote={item}
        key={item.proposalId}
        proposal={proposalsMap[item.proposalId]}
        realm={selectedRealm}
      />
    );
  };

  const getUserFilteredProposals = () => {
    let filteredProposals = proposals.filter((proposal) => {
      return (
        tokenRecordToWalletMap[proposal.tokenOwnerRecord] === member.walletId
      );
    });

    return filteredProposals;
  };

  const handleProposalSelect = (proposal: Proposal) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    //@ts-ignore
    navigation.push("ProposalDetail", {
      proposalId: proposal.proposalId,
    });
  };

  const renderProposal = ({ item }: any) => {
    const proposalGovernance = governancesMap?.[item?.governanceId];

    if (!proposalGovernance) {
      return <EmptyView />;
    }

    const { communityVoteThresholdPercentage, councilVoteThresholdPercentage } =
      proposalGovernance;
    const {
      communityMint,
      communityMintSupply,
      communityMintDecimals,
      councilMint,
      councilMintSupply,
      councilMintDecimals,
    } = selectedRealm;
    const { governingTokenMint } = item;

    return (
      <PropsalCardContainer>
        <ProposalCard
          proposal={item}
          onClick={() => handleProposalSelect(item)}
          governance={proposalGovernance}
          hideVotes={true}
          mintSupply={
            governingTokenMint === communityMint
              ? communityMintSupply
              : councilMintSupply
          }
          mintDecimals={
            governingTokenMint === communityMint
              ? communityMintDecimals
              : councilMintDecimals
          }
          voteThresholdPercentage={
            governingTokenMint === communityMint
              ? communityVoteThresholdPercentage
              : councilVoteThresholdPercentage
          }
          creatorWalletId={tokenRecordToWalletMap[item.tokenOwnerRecord]}
        />
      </PropsalCardContainer>
    );
  };

  const renderDAO = ({ item }: any) => {
    if (realmsMap[item]) {
      return <RealmCard realm={realmsMap[item]} navigateOnClick={true} />;
    }
  };

  return (
    <Container>
      <ProfileHeaderRow>
        <ProfilePictureContainer>
          <LinearGradient
            // Background Linear Gradient
            colors={[`${theme[color][500]}`, `${theme[color2][900]}`]}
            style={{ minHeight: 128, minWidth: 128 }}
            start={{ x: 0.1, y: 0.2 }}
          >
            {!!twitterURL && (
              <AnimatedImage
                style={{
                  width: 128,
                  height: 128,
                  overflow: "hidden",
                }}
                source={{
                  uri: twitterURL,
                }}
              />
            )}
          </LinearGradient>
        </ProfilePictureContainer>
        <NameRow>
          {identityName ? (
            <Typography
              text={identityName}
              shade="100"
              size="h4"
              bold={true}
              marginBottom={"0"}
            />
          ) : (
            <PublicKeyTextCopy
              shade="300"
              size="h4"
              publicKey={member.walletId}
              backgroundShade="900"
              noPadding={true}
              hideIcon={true}
              bold={true}
            />
          )}
          {identityName ? (
            <PublicKeyTextCopy
              shade="500"
              size="subtitle"
              backgroundShade="900"
              publicKey={member?.walletId || ""}
              noPadding={true}
              hideIcon={true}
            />
          ) : null}
          <DescriptionContainer>
            <Typography
              text={twitterDescription}
              shade="300"
              size="subtitle"
              marginTop="2"
              marginBottom={"0"}
              hasLinks={true}
            />
          </DescriptionContainer>
        </NameRow>
      </ProfileHeaderRow>

      <VotesContainer>
        {member?.councilDepositAmount && (
          <VoteContainer>
            <Typography
              text="Council Votes"
              shade="500"
              marginBottom="0"
              size="caption"
            />
            <Column>
              <Row>
                <RealmIcon realmId={selectedRealm.pubKey} size={32} />

                <Typography
                  text={numeral(
                    formatVoteWeight(
                      member.councilDepositAmount,
                      selectedRealm?.councilMintDecimals
                    )
                  ).format("0,0")}
                  // marginRight="2"
                  marginLeft="1"
                  size="h3"
                  bold={true}
                  marginBottom="0"
                />
              </Row>
              <Row>
                <FontAwesomeIcon
                  icon={faCheckToSlot}
                  size={14}
                  color={theme.gray[400]}
                />
                <Typography
                  text={member.totalVotesCouncil || "0"}
                  size="subtitle"
                  marginLeft="2"
                  shade="400"
                  marginBottom="0"
                />
              </Row>
            </Column>
          </VoteContainer>
        )}

        {member?.communityDepositAmount && (
          <VoteContainer>
            <Typography
              text="Community Votes"
              shade="500"
              marginBottom="0"
              size="caption"
            />
            <Column>
              <Row>
                <RealmIcon realmId={selectedRealm.pubKey} size={32} />
                <Typography
                  text={numeral(
                    formatVoteWeight(
                      member.communityDepositAmount,
                      selectedRealm?.communityMintDecimals
                    )
                  ).format("0.0a")}
                  bold={true}
                  size="h3"
                  marginLeft="1"
                  // marginRight="2"
                  marginBottom="0"
                />
              </Row>
              <Row>
                <FontAwesomeIcon
                  icon={faCheckToSlot}
                  size={14}
                  color={theme.gray[400]}
                />
                <Typography
                  text={member.totalVotesCommunity || "0"}
                  size="subtitle"
                  marginLeft="2"
                  shade="400"
                  marginBottom="0"
                />
              </Row>
            </Column>
          </VoteContainer>
        )}
      </VotesContainer>

      <DAOColumn>
        <Typography
          text={"DAO membership"}
          shade="400"
          size="subtitle"
          bold={true}
          marginBottom={"1"}
        />
        {isLoadingMemberDaos ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={memberDAOs}
            renderItem={renderDAO}
            keyExtractor={(item) => item}
            scrollIndicatorInsets={{ right: 1 }}
            initialNumToRender={10}
            horizontal={true}
            style={{ marginBottom: 16 }}
            contentContainerStyle={{
              backgroundColor: theme.gray[900],
              paddingTop: 12,
              marginLeft: -8,
              borderRadius: 8,
            }}
            ListEmptyComponent={
              <EmptyTextContainer>
                <Typography
                  marginLeft="2"
                  text="Looks like this user isn't in any DAOs currently."
                />
              </EmptyTextContainer>
            }
          />
        )}
      </DAOColumn>

      <InfoColumn>
        <Typography
          text={"Latest Votes"}
          shade="400"
          size="subtitle"
          bold={true}
          marginBottom={"1"}
        />
        {isLoadingVotes ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={memberVotes}
            renderItem={renderVotes}
            keyExtractor={(item) => item.proposalId}
            scrollIndicatorInsets={{ right: 1 }}
            initialNumToRender={10}
            horizontal={true}
            style={{ marginBottom: 16 }}
            contentContainerStyle={{
              backgroundColor: theme.gray[900],
              paddingTop: 12,
              borderRadius: 8,
            }}
            ListEmptyComponent={
              <EmptyTextContainer>
                <Typography text="Looks like this user hasn't voted on anything yet." />
              </EmptyTextContainer>
            }
          />
        )}
      </InfoColumn>

      <InfoColumn>
        <Typography
          text={"Proposals Created"}
          shade="400"
          size="subtitle"
          bold={true}
          marginBottom={"1"}
        />
        {isLoadingProposals || isLoadingVaults ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={getUserFilteredProposals()}
            renderItem={renderProposal}
            keyExtractor={(item) => item.proposalId}
            scrollIndicatorInsets={{ right: 1 }}
            initialNumToRender={10}
            horizontal={true}
            style={{ marginBottom: 100 }}
            contentContainerStyle={{
              backgroundColor: theme.gray[900],
              paddingTop: 12,
              borderRadius: 8,
            }}
            ListEmptyComponent={
              <EmptyTextContainer>
                <Typography text="Looks like this user hasn't created any proposals yet." />
              </EmptyTextContainer>
            }
          />
        )}
      </InfoColumn>
    </Container>
  );
};

const Container = styled.ScrollView`
  padding: ${(props) => props.theme.spacing[3]};
  background: ${(props: any) => props.theme.gray[900]};
  height: 100%;
`;

const EmptyView = styled.View``;

const ProfilePictureContainer = styled.View`
  background: ${(props: any) => props.theme.gray[800]};
  overflow: hidden;
  border: 1px solid ${(props: any) => props.theme.gray[900]};
  border-radius: 100px;
  height: 128px;
  width: 128px;
`;

const ProfileHeaderRow = styled.View`
  flex-direction: row;
  margin-bottom: ${(props) => props.theme.spacing[3]};
`;

const NameRow = styled.View`
  flex-direction: column;
  align-items: flex-start;
  margin-left: ${(props) => props.theme.spacing[3]};
`;

const VotesContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${(props) => props.theme.spacing[3]};
  margin-left: -${(props) => props.theme.spacing[1]};
  margin-right: -${(props) => props.theme.spacing[1]};
`;

const DAOColumn = styled.View`
  flex-direction: column;
  min-height: 100px;
`;
const DescriptionContainer = styled.View`
  flex-direction: row;
  margin-right: 128px; // so react native doesn't overflow outside screen
`;

const InfoColumn = styled.View`
  flex-direction: column;
  min-height: 200px;
`;

const VoteContainer = styled.View`
  background: ${(props: any) => props.theme.gray[800]};
  padding: ${(props) => props.theme.spacing[2]};
  flex: 1;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  margin-left: ${(props) => props.theme.spacing[1]};
  margin-right: ${(props) => props.theme.spacing[1]};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Column = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PropsalCardContainer = styled.View`
  margin-right: ${(props) => props.theme.spacing[3]};
  height: 100%;
`;

const EmptyTextContainer = styled.View`
  max-width: 300px;
  min-height: 80px;
`;
