import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { chatApiKey } from "../constants/Chat";

// TODO: Get chat auth token from our backend middleware
export const chatUserToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZ2lsZGVyLXRlc3QifQ.sNSNzApt4nlHLkXje_3WimFMfvGFmIoyoFEXIOAYyMo";
export const chatUserName = "gilder-test";
export const chatUserId = "gilder-test";
const user = {
  id: chatUserId,
  name: chatUserName,
  image:
    "https://pbs.twimg.com/profile_images/1388190472544264193/TH223rLe_400x400.jpg",
};

const chatClient = StreamChat.getInstance(chatApiKey);

export const useChatClient = () => {
  const [clientIsReady, setClientIsReady] = useState(false);

  useEffect(() => {
    const setupClient = async () => {
      try {
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
    if (!chatClient.userID) {
      setupClient();
    }
  }, []);

  return {
    clientIsReady,
    chatClient,
  };
};
