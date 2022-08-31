import React from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { Badge, Typography } from "../components";
import numeral from "numeral";
import { formatVoteWeight } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleCheck } from "@fortawesome/pro-regular-svg-icons/faCircleCheck";
import { faCheck } from "@fortawesome/pro-solid-svg-icons/faCheck";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";

import { faCircleXmark } from "@fortawesome/pro-regular-svg-icons/faCircleXmark";

interface VoteCardProps {
  vote: MemberVote;
  proposal: Proposal;
  member: Member;
  realm: Realm;
}
// Vote weight
// Direction vote is cast
// Proposal name
// Proposal Status
// When the vote was cast

const proposalStatusKey = {
  Succeeded: "success",
  Completed: "success",
  Cancelled: "gray",
  Draft: "warning",
  Executing: "pending",
  Voting: "pending",
  Defeated: "error",
};

export const VoteCard = ({ vote, proposal, member, realm }: VoteCardProps) => {
  const theme = useTheme();
  const navigation = useNavigation();

  // Vote for proposal not in dao so we hide it.
  if (!proposal) {
    return <EmptyView />;
  }

  const { status } = proposal;
  const { councilDepositAmount, communityDepositAmount } = member;

  const getVoteWeight = () => {
    const {
      communityMint,
      councilMint,
      councilMintDecimals,
      communityMintDecimals,
    } = realm;

    if (proposal.governingTokenMint === councilMint) {
      return formatVoteWeight(councilDepositAmount, councilMintDecimals);
    } else {
      return formatVoteWeight(communityDepositAmount, communityMintDecimals);
    }
  };

  const handleProposalSelect = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    //@ts-ignore
    navigation.push("ProposalDetail", {
      proposalId: proposal.proposalId,
    });
  };

  return (
    <Container onPress={() => handleProposalSelect()}>
      <Column>
        <TitleContainer>
          <Typography
            text={proposal?.name}
            bold={true}
            shade="200"
            marginBottom="2"
            maxLength={45}
          />
        </TitleContainer>
        <Row>
          <VoteRow>
            <IconContainer isApproved={vote.voteWeightYes ? true : false}>
              {vote.voteWeightYes ? (
                <FontAwesomeIcon
                  icon={faCheck}
                  size={16}
                  color={theme.success[400]}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  size={16}
                  color={theme.error[400]}
                />
              )}
            </IconContainer>
            <VoteText>Votes -</VoteText>
            <VoteAmount>{getVoteWeight()}</VoteAmount>
          </VoteRow>
          <Badge title={status} type={proposalStatusKey[status]} />
        </Row>
      </Column>
    </Container>
  );
};

const Container = styled.TouchableOpacity`
  background: ${(props) => props.theme.gray[800]};
  padding: ${(props) => props.theme.spacing[3]};
  border-radius: 8px;
  flex-direction: row;
  margin-right: ${(props) => props.theme.spacing[3]};
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing[2]};
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing[2]};
`;

const VoteRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-items: center;
  border-radius: 8px;
`;

const VoteText = styled.Text`
  color: ${(props) => props.theme.gray[300]};
  margin-right: ${(props) => props.theme.spacing[1]};
`;

const VoteAmount = styled.Text`
  color: ${(props) => props.theme.gray[100]};
  font-weight: bold;
  margin-right: ${(props) => props.theme.spacing[3]};
`;

const Column = styled.View`
  justify-content: space-between;
`;

const IconContainer = styled.View<{ isApproved: boolean }>`
  background: ${(props) =>
    props.isApproved ? props.theme.success[700] : props.theme.error[700]}88;
  border-radius: 100px;
  padding: ${(props) => props.theme.spacing[1]};
  margin-right: ${(props) => props.theme.spacing[3]};
`;

const EmptyView = styled.View``;

const TitleContainer = styled.View`
  max-width: 140px;
`;
