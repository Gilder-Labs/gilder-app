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

export default function ChannelScreen(props: any) {
  const { route, navigation } = props;
  const {
    params: { channel },
  } = route;
  const headerHeight = useHeaderHeight();
  const { setTopInset } = useAttachmentPickerContext();
  const { chatClient } = useChatClient();

  useEffect(() => {
    setTopInset(headerHeight);
  }, [headerHeight]);

  // console.log("channel", channel);

  return (
    <Container>
      <SafeAreaView style={styles.container}>
        <Channel
          channel={route?.params?.channel}
          keyboardVerticalOffset={headerHeight}
          enableMessageGroupingByUser={true}
          forceAlignMessages={"left"}
          // ReactionList={ReactionList}
          MessageFooter={() => null}
          deletedMessagesVisibilityType={"never"}
          MessageHeader={(props) => (
            <View
              style={{
                flexDirection: "row",
                // backgroundColor: "green",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <Typography
                text={props?.message?.user?.name || ""}
                size="subtitle"
                color="gray"
                shade="400"
                bold={true}
                marginRight="1"
                marginBottom="1"
              />
              <Typography
                text={props?.formattedDate || ""}
                size="caption"
                color="gray"
                shade="600"
                bold={true}
                marginRight="1"
                marginBottom="1"
              />
            </View>
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
