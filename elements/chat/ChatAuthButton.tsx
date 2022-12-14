import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Button, Typography } from "../../components";
import { usePhantom } from "../../hooks/usePhantom";
import { fetchChatUserToken } from "../../store/chatSlice";
import styled from "styled-components/native";
import { ActivityIndicator } from "react-native";
import { useChatClient } from "../../hooks/useChatClient";

export const ChatAuthButton = () => {
  const { signedMessage, signMessage } = usePhantom();
  const { publicKey, walletType } = useAppSelector((state) => state.wallet);
  const { clientIsReady } = useChatClient();
  const dispatch = useAppDispatch();
  const { isAuthenticating, chatUserToken } = useAppSelector(
    (state) => state.chat
  );

  useEffect(() => {
    if (signedMessage) {
      dispatch(fetchChatUserToken({ publicKey, signedMessage: signedMessage }));
    }
  }, [signedMessage]);

  const authIntoChat = async () => {
    if (walletType === "phantom") {
      await signMessage();
    } else {
      console.log("no wallet connected");
    }
  };

  if (isAuthenticating || (clientIsReady && walletType === "web3auth")) {
    return <ActivityIndicator />;
  }

  return (
    <SignInContainer>
      {publicKey && walletType && !chatUserToken ? (
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
          text={
            chatUserToken && publicKey
              ? "Become a member to have access to chat channels."
              : "Connect wallet to access chat."
          }
        />
      )}
    </SignInContainer>
  );
};

const SignInContainer = styled.View`
  padding-left: ${(props) => props.theme.spacing[3]};
  padding-right: ${(props) => props.theme.spacing[3]};
`;
