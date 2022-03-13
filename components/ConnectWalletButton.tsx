import React, { useState } from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import * as Unicons from "@iconscout/react-native-unicons";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import { RPC_CONNECTION } from "../constants/Solana";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import OpenLogin, { LoginProvider, Network } from "openlogin-expo-sdk";
import Constants, { AppOwnership } from "expo-constants";
import * as Linking from "expo-linking";
import { getED25519Key } from "@toruslabs/openlogin-ed25519";
import bs58 from "bs58";
import { abbreviatePublicKey } from "../utils";
import { setWallet, openWallet } from "../store/walletSlice";

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
  const dispatch = useAppDispatch();
  const { publicKey } = useAppSelector((state) => state.wallet);
  const [key, setKey] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const login = async () => {
    try {
      const openlogin = new OpenLogin({
        clientId:
          "BAuRcQ4h95bd4sIZ1gy1iRVCGAGzn0JK30mbgzEN404myjo02xKOw0t0B7ImCY_jNhl5XGOT7T1Q1cQ9wi-BkUQ",
        network: Network.MAINNET,
        // @ts-ignore
        // redirectUrl only applies for Android SDK, it is designated by iOS SDK in iOS, which is \(bundleId)://auth
        // redirectUrl: 'com.example.openloginreactnativesdk://auth',
      });
      const state = await openlogin.login({
        loginProvider: LoginProvider.ANY,
        redirectUrl: resolvedRedirectUrl,
        // Need to be  paying customer for white label
        // extraLoginOptions: {
        //   whiteLabelData: {
        //     name: "Hello world",
        //     dark: true,
        //   },
        // },
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
      const pubKey = keyPair.publicKey.toString();
      const privateKey = bs58.encode(keyPair.secretKey);

      dispatch(
        setWallet({
          publicKey: pubKey,
          privateKey: privateKey,
          userInfo: userInfo,
        })
      );
    } catch (e) {
      console.error(e);
      setErrorMsg(String(e));
    }
  };

  const handleOpenWallet = () => {
    dispatch(openWallet(""));
  };

  return (
    <ConnectWalletContainer>
      {/* <StyledText>Key: {key}</StyledText>
      <StyledText>Error: {errorMsg}</StyledText>
      <StyledText>Linking URL: {resolvedRedirectUrl.href}</StyledText>
      <StyledText>appOwnership: {Constants.appOwnership}</StyledText>
      <StyledText>
        executionEnvironment: {Constants.executionEnvironment}
      </StyledText> */}
      <ConnectButton onPress={publicKey ? handleOpenWallet : login}>
        <Unicons.UilWallet
          size="20"
          color={theme.gray[400]}
          style={{ marginRight: 8 }}
        />
        <WalletConnectText>
          {publicKey ? abbreviatePublicKey(publicKey) : "Connect Wallet"}
        </WalletConnectText>
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
