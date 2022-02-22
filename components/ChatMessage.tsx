import React from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { format } from "date-fns";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-jdenticon-sprites";
import { SvgXml } from "react-native-svg";
import { getColorType } from "../utils";

interface ChatMessageProps {
  message: ChatMessage;
  proposal: Proposal;
}

export const ChatMessage = ({ message, proposal }: ChatMessageProps) => {
  const theme = useTheme();
  const { body, postedAt, proposalId, author } = message;

  let jdenticonSvg = createAvatar(style, {
    seed: author,
    // ... and other options
  });

  const color = getColorType(author);

  return (
    <Container>
      <IconContainer color={color}>
        <SvgXml xml={jdenticonSvg} width="44px" height="44px" />
      </IconContainer>
      <ProposalName> {proposal?.name} </ProposalName>
      <MessageDate> {format(postedAt * 1000, "LLL d, yyyy - p")}</MessageDate>
      <MessageBody> {body} </MessageBody>
    </Container>
  );
};

const Container = styled.View`
  background: ${(props) => props.theme.gray[800]};
  margin-top: ${(props) => props.theme.spacing[3]};
  padding: ${(props) => props.theme.spacing[3]};
  border-radius: 8px;
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

const IconContainer = styled.View<{ color: string }>`
  /* border-radius: 100px, */
  background: ${(props: any) => props.theme[props.color][800]};
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  border: 2px solid ${(props: any) => props.theme.gray[900]};
  border-radius: 100px;
  width: 48px;
  height: 48px;
`;
