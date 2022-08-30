import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { chatApiKey } from "../constants/Chat";
import { abbreviatePublicKey } from "../utils";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useCardinalIdentity } from "./useCardinaldentity";
import { disconnectChat } from "../store/chatSlice";

interface genericObj {
  [key: string]: any;
}

const chatClient = StreamChat.getInstance(chatApiKey);

export const useChatClient = () => {
  const [clientIsReady, setClientIsReady] = useState(false);
  const [clientConnecting, setClientConnecting] = useState(false);
  const dispatch = useAppDispatch();
  const { publicKey, walletType, userInfo } = useAppSelector(
    (state) => state.wallet
  );
  const { chatUserToken } = useAppSelector((state) => state.chat);
  const { twitterURL, twitterHandle } = useCardinalIdentity(publicKey);
  const [realmsWithUnread, setRealmsWithUnread] = useState<genericObj>({});

  // useEffect(() => {
  //   const getNotifications = async () => {
  //     if (clientIsReady && chatUserToken && publicKey) {
  //       const filters = {
  //         members: { $in: [publicKey] },
  //         type: "team",
  //       };

  //       const channels = await chatClient.queryChannels(filters);
  //       const unreadChannels = {} as genericObj;

  //       channels.forEach((channel) => {
  //         const realmId = channel?.data?.team;
  //         if (channel?.countUnread() > 1 && realmId) {
  //           unreadChannels[realmId as string] = true;
  //         } else {
  //           unreadChannels[realmId as string] =
  //             !!unreadChannels[realmId as string];
  //         }
  //       });

  //       setRealmsWithUnread(unreadChannels);
  //     }
  //   };

  //   getNotifications();
  // }, [chatUserToken, clientIsReady, publicKey]);

  // TODO: move this outside of the hook for performance
  // useEffect(() => {
  //   let chatClientListener;

  //   if (publicKey && clientIsReady && chatUserToken) {
  //     chatClientListener = chatClient.on((event) => {
  //       if (event.type === "message.new") {
  //         const teamIdOfUpdate = event?.team;
  //         const updatedTeamsWithUnread = { ...realmsWithUnread };
  //         if (teamIdOfUpdate) {
  //           updatedTeamsWithUnread[teamIdOfUpdate] = true;
  //         }

  //         setRealmsWithUnread(updatedTeamsWithUnread);
  //       }
  //     });
  //   }

  //   return () => {
  //     chatClientListener?.unsubscribe();
  //   };
  // }, [publicKey, clientIsReady]);

  useEffect(() => {
    const setupClient = async () => {
      try {
        const user = {
          id: publicKey,
          name: twitterHandle
            ? twitterHandle
            : userInfo?.name
            ? userInfo?.name
            : abbreviatePublicKey(publicKey),
          image: twitterURL ? twitterURL : userInfo?.profileImage,
        };
        if (chatUserToken && !clientConnecting) {
          setClientConnecting(true);
          await chatClient.connectUser(user, chatUserToken);
        }
        setClientIsReady(true);
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            `An error occurred while connecting the user: ${error.message}`
          );
        }
        setClientConnecting(false);
      }
    };

    // If the chat client has a value in the field `userID`, a user is already connected
    // and we can skip trying to connect the user again.
    if (publicKey && chatUserToken) {
      setupClient();
    }
  }, [publicKey, chatUserToken]);

  const disconnectClient = async () => {
    try {
      if (chatUserToken) {
        setClientIsReady(false);
        setClientConnecting(false);

        // Hacky way to fix race condition that happens when a user in on the channel screen but disconnects
        setTimeout(async () => {
          dispatch(disconnectChat(""));
          await chatClient.disconnectUser();
        }, 1000);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `An error occurred while disconnecting the user: ${error.message}`
        );
      }
    }
  };

  return {
    clientIsReady,
    chatClient,
    disconnectClient,
    realmsWithUnread,
  };
};
