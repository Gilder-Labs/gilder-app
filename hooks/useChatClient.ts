import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { chatApiKey } from "../constants/Chat";
import { abbreviatePublicKey } from "../utils";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useCardinalIdentity } from "./useCardinaldentity";

const chatClient = StreamChat.getInstance(chatApiKey);

export const useChatClient = () => {
  const [clientIsReady, setClientIsReady] = useState(false);
  const dispatch = useAppDispatch();
  const { publicKey, walletType, userInfo } = useAppSelector(
    (state) => state.wallet
  );
  const { chatUserToken } = useAppSelector((state) => state.chat);
  const [twitterURL, twitterHandle] = useCardinalIdentity(publicKey);

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
        if (chatUserToken) {
          await chatClient.connectUser(user, chatUserToken);
        }
        setClientIsReady(true);
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            `An error occurred while connecting the user: ${error.message}`
          );
        }
      }
    };

    const disconnectClient = async () => {
      try {
        if (chatUserToken) {
          await chatClient.disconnectUser();
        }
        setClientIsReady(false);
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            `An error occurred while disconnecting the user: ${error.message}`
          );
        }
      }
    };

    // If the chat client has a value in the field `userID`, a user is already connected
    // and we can skip trying to connect the user again.
    if (publicKey && chatUserToken) {
      setupClient();
    } else if (!publicKey && clientIsReady) {
      disconnectClient;
    }
  }, [publicKey, chatUserToken]);

  return {
    clientIsReady,
    chatClient,
  };
};
