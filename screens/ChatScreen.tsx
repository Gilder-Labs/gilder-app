import { RootTabScreenProps } from "../types";
import styled from "styled-components/native";
import { useState, useRef, useEffect } from "react";
import { Button, Typography, Loading } from "../components";
import { useChatClient } from "../hooks/useChatClient";
import { ChannelList, ChannelPreviewMessenger } from "stream-chat-expo"; // Or stream-chat-expo

export const chatUserId = "gilder-test";
// const filters = {
//   example: "example-apps",
//   members: { $in: ["gilder-test"] },
//   type: "messaging",
// };

const sort = { last_message_at: -1 };
const options = {
  state: true,
  watch: true,
};

const CustomListItem = (props) => {
  return (
    <ChannelView>
      <ChannelPreviewMessenger {...props} PreviewMessage={EmptyView} />
    </ChannelView>
  );
};

export default function ChatScreen({ navigation }: RootTabScreenProps<"Chat">) {
  const { clientIsReady } = useChatClient();

  // useEffect(() => {}, []);

  if (!clientIsReady) {
    return <Loading />;
  }

  return (
    <ChannelList
      // filters={filters}
      Preview={CustomListItem}
      onSelect={(channel) => {
        navigation.navigate("ChannelScreen", { channel });
      }}
      options={options}
      sort={sort}
    />
  );
}

const Container = styled.View`
  flex: 1;
  background: ${(props: any) => props.theme.gray[1000]};
`;

const ChannelView = styled.View`
  background: green;
  padding: 8px;
  flex: 1;
`;

const EmptyView = styled.View``;
