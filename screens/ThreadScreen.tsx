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
      enableMessageGroupingByUser={true}
      forceAlignMessages={"left"}
      // ReactionList={ReactionList}
      MessageFooter={() => null}
      deletedMessagesVisibilityType={"never"}
      MessageAvatar={() => {
        return null;
      }}
      // MessageContent={() => <MessageContentContainer />}
      MessageHeader={(props) => (
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <AnimatedImage
            style={{
              width: 36,
              height: 36,
              overflow: "hidden",
              borderRadius: 100,
            }}
            source={{
              uri: props?.message?.user?.image,
            }}
          />
          <MessageHeaderContainer>
            <Typography
              text={props?.message?.user?.name || ""}
              size="subtitle"
              color="gray"
              shade="200"
              bold={true}
              marginRight="1"
              marginLeft="2"
              marginBottom="0"
            />
            <Typography
              text={`(${abbreviatePublicKey(
                props?.message?.user?.id || "",
                2
              )})`}
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
        </View>
      )}
    >
      <Thread />
    </Channel>
  );
}

const MessageHeaderContainer = styled.View`
  flex-direction: row;
  height: 20px;
  align-items: center;
`;
