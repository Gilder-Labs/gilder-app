import {
  Channel,
  MessageList,
  MessageInput,
  useAttachmentPickerContext,
} from "stream-chat-expo"; // Or stream-chat-expo
import { StyleSheet, Text, SafeAreaView } from "react-native";
import styled from "styled-components";
import { useHeaderHeight } from "@react-navigation/elements";
import { useEffect } from "react";

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
          channel={route?.params?.channel}
          keyboardVerticalOffset={headerHeight}
          enableMessageGroupingByUser={true}
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
