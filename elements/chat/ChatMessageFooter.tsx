import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Button, Typography } from "../../components";
import styled from "styled-components/native";
import { useMessageContext } from "stream-chat-expo";
import { useMessageReactions } from "./useReactionsHook";
import { supportedReactionsByType } from "./supportedReactions";
import { ReactionItem } from "./ReactionItem";

export const ChatMessageFooter = () => {
  const { message } = useMessageContext();
  const { ownReactionTypes, reactionCounts, reactionsByType, toggleReaction } =
    useMessageReactions(message);

  if (!reactionsByType || Object.keys(reactionsByType).length === 0) {
    return null;
  }

  const renderReactionItem = (type) => {
    if (!supportedReactionsByType[type]) return null;

    const Icon = supportedReactionsByType[type].Icon;
    const count = reactionCounts[type];
    const isOwnReaction = ownReactionTypes.indexOf(type) > -1;

    return (
      <ReactionItem
        count={count}
        Icon={Icon}
        isOwnReaction={isOwnReaction}
        key={type}
        onPress={() => toggleReaction(type)}
      />
    );
  };

  return (
    <FooterContainer>
      {Object.keys(reactionsByType).map(renderReactionItem)}
    </FooterContainer>
  );
};

const FooterContainer = styled.View`
  padding-left: ${(props) => props.theme.spacing[3]};
  padding-right: ${(props) => props.theme.spacing[3]};
  margin-left: -12px;
  flex-direction: row;
`;
