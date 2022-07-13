import { RootTabScreenProps } from "../../types";
import styled from "styled-components/native";
import { useState, useRef, useEffect } from "react";
import { Button, Typography, Loading } from "../../components";
import { useChatClient } from "../../hooks/useChatClient";
import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelProps,
} from "stream-chat-expo"; // Or stream-chat-expo
import { useNavigation } from "@react-navigation/native";

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

const CustomListItem = (props: ChannelProps) => {
  console.log("Chat props", props);
  const { channel } = props;
  const { data } = channel;
  const navigation = useNavigation();

  const isUnread = channel?.state?.unreadCount > 0;

  return (
    <ChannelItemButton
      onPress={() => navigation.navigate("ChannelScreen", { channel })}
    >
      <Typography
        text={`#  ${data?.name}`}
        shade={isUnread ? "300" : "400"}
        marginLeft="5"
        bold={isUnread ? true : false}
      />
    </ChannelItemButton>
  );
};

export const ChatRoomList = ({ navigation }: any): any => {
  const { clientIsReady } = useChatClient();

  return (
    <Container>
      <ChannelList
        // filters={filters}
        Preview={CustomListItem}
        onSelect={(channel) => {
          navigation.navigate("ChannelScreen", { channel });
        }}
        options={options}
        sort={sort}
      />
    </Container>
  );
};

const Container = styled.View`
  /* background: ${(props: any) => props.theme.gray[1000]}; */
`;

const ChannelItemButton = styled.TouchableOpacity`
  padding-top: ${(props: any) => props.theme.spacing[1]};
  padding-bottom: ${(props: any) => props.theme.spacing[1]};
`;

const EmptyView = styled.View``;
