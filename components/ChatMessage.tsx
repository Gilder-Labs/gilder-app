import React from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { format, formatDistance } from "date-fns";
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

  if (!proposal) {
    return <EmptyView />;
  }

  return (
    <Container>
      <IconContainer color={color}>
        <SvgXml xml={jdenticonSvg} width="34px" height="34px" />
      </IconContainer>

      <Column>
        <ProposalName>{proposal?.name} </ProposalName>
        <MessageDate>
          {formatDistance(postedAt * 1000, new Date(), { addSuffix: true })}
        </MessageDate>
        <MessageBody>{body} </MessageBody>
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

const EmptyView = styled.View``;
