import React from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { format } from "date-fns";

interface ChatMessageProps {
  message: ChatMessage;
  proposal: Proposal;
}

export const ChatMessage = ({ message, proposal }: ChatMessageProps) => {
  const theme = useTheme();
  const { body, postedAt, proposalId } = message;

  return (
    <Container>
      <ProposalName> {proposal?.name} </ProposalName>
      <MessageDate> {format(postedAt * 1000, "LLL d, yyyy - p")}</MessageDate>
      <MessageBody> {body} </MessageBody>
    </Container>
  );
};

const Container = styled.View`
  background: ${(props) => props.theme.gray[800]};
  margin: ${(props) => props.theme.spacing[2]};
  padding: ${(props) => props.theme.spacing[3]};
`;

const MessageBody = styled.Text`
  color: ${(props) => props.theme.gray[200]};
`;

const MessageDate = styled.Text`
  color: ${(props) => props.theme.gray[400]};
`;

const ProposalName = styled.Text`
  color: ${(props) => props.theme.gray[100]};
  font-weight: bold;
  margin-bottom: ${(props) => props.theme.spacing[2]};
`;
