import React from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { SvgXml } from "react-native-svg";

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

export const VoteCard = ({ vote, proposal }: VoteCardProps) => {
  const theme = useTheme();

  return (
    <Container>
      <Column>
        <ProposalName>{proposal?.name} </ProposalName>
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

const MessageBody = styled.Text`
  color: ${(props) => props.theme.gray[200]};
  font-size: 14px;
  line-height: 20px;
`;

const MessageDate = styled.Text`
  color: ${(props) => props.theme.gray[400]};
  margin-bottom: ${(props) => props.theme.spacing[3]};
`;

const ProposalName = styled.Text`
  color: ${(props) => props.theme.gray[100]};
  font-weight: bold;
  margin-bottom: ${(props) => props.theme.spacing[1]};
`;

const IconContainer = styled.View<{ color: string }>`
  /* border-radius: 100px, */
  margin-right: ${(props) => props.theme.spacing[3]};
  background: ${(props: any) => props.theme[props.color][800]};
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  border: 1px solid ${(props: any) => props.theme.gray[900]};
  border-radius: 100px;
  width: 36px;
  height: 36px;
`;

const Row = styled.View`
  flex-direction: row;
`;

const Column = styled.View`
  flex: 1;
`;
