import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { chatApiKey } from "../constants/Chat";
import { abbreviatePublicKey } from "../utils";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

const chatClient = StreamChat.getInstance(chatApiKey);

export const useChatClient = () => {
  const [clientIsReady, setClientIsReady] = useState(false);
  const dispatch = useAppDispatch();
  const { publicKey, walletType } = useAppSelector((state) => state.wallet);
  const { chatUserToken } = useAppSelector((state) => state.chat);

  useEffect(() => {
    const setupClient = async () => {
      try {
        const user = {
          id: publicKey,
          name: abbreviatePublicKey(publicKey),
          // image:
          //   "https://pbs.twimg.com/profile_images/1537771549641453568/6i7oLK_z_400x400.png",
        };
        await chatClient.connectUser(user, chatUserToken);
        setClientIsReady(true);
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            `An error occurred while connecting the user: ${error.message}`
          );
        }
      }
    };

    // If the chat client has a value in the field `userID`, a user is already connected
    // and we can skip trying to connect the user again.
    if (!chatClient.userID && publicKey && chatUserToken) {
      setupClient();
    }
  }, [publicKey, chatUserToken]);

  return {
    clientIsReady,
    chatClient,
  };
};
