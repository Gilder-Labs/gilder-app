import React from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { format, formatDistance } from "date-fns";
import { getColorType, abbreviatePublicKey } from "../utils";
import { useQuery, gql } from "@apollo/client";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "./Typography";
import * as Unicons from "@iconscout/react-native-unicons";

interface ChatMessageProps {
  message: ChatMessage;
  proposal: Proposal;
  isInProposal?: boolean;
  voteWeight: string;
  isYesVote: boolean;
}

const GET_CYBERCONNECT_IDENTITY = gql`
  query FullIdentityQuery($publicKey: String!) {
    identity(address: $publicKey, network: SOLANA) {
      address
      domain
      social {
        twitter
      }
      avatar
    }
  }
`;

export const ChatMessage = ({
  message,
  proposal,
  isInProposal = false,
  isYesVote = true,
  voteWeight = "",
}: ChatMessageProps) => {
  const theme = useTheme();
  const { body, postedAt, proposalId, author } = message;
  const { loading, error, data } = useQuery(GET_CYBERCONNECT_IDENTITY, {
    variables: { publicKey: author },
  });

  const color = getColorType(author);
  const color2 = getColorType(author.slice(-1) || "string");

  const identityName = data?.identity?.social?.twitter
    ? data?.identity?.social?.twitter
    : data?.identity?.domain;

  const avatarUrl = data?.identity?.avatar;

  if (!proposal) {
    return <EmptyView />;
  }

  const getDisplayName = () => {
    if (isInProposal) {
      return identityName ? identityName : abbreviatePublicKey(author);
    }

    return proposal?.name;
  };

  return (
    <Container>
      <IconContainer color={color}>
        <LinearGradient
          // Background Linear Gradient
          colors={[`${theme[color][500]}`, `${theme[color2][900]}`]}
          style={{ height: 34, width: 34 }}
          start={{ x: 0.1, y: 0.2 }}
        >
          {!!avatarUrl && <Avatar source={{ uri: avatarUrl }} />}
        </LinearGradient>
      </IconContainer>

      <Column>
        <Row>
          <Column>
            <UserName>{getDisplayName()}</UserName>
            <MessageDate>
              {formatDistance(postedAt * 1000, new Date(), { addSuffix: true })}
            </MessageDate>
          </Column>
          {!!voteWeight && (
            <VoteButton>
              {isYesVote ? (
                <Unicons.UilCheckCircle size="20" color={theme.success[400]} />
              ) : (
                <Unicons.UilTimesCircle size="20" color={theme.error[400]} />
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
  margin-bottom: ${(props) => props.theme.spacing[3]};
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

const UserName = styled.Text`
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
  align-items: flex-start;
`;

const Column = styled.View`
  flex: 1;
`;

const EmptyView = styled.View``;

const Avatar = styled.Image`
  width: 34px;
  height: 34px;
`;

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
