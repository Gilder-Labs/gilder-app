import { useState } from "react";
import {
  Channel,
  MessageList,
  MessageInput,
  useAttachmentPickerContext,
  ReactionList,
} from "stream-chat-expo"; // Or stream-chat-expo
import { StyleSheet, Text, SafeAreaView, View } from "react-native";
import styled from "styled-components";
import { useHeaderHeight } from "@react-navigation/elements";
import { useEffect } from "react";
import { useChatClient } from "../hooks/useChatClient";
import { Typography } from "../components";
import { abbreviatePublicKey } from "../utils";
import { AnimatedImage } from "react-native-ui-lib";

export default function ChannelScreen(props: any) {
  const { route, navigation } = props;
  const {
    params: { channel },
  } = route;
  const headerHeight = useHeaderHeight();
  const { setTopInset } = useAttachmentPickerContext();

  useEffect(() => {
    setTopInset(headerHeight);
  }, [headerHeight]);

  return (
    <Container>
      <SafeAreaView style={styles.container}>
        <Channel
          channel={channel}
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
