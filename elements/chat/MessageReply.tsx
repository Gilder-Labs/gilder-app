import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Button, Typography } from "../../components";
import styled from "styled-components/native";
import { Image } from "react-native-ui-lib";
import {
  useMessageContext,
  Reply,
  MessageRepliesAvatars,
} from "stream-chat-expo";
import { useTheme } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faImage } from "@fortawesome/pro-solid-svg-icons/faImage";

export const Messagereply = () => {
  const { message } = useMessageContext();
  const theme = useTheme();
  console.log("Message in reply", message);

  return (
    <ReplyContainer>
      <ReplyCurve />
      <ReplyContentContainer>
        <Image
          style={{ width: 24, height: 24, borderRadius: 100, marginRight: 4 }}
          source={{ uri: message?.quoted_message?.user?.image }}
        />
        <Typography
          text={
            message?.quoted_message?.text
              ? message?.quoted_message?.text
              : "Click to view attachment"
          }
          size="caption"
          marginBottom="0"
          shade="400"
          maxLength={48}
          marginRight="1"
        />

        {message?.quoted_message?.attachments?.length > 0 && (
          <FontAwesomeIcon icon={faImage} size={16} color={theme.gray[400]} />
        )}
      </ReplyContentContainer>
    </ReplyContainer>
  );
};

const ReplyContainer = styled.View`
  flex-direction: row;
`;

const ReplyCurve = styled.View`
  border: 2px solid ${(props) => props.theme.gray[500]};
  border-right-width: 0px;
  border-top-width: 0px;
  border-left-color: ${(props) => props.theme.gray[500]};
  border-bottom-color: ${(props) => props.theme.gray[500]};
  margin-right: 4px;
  background: transparent;
  width: 16px;
  height: 14px;
  border-bottom-left-radius: 6;
`;

const ReplyContentContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${(props) => props.theme.spacing[2]};
  align-items: center;
`;
