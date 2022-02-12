import React, { useState } from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import * as Unicons from "@iconscout/react-native-unicons";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";

import OpenLogin, { LoginProvider, Network } from "openlogin-expo-sdk";
import Constants, { AppOwnership } from "expo-constants";
import * as Linking from "expo-linking";
import { getED25519Key } from "@toruslabs/openlogin-ed25519";

import { URL } from "react-native-url-polyfill";

const networks = {
  mainnet: {
    url: "https://solana-api.projectserum.com",
    displayName: "Mainnet Beta",
  },
  devnet: { url: clusterApiUrl("devnet"), displayName: "Devnet" },
  testnet: { url: clusterApiUrl("testnet"), displayName: "Testnet" },
};

const solanaNetwork = networks.devnet;
const connection = new Connection(solanaNetwork.url);

// const solanaChainConfig: CustomChainConfig = {
//   chainNamespace: CHAIN_NAMESPACES.SOLANA,
//   rpcTarget: "https://api.testnet.solana.com",
//   blockExplorer: "https://explorer.solana.com?cluster=testnet",
//   chainId: "0x2",
//   displayName: "testnet",
//   ticker: "SOL",
//   tickerName: "solana",
// };

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

  // const login = async () => {
  //   try {
  //     const openlogin = new OpenLogin({
  //       clientId:
  //         "BAuRcQ4h95bd4sIZ1gy1iRVCGAGzn0JK30mbgzEN404myjo02xKOw0t0B7ImCY_jNhl5XGOT7T1Q1cQ9wi-BkUQ",
  //       network: Network.MAINNET,
  //     });
  //     const state = await openlogin.login({
  //       loginProvider: LoginProvider.TWITCH,
  //       redirectUrl: resolvedRedirectUrl,
  //     });
  //     const userInfo = await state.userInfo;
  //     console.log("userInfo", userInfo);
  //     console.log("state", state);
  //     setKey(state.privKey || "no key");
  //     console.log("private key?", state.privKey);

  //     const { sk } = getED25519Key(bs58.encode(state.privKey));
  //     let encodedSecretKey = bs58.encode(sk);
  //     console.log("Encoded key", encodedSecretKey);
  //     // console.log("solana Private key", sk.toString());
  //     // const account = Keypair.fromSecretKey(encodedSecretKey);
  //     // const accountInfo = await connection.getAccountInfo(account.publicKey);
  //     // console.log("Public Key", account.publicKey);
  //     // console.log("Account Info", accountInfo);
  //   } catch (e) {
  //     console.error(e);
  //     setErrorMsg(String(e));
  //   }
  // };

  return (
    <ConnectWalletContainer>
      {/* <StyledText>Key: {key}</StyledText>
      <StyledText>Error: {errorMsg}</StyledText>
      <StyledText>Linking URL: {resolvedRedirectUrl.href}</StyledText>
      <StyledText>appOwnership: {Constants.appOwnership}</StyledText>
      <StyledText>
        executionEnvironment: {Constants.executionEnvironment}
      </StyledText> */}
      <ConnectButton>
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
