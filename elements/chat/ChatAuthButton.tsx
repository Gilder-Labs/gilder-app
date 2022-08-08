import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Button } from "../../components";
import { usePhantom } from "../../hooks/usePhantom";
import axios from "axios";
import { signMessageWithKey } from "../../utils/signMessageWithKey";

export const ChatAuthButton = () => {
  const { signedMessage, signMessage } = usePhantom();
  const { publicKey, walletType } = useAppSelector((state) => state.wallet);
  const { selectedRealm } = useAppSelector((state) => state.realms);

  useEffect(() => {
    const getJWT = async () => {
      console.log("Signed message sent to api", signedMessage);
      const response = await axios.post(
        `https://gilderapi.ctrlrlabs.com/authenticate`,
        {
          pubKey: publicKey,
          message: signedMessage,
          realm: {
            governanceId: selectedRealm?.governanceId,
            pubKey: selectedRealm?.pubKey,
          },
        }
      );
      console.log("API RESPONSE", response);
    };

    if (signedMessage) {
      console.log("authenticating");
      getJWT();
    }
  }, [signedMessage]);

  const authIntoChat = async () => {
    if (walletType === "phantom") {
      await signMessage();
    } else if (walletType === "web3auth") {
      const message =
        "Proving DAO membership to authenticate into Gilder Chat.";
      const signedMessageWithKey = await signMessageWithKey(message);
      const response = await axios.post(
        `https://gilderapi.ctrlrlabs.com/authenticate`,
        {
          pubKey: publicKey,
          message: signedMessageWithKey,
          realm: {
            governanceId: selectedRealm?.governanceId,
            pubKey: selectedRealm?.pubKey,
          },
        }
      );
    } else {
      console.log("no wallet connected");
    }
  };

  return <Button title="Auth into chat" onPress={authIntoChat} />;
};
