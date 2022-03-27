import React from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { Badge } from "../components";
import numeral from "numeral";
import * as Unicons from "@iconscout/react-native-unicons";

interface VoteCardProps {
  vote: MemberVote;
  proposal: Proposal;
  member: Member;
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

export const VoteCard = ({ vote, proposal, member }: VoteCardProps) => {
  const theme = useTheme();

  // Vote for proposal not in dao so we hide it.
  if (!proposal) {
    return <EmptyView />;
  }

  const { status } = proposal;
  const { depositAmount } = member;

  return (
    <Container>
      <Column>
        <ProposalName>{proposal?.name} </ProposalName>
        <Row>
          <VoteRow>
            <VoteText>Votes -</VoteText>
            <VoteAmount>{numeral(depositAmount).format("0,0.00a")}</VoteAmount>
            <IconContainer isApproved={vote.voteWeightYes ? true : false}>
              {vote.voteWeightYes ? (
                <Unicons.UilCheck size="18" color={theme.success[400]} />
              ) : (
                <Unicons.UilTimes size="18" color={theme.error[400]} />
              )}
            </IconContainer>
          </VoteRow>
          <Badge title={status} type={proposalStatusKey[status]} />
        </Row>
      </Column>
    </Container>
  );
};

const Container = styled.View`
  background: ${(props) => props.theme.gray[800]};
  margin-top: ${(props) => props.theme.spacing[3]};
  padding: ${(props) => props.theme.spacing[3]};
  border-radius: 8px;
  flex-direction: row;
  margin-left: ${(props) => props.theme.spacing[3]};
  margin-right: ${(props) => props.theme.spacing[3]};
`;

const ProposalName = styled.Text`
  color: ${(props) => props.theme.gray[100]};
  font-weight: bold;
  margin-bottom: ${(props) => props.theme.spacing[3]};
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const VoteRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => props.theme.gray[1000]};
  padding: ${(props) => props.theme.spacing[1]};
  padding-left: ${(props) => props.theme.spacing[2]};
  padding-right: ${(props) => props.theme.spacing[2]};
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
  flex: 1;
`;

const IconContainer = styled.View<{ isApproved: boolean }>`
  background: ${(props) =>
    props.isApproved ? props.theme.success[700] : props.theme.error[700]}88;
  border-radius: 100px;
  border: 1px solid ${(props) => props.theme.gray[700]}
  padding: ${(props) => props.theme.spacing[1]};
`;

const EmptyView = styled.View``;
