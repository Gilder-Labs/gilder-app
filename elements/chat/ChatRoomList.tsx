import styled from "styled-components/native";
import { Button, Typography, Loading } from "../../components";
import { useChatClient } from "../../hooks/useChatClient";
import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelProps,
} from "stream-chat-expo"; // Or stream-chat-expo
import { useNavigation } from "@react-navigation/native";
import { ChatAuthButton } from "./ChatAuthButton";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { ActivityIndicator } from "react-native";
import { setChannelId } from "../../store/chatSlice";

const sort = { created_at: 1 };
const options = {
  state: true,
  watch: true,
};

const CustomListItem = ({ channelData }: any) => {
  const { channel } = channelData;
  const { data } = channel;
  const navigation = useNavigation();
  const { selectedChannelId } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();

  const isUnread = channel?.state?.unreadCount > 0;

  const handleSelect = () => {
    dispatch(setChannelId({ channelId: channel?.cid }));
    navigation.navigate("ChannelScreen", { channel });
  };

  return (
    <ChannelItemButton
      // @ts-ignore
      onPress={() => handleSelect()}
      isSelected={selectedChannelId === channel?.cid}
    >
      <Typography
        text={`#  ${data?.name}`}
        shade={isUnread || selectedChannelId === channel?.cid ? "300" : "500"}
        marginLeft="5"
        bold={isUnread ? true : false}
        marginBottom="0"
      />
    </ChannelItemButton>
  );
};

const EmptyChannelList = () => {
  return (
    <NoChannelsContainer>
      <Typography
        size="subtitle"
        shade="500"
        text="Become a member to have access to chat channels."
      />
    </NoChannelsContainer>
  );
};

export const ChatRoomList = (props: any): any => {
  const { clientIsReady } = useChatClient();
  const { selectedRealm } = useAppSelector((state) => state.realms);
  const { publicKey } = useAppSelector((state) => state.wallet);
  const { isAuthenticating, chatUserToken } = useAppSelector(
    (state) => state.chat
  );

  // const navIndex = props.navigation.getState().index;
  // const selectedRoute = props.state.routes?.[navIndex].name;

  const filters = {
    members: { $in: [publicKey] },
    team: { $in: [selectedRealm?.pubKey] },
    type: "team",
  };

  return (
    <Container>
      {clientIsReady && publicKey ? (
        <ChannelList
          filters={filters}
          Preview={(props) => <CustomListItem channelData={props} />}
          options={options}
          // sort={sort}
          EmptyStateIndicator={() => <EmptyChannelList />}
        />
      ) : isAuthenticating && publicKey ? (
        <ActivityIndicator />
      ) : (
        <ChatAuthButton />
      )}
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
  border-radius: 4;
  margin-left: ${(props: any) => props.theme.spacing[3]};
  margin-right: ${(props: any) => props.theme.spacing[3]};
  background-color: ${(props: any) =>
    props.isSelected ? `${props.theme.gray[800]}aa` : props.theme.gray[900]};
`;

const EmptyView = styled.View``;

const NoChannelsContainer = styled.View`
  flex: 1;
  padding-left: ${(props: any) => props.theme.spacing[3]};
  padding-right: ${(props: any) => props.theme.spacing[3]};
`;
