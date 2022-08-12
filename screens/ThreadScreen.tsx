import { Thread, Channel, useAttachmentPickerContext } from "stream-chat-expo"; // Or stream-chat-expo
import { useHeaderHeight } from "@react-navigation/elements";
import { useEffect } from "react";
import { Typography } from "../components";
import { AnimatedImage } from "react-native-ui-lib";
import { View } from "react-native";
import styled from "styled-components/native";
import { abbreviatePublicKey } from "../utils";

export default function ThreadScreen(props: any) {
  const { route } = props;
  const headerHeight = useHeaderHeight();
  const { setTopInset } = useAttachmentPickerContext();

  useEffect(() => {
    setTopInset(headerHeight);
  }, [headerHeight]);

  return (
    <Channel
      channel={route?.params?.channel}
      thread={route?.params?.message}
      threadList
      keyboardVerticalOffset={headerHeight}
      enableMessageGroupingByUser={false}
      forceAlignMessages={"left"}
      // ReactionList={ReactionList}
      MessageFooter={() => null}
      deletedMessagesVisibilityType={"never"}
      MessageHeader={(props) => (
        <MessageHeaderContainer>
          <Typography
            text={props?.message?.user?.name || ""}
            size="subtitle"
            color="gray"
            shade="200"
            bold={true}
            marginRight="1"
            marginBottom="0"
          />
          <Typography
            text={`(${abbreviatePublicKey(props?.message?.user?.id || "", 2)})`}
            size="caption"
            color="gray"
            shade="500"
            bold={true}
            marginRight="1"
            marginBottom="0"
          />
          <Typography
            text={props?.formattedDate || ""}
            size="caption"
            color="gray"
            shade="500"
            bold={true}
            marginRight="1"
            marginBottom="0"
          />
        </MessageHeaderContainer>
      )}
    >
      <Thread />
    </Channel>
  );
}

const MessageHeaderContainer = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: ${(props) => props.theme.spacing[1]};
  margin-top: -4px;
`;
