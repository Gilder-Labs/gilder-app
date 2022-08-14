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
  MessageTouchableHandlerPayload,
} from "stream-chat-expo"; // Or stream-chat-expo
import { StyleSheet, Text, SafeAreaView, View } from "react-native";
import styled from "styled-components";
import { useHeaderHeight } from "@react-navigation/elements";
import { useEffect } from "react";
import { useChatClient } from "../hooks/useChatClient";
import { Typography } from "../components";
import { abbreviatePublicKey } from "../utils";
import { useTheme } from "styled-components";
import { ChatActionModal } from "../elements/chat/ChatActionModal";
import * as Haptics from "expo-haptics";
import { ChatMessageFooter } from "../elements/chat/ChatMessageFooter";
import { Messagereply } from "../elements/chat/MessageReply";

export default function ChannelScreen(props: any) {
  const { route, navigation } = props;
  const theme = useTheme();
  const {
    params: { channel },
  } = route;
  const headerHeight = useHeaderHeight();
  const { setTopInset } = useAttachmentPickerContext();
  const [toggleChannel, setToggleChannel] = useState(false);
  const [isVisble, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] =
    useState<MessageTouchableHandlerPayload | null>(null);

  useEffect(() => {
    setTopInset(headerHeight);
  }, [headerHeight]);

  // Stupid hack to update channel with drawers becuse <Channel> doesn't update when changing channel/route.
  useEffect(() => {
    setToggleChannel(true);
    const timer = setTimeout(() => {
      setToggleChannel(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [channel]);

  if (toggleChannel) {
    return <Container />;
  }

  const handleMessageLongPress = (message: MessageTouchableHandlerPayload) => {
    setSelectedMessage(message);
    setModalVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <Container>
      <SafeAreaView style={styles.container}>
        <Channel
          channel={channel}
          keyboardVerticalOffset={headerHeight}
          enableMessageGroupingByUser={false}
          forceAlignMessages={"left"}
          ReactionList={() => null}
          maxTimeBetweenGroupedMessages={30000}
          MessageSimple={() => <MessageSimple />}
          MessageFooter={() => <ChatMessageFooter />}
          onLongPressMessage={(props) => handleMessageLongPress(props)}
          deletedMessagesVisibilityType={"never"}
          MessageReplies={() => (
            <MessageReplies
              repliesCurveColor={theme.gray[500]}
              noBorder={true}
            />
          )}
          Reply={() => <Messagereply />}
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
          <ChatActionModal
            isVisible={isVisble}
            setModalVisible={(isVisible) => setModalVisible(isVisible)}
            message={selectedMessage}
          />
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
  /* margin-bottom: ${(props) => props.theme.spacing[1]}; */
  margin-top: -4px;
`;

const AvatarsContainer = styled.View`
  /* background-color: green; */
  margin-top: 5px;
  /* position: absolute; */
`;
