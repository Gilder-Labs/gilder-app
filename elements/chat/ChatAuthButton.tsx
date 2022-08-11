import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Button, Typography } from "../../components";
import { usePhantom } from "../../hooks/usePhantom";
import { signMessageWithKey } from "../../utils/signMessageWithKey";
import { fetchChatUserToken } from "../../store/chatSlice";
import styled from "styled-components/native";

export const ChatAuthButton = () => {
  const { signedMessage, signMessage } = usePhantom();
  const { publicKey, walletType } = useAppSelector((state) => state.wallet);
  const { chatUserToken, isAuthenticating } = useAppSelector(
    (state) => state.chat
  );
  const { selectedRealm } = useAppSelector((state) => state.realms);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (signedMessage) {
      dispatch(fetchChatUserToken({ publicKey, signedMessage: signedMessage }));
    }
  }, [signedMessage]);

  useEffect(() => {
    // If wallet type is web3auth we can automatically fetch user token for chat
    const loginWithWeb3auth = async () => {
      const message =
        "Proving DAO membership to authenticate into Gilder Chat.";
      const web3AuthSignedMessage = await signMessageWithKey(message);
      dispatch(
        fetchChatUserToken({ publicKey, signedMessage: web3AuthSignedMessage })
      );
    };

    if (publicKey && walletType === "web3auth") {
      loginWithWeb3auth();
    }
  }, [publicKey, selectedRealm?.pubKey]);

  const authIntoChat = async () => {
    if (walletType === "phantom") {
      await signMessage();
    } else {
      console.log("no wallet connected");
    }
  };

  return (
    <SignInContainer>
      {publicKey ? (
        <Button
          title={"Sign in with Wallet"}
          onPress={authIntoChat}
          disabled={!publicKey}
          textColor="gray"
          textShade="400"
        />
      ) : (
        <Typography
          size="subtitle"
          shade="500"
          text="Connect wallet to access chat."
        />
      )}
    </SignInContainer>
  );
};

const SignInContainer = styled.View`
  padding-left: ${(props) => props.theme.spacing[3]};
  padding-right: ${(props) => props.theme.spacing[3]};
`;
