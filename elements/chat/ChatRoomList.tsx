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

const CustomListItem = (props: any) => {
  const { channel } = props.channelData;
  const { data } = channel;
  const navigation = useNavigation();

  // console.log("navigation", navigation.getState());

  const isUnread = channel?.state?.unreadCount > 0;

  const handleSelect = () => {
    navigation.navigate("ChannelScreen", { channel });
    //@ts-ignore
  };

  return (
    <ChannelItemButton
      // @ts-ignore
      onPress={() => handleSelect()}
      isSelected={false}
    >
      <Typography
        text={`#  ${data?.name}`}
        shade={isUnread ? "300" : "500"}
        marginLeft="5"
        bold={isUnread ? true : false}
      />
    </ChannelItemButton>
  );
};

export const ChatRoomList = ({ navigation, ...props }: any): any => {
  const { clientIsReady } = useChatClient();

  return (
    <Container>
      <ChannelList
        // filters={filters}
        Preview={(props) => <CustomListItem channelData={props} />}
        options={options}
        sort={sort}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  height: 100%;
  width: 100%;
  min-height: 20px;
  /* background: ${(props: any) => props.theme.gray[1000]}; */
`;

const ChannelItemButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding-top: ${(props: any) => props.theme.spacing[1]};
  padding-bottom: ${(props: any) => props.theme.spacing[1]};
  min-height: 20px;
  background-color: ${(props: any) =>
    props.isSelected ? props.theme.gray[600] : props.theme.gray[900]};
`;

const EmptyView = styled.View``;
