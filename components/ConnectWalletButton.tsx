import React, { useState } from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import * as Unicons from "@iconscout/react-native-unicons";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import { RPC_CONNECTION } from "../constants/Solana";

import OpenLogin, { LoginProvider, Network } from "openlogin-expo-sdk";
import Constants, { AppOwnership } from "expo-constants";
import * as Linking from "expo-linking";
import { getED25519Key } from "@toruslabs/openlogin-ed25519";

import { URL } from "react-native-url-polyfill";

// Change this to genesys rpc
const networks = {
  mainnet: {
    url: "https://solana-api.projectserum.com",
    displayName: "Mainnet Beta",
  },
  devnet: { url: clusterApiUrl("devnet"), displayName: "Devnet" },
  testnet: { url: clusterApiUrl("testnet"), displayName: "Testnet" },
};

const scheme = "openloginexposdkexampleexpo";
const resolvedRedirectUrl =
  Constants.appOwnership == AppOwnership.Expo ||
  Constants.appOwnership == AppOwnership.Guest
    ? new URL(Linking.createURL("openlogin", {}))
    : new URL(Linking.createURL("openlogin", { scheme: scheme }));

interface ConnectWalletProps {}

export const ConnectWalletButton = ({}: ConnectWalletProps) => {
  const theme = useTheme();
  const [key, setKey] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const login = async () => {
    try {
      const openlogin = new OpenLogin({
        clientId:
          "BAuRcQ4h95bd4sIZ1gy1iRVCGAGzn0JK30mbgzEN404myjo02xKOw0t0B7ImCY_jNhl5XGOT7T1Q1cQ9wi-BkUQ",
        network: Network.MAINNET,
      });
      const state = await openlogin.login({
        loginProvider: LoginProvider.ANY,
        redirectUrl: resolvedRedirectUrl,
      });
      // get social login user info
      const userInfo = await state.userInfo;
      console.log("state", state);
      // web3auth private key
      setKey(state.privKey || "no key");

      // generate our solana secret from web3auth and create new solana wallet
      // @ts-ignore
      const { sk } = getED25519Key(state.privKey);
      const keyPair = Keypair.fromSecretKey(sk);
      // public key of our new wallet
      const publicKey = keyPair.publicKey.toString();

      // TODO: Handle wallet store locally

      // const accountInfo = await connection.getParsedAccountInfo(
      //   new PublicKey("5YWDXAX1xygHp4t7wjmPzzfWuybEuKWmd3ojUBnJtkxq"),
      //   "confirmed"
      // );
      // console.log("Account info", accountInfo);
    } catch (e) {
      console.error(e);
      setErrorMsg(String(e));
    }
  };

  return (
    <ConnectWalletContainer>
      <StyledText>Key: {key}</StyledText>
      <StyledText>Error: {errorMsg}</StyledText>
      <StyledText>Linking URL: {resolvedRedirectUrl.href}</StyledText>
      <StyledText>appOwnership: {Constants.appOwnership}</StyledText>
      <StyledText>
        executionEnvironment: {Constants.executionEnvironment}
      </StyledText>
      <ConnectButton onPress={login}>
        <Unicons.UilWallet
          size="20"
          color={theme.gray[400]}
          style={{ marginRight: 8 }}
        />
        <WalletConnectText>Connect Wallet</WalletConnectText>
      </ConnectButton>
    </ConnectWalletContainer>
  );
};

const ConnectWalletContainer = styled.View`
  background: ${(props) => props.theme.gray[900]};

  padding: ${(props) => props.theme.spacing[3]};
  padding-bottom: ${(props) => props.theme.spacing[5]};
  border-top-width: 1px;
  border-color: ${(props) => props.theme.gray[900]};
`;

const WalletConnectText = styled.Text`
  color: ${(props) => props.theme.gray[400]};
`;

const ConnectButton = styled.TouchableOpacity`
  flex-direction: row;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-bottom: 80px;

  background: ${(props) => props.theme.gray[800]};
`;

const StyledText = styled.Text`
  color: white;
`;
