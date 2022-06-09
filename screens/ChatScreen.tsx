import { RootTabScreenProps } from "../types";
import styled from "styled-components/native";
import { useState, useRef, useEffect } from "react";
import { Button, Typography, Loading } from "../components";
import { useChatClient } from "../hooks/useChatClient";
import { ChannelList } from "stream-chat-expo"; // Or stream-chat-expo

export const chatUserId = "gilder-test";
const filters = {
  example: "example-apps",
  members: { $in: ["gilder-test"] },
  type: "messaging",
};
const sort = { last_message_at: -1 };

export default function ChatScreen({ navigation }: RootTabScreenProps<"Chat">) {
  const { clientIsReady } = useChatClient();

  // useEffect(() => {}, []);

  if (!clientIsReady) {
    return <Loading />;
  }

  return (
    <Container>
      <ChannelList
        sort={sort}
        onSelect={(channel) => {
          navigation.navigate("ChannelScreen", { channel });
        }}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background: ${(props: any) => props.theme.gray[1000]};
`;
