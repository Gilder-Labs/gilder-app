import React, { useState } from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { Keypair } from "@solana/web3.js";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import Constants, { AppOwnership } from "expo-constants";
import * as Linking from "expo-linking";
import { getED25519Key } from "@toruslabs/openlogin-ed25519";
import bs58 from "bs58";
import { abbreviatePublicKey } from "../utils";
import { setWallet, openWallet } from "../store/walletSlice";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import Web3Auth, {
  LOGIN_PROVIDER,
  OPENLOGIN_NETWORK,
} from "@web3auth/react-native-sdk";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Web3AuthLogo from "../assets/images/web3authLogo.svg";

import { URL } from "react-native-url-polyfill";

const scheme = "gilder";
// should resolve as "gilder://" in ios app
const resolvedRedirectUrl =
  Constants.appOwnership == AppOwnership.Expo ||
  Constants.appOwnership == AppOwnership.Guest
    ? Linking.createURL("web3auth", {})
    : Linking.createURL("web3auth", { scheme: scheme });

interface ConnectWalletProps {}

export const ConnectWeb3AuthButton = ({}: ConnectWalletProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { publicKey } = useAppSelector((state) => state.wallet);
  const [key, setKey] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigation = useNavigation();

  const login = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const web3auth = new Web3Auth(WebBrowser, {
        clientId:
          "BAuRcQ4h95bd4sIZ1gy1iRVCGAGzn0JK30mbgzEN404myjo02xKOw0t0B7ImCY_jNhl5XGOT7T1Q1cQ9wi-BkUQ",
        network: OPENLOGIN_NETWORK.MAINNET,
        whiteLabel: { dark: true },
      });

      const state = await web3auth.login({
        // loginProvider: [LOGIN_PROVIDER.TWITTER, LOGIN_PROVIDER.DISCORD],
        redirectUrl: resolvedRedirectUrl,
      });
      const userInfo = await state.userInfo;
      // web3auth private key
      setKey(state.privKey || "no key");

      // generate our solana secret from web3auth and create new solana wallet if one doesn't exist
      // @ts-ignore
      const { sk } = getED25519Key(state.privKey);
      const keyPair = Keypair.fromSecretKey(sk);
      // public key of our new wallet
      const pubKey = keyPair.publicKey.toString();
      const privateKey = bs58.encode(keyPair.secretKey);

      // Securely store wallet info for future use in app and so user doesn't have to keep logging in
      await SecureStore.setItemAsync("privateKey", privateKey);
      const jsonValue = JSON.stringify({
        publicKey: pubKey,
        userInfo: userInfo,
      });
      AsyncStorage.setItem("@walletInfo", jsonValue);

      dispatch(
        setWallet({
          publicKey: pubKey,
          privateKey: privateKey,
          userInfo: userInfo,
          phantomInfo: null,
          walletType: "web3auth",
        })
      );
    } catch (e) {
      console.error(e);
      setErrorMsg(String(e));
    }
  };

  return (
    <ConnectButton onPress={login}>
      <LinearGradient
        colors={[`#0664FF`, `#001ECA`]}
        style={{
          padding: 16,
          borderRadius: 8,
          marginBottom: 8,
          minHeight: 140,
          minWidth: 140,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Web3AuthLogo width={100} height={100} />
      </LinearGradient>
    </ConnectButton>
  );
};

const ConnectButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  max-width: 50%;
  min-width: 140px;
  min-height: 140px;
  margin-right: ${(props) => props.theme.spacing[1]};
`;
