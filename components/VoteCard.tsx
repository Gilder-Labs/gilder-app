import React from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { Badge, Typography, RealmIcon } from "../components";
import { formatVoteWeight } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleCheck } from "@fortawesome/pro-regular-svg-icons/faCircleCheck";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { WalletIdentity } from "../components";

import { faCircleXmark } from "@fortawesome/pro-regular-svg-icons/faCircleXmark";

interface VoteCardProps {
  vote: MemberVote;
  proposal: Proposal;
  member: Member;
  realm: Realm;
  isProposalView?: boolean;
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

export const VoteCard = ({
  vote,
  proposal,
  member,
  realm,
  isProposalView = false,
}: VoteCardProps) => {
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

  const voteWeight = getVoteWeight();

  if (isProposalView) {
    return (
      <SimpleContainer>
        <SpacedRow>
          <WalletIdentity memberPublicKey={member.walletId} />
          {!!voteWeight && (
            <SimpleRow>
              {vote.voteWeightYes ? (
                <FontAwesomeIcon
                  icon={faCircleCheck}
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
              <Typography
                text={voteWeight}
                size="subtitle"
                shade="300"
                bold={true}
                marginBottom="0"
                marginLeft="2"
              />
            </SimpleRow>
          )}
        </SpacedRow>
      </SimpleContainer>
    );
  }

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
            {vote.voteWeightYes ? (
              <FontAwesomeIcon
                icon={faCircleCheck}
                size={16}
                color={theme.success[400]}
                style={{ marginRight: 8 }}
              />
            ) : (
              <FontAwesomeIcon
                icon={faCircleXmark}
                size={16}
                color={theme.error[400]}
                style={{ marginRight: 8 }}
              />
            )}
            <RealmIcon realmId={realm.pubKey} size={28} />
            <Typography
              text={getVoteWeight()}
              marginBottom="0"
              marginLeft="1"
              size="subtitle"
              bold={true}
              shade="300"
            />
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
  background: ${(props) => props.theme.gray[900]};
  padding: ${(props) => props.theme.spacing[1]};
  padding-left: ${(props) => props.theme.spacing[2]};
  padding-right: ${(props) => props.theme.spacing[2]};

  margin-right: ${(props) => props.theme.spacing[2]};
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

const SimpleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing[2]};
  padding: ${(props) => props.theme.spacing[2]};
  background-color: ${(props) => props.theme.gray[800]};
  border-radius: 8px;
`;

const SpacedRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
`;

const SimpleRow = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.gray[900]};
  background: ${(props: any) => props.theme.gray[900]};
  padding: ${(props) => props.theme.spacing[2]};
  padding-left: ${(props) => props.theme.spacing[3]};
  padding-right: ${(props) => props.theme.spacing[3]};

  border-radius: 16px;
`;
