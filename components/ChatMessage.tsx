import React from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { format, formatDistance } from "date-fns";
import { Typography } from "./Typography";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleCheck } from "@fortawesome/pro-regular-svg-icons/faCircleCheck";
import { faCircleXmark } from "@fortawesome/pro-regular-svg-icons/faCircleXmark";

import { WalletIdentity } from "../components";

interface ChatMessageProps {
  message: ChatMessage;
  proposal: Proposal;
  isInProposal?: boolean;
  voteWeight?: string;
  isYesVote?: boolean;
}

export const ChatMessage = ({
  message,
  proposal,
  isInProposal = false,
  isYesVote = true,
  voteWeight = "",
}: ChatMessageProps) => {
  const theme = useTheme();
  const { body, postedAt, proposalId, author } = message;

  if (!proposal) {
    return <EmptyView />;
  }

  return (
    <Container>
      <Column>
        <Row>
          <Column>
            <WalletIdentity memberPublicKey={author} />
            <MessageDate>
              {formatDistance(postedAt * 1000, new Date(), { addSuffix: true })}
            </MessageDate>
          </Column>
          {!!voteWeight && (
            <VoteButton>
              {isYesVote ? (
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
            </VoteButton>
          )}
        </Row>
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
  font-size: 12px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: flex-start;
`;

const Column = styled.View`
  flex: 1;
`;

const EmptyView = styled.View``;

const VoteButton = styled.View`
  background: ${(props: any) => props.theme.gray[900]};
  padding: ${(props) => props.theme.spacing[2]};
  padding-left: ${(props) => props.theme.spacing[3]};
  padding-right: ${(props) => props.theme.spacing[3]};

  border-radius: 16px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;
