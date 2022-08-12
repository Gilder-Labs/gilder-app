import { useState } from "react";
import {
  Channel,
  MessageList,
  MessageInput,
  useAttachmentPickerContext,
  ReactionList,
  MessageSimple,
  MessageReplies,
  MessageRepliesAvatars,
} from "stream-chat-expo"; // Or stream-chat-expo
import { StyleSheet, Text, SafeAreaView, View } from "react-native";
import styled from "styled-components";
import { useHeaderHeight } from "@react-navigation/elements";
import { useEffect } from "react";
import { useChatClient } from "../hooks/useChatClient";
import { Typography } from "../components";
import { abbreviatePublicKey } from "../utils";
import { AnimatedImage } from "react-native-ui-lib";
import { useTheme } from "styled-components";

export default function ChannelScreen(props: any) {
  const { route, navigation } = props;
  const theme = useTheme();
  const {
    params: { channel },
  } = route;
  const headerHeight = useHeaderHeight();
  const { setTopInset } = useAttachmentPickerContext();
  const [toggleChannel, setToggleChannel] = useState(false);

  useEffect(() => {
    setTopInset(headerHeight);
  }, [headerHeight]);

  // Stupid hack to update channel with drawers becuse <Channel> doesn't update when changing channel/route.
  useEffect(() => {
    setToggleChannel(true);
    const timer = setTimeout(() => {
      setToggleChannel(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [channel]);

  if (toggleChannel) {
    return <Container />;
  }

  return (
    <Container>
      <SafeAreaView style={styles.container}>
        <Channel
          channel={channel}
          keyboardVerticalOffset={headerHeight}
          enableMessageGroupingByUser={false}
          forceAlignMessages={"left"}
          // ReactionList={ReactionList}
          MessageSimple={() => <MessageSimple />}
          MessageFooter={() => null}
          deletedMessagesVisibilityType={"never"}
          MessageReplies={() => (
            <MessageReplies
              repliesCurveColor={theme.gray[500]}
              noBorder={true}
            />
          )}
          MessageRepliesAvatars={(props) => (
            <AvatarsContainer>
              <MessageRepliesAvatars {...props} />
            </AvatarsContainer>
          )}
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
          )}
        >
          <MessageList
            onThreadSelect={(message) => {
              if (route?.params?.channel?.id) {
                navigation.navigate("ThreadScreen", { channel, message });
              }
            }}
          />
          <MessageInput />
        </Channel>
      </SafeAreaView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131313",
  },
});

const Container = styled.View`
  flex: 1;
`;

const MessageHeaderContainer = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: ${(props) => props.theme.spacing[2]};
  margin-top: -4px;
`;

const AvatarsContainer = styled.View`
  /* background-color: green; */
  margin-top: 5px;
  /* position: absolute; */
`;
