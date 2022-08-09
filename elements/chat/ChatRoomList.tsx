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

const sort = { created_at: 1 };
const options = {
  state: true,
  watch: true,
};

const CustomListItem = (props: any) => {
  const { channel } = props.channelData;
  const { data } = channel;
  const navigation = useNavigation();

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

const EmptyChannelList = () => {
  return (
    <NoChannelsContainer>
      <Typography text="HELLO WORLD" />
    </NoChannelsContainer>
  );
};

export const ChatRoomList = ({ navigation, ...props }: any): any => {
  const { clientIsReady } = useChatClient();
  const { selectedRealm } = useAppSelector((state) => state.realms);
  const { publicKey } = useAppSelector((state) => state.wallet);
  const { isAuthenticating, chatUserToken } = useAppSelector(
    (state) => state.chat
  );

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
          sort={sort}
          emptyStateIndicator={() => <EmptyChannelList />}
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
  background-color: ${(props: any) =>
    props.isSelected ? props.theme.gray[600] : props.theme.gray[900]};
`;

const EmptyView = styled.View``;

const NoChannelsContainer = styled.View`
  flex: 1;
  width: 400px;
  height: 400px;
`;
