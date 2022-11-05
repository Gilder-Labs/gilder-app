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
import { setChannelId } from "../../store/chatSlice";
import { useEffect } from "react";
import { signMessageWithKey } from "../../utils/signMessageWithKey";
import { fetchChatUserToken } from "../../store/chatSlice";

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

  const currentRouteIndex = navigation.getState()?.routes?.[0].state?.index;
  let isOnChannelRoute;
  if (currentRouteIndex) {
    isOnChannelRoute =
      navigation.getState()?.routes?.[0].state?.routes?.[currentRouteIndex]
        ?.name === "ChannelScreen";
  }

  return (
    <ChannelItemButton
      // @ts-ignore
      onPress={() => handleSelect()}
      isSelected={selectedChannelId === channel?.cid && isOnChannelRoute}
    >
      <Typography
        text={`#  ${data?.name}`}
        shade={
          isUnread || (selectedChannelId === channel?.cid && isOnChannelRoute)
            ? "300"
            : "500"
        }
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

const sort = [
  {
    name: 1,
  },
];

export const ChatRoomList = (props: any): any => {
  const { clientIsReady } = useChatClient();
  const { selectedRealm } = useAppSelector((state) => state.realms);
  const { publicKey, walletType } = useAppSelector((state) => state.wallet);
  const { isAuthenticating, chatUserToken } = useAppSelector(
    (state) => state.chat
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    // If wallet type is web3auth we can automatically fetch user token for chat
    const loginWithWeb3auth = async () => {
      const message = "Proving DAO membership to authenticate into chat.";
      const web3AuthSignedMessage = await signMessageWithKey(message);
      dispatch(
        fetchChatUserToken({ publicKey, signedMessage: web3AuthSignedMessage })
      );
    };

    if (publicKey && walletType === "web3auth") {
      loginWithWeb3auth();
    }
  }, [publicKey]);

  const filters = {
    members: { $in: [publicKey] },
    team: { $in: [selectedRealm?.pubKey] },
    type: "team",
  };

  return (
    <Container>
      {clientIsReady && publicKey && !isAuthenticating ? (
        <ChannelList
          filters={filters}
          Preview={(props) => <CustomListItem channelData={props} />}
          options={options}
          sort={sort}
          Skeleton={() => null}
          lockChannelOrder={true}
          EmptyStateIndicator={() =>
            !chatUserToken && walletType === "web3auth" ? (
              <EmptyChannelList />
            ) : (
              <ChatAuthButton />
            )
          }
        />
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
  border-radius: 4px;
  margin-left: ${(props: any) => props.theme.spacing[3]};
  margin-right: ${(props: any) => props.theme.spacing[3]};
  background-color: ${(props: any) =>
    props.isSelected ? `${props.theme.gray[800]}aa` : props.theme.gray[900]};
`;

const NoChannelsContainer = styled.View`
  flex: 1;
  padding-left: ${(props: any) => props.theme.spacing[3]};
  padding-right: ${(props: any) => props.theme.spacing[3]};
`;
