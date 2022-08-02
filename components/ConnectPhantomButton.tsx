import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setWallet, openWallet } from "../store/walletSlice";

import { LinearGradient } from "expo-linear-gradient";
import PhantomGhostLogo from "../assets/images/phantomGhostLogo.svg";
import PhantomTextLogo from "../assets/images/phantomTextLogo.svg";
import * as Linking from "expo-linking";
import nacl from "tweetnacl";
import bs58 from "bs58";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { RPC_CONNECTION } from "../constants/Solana";
const onConnectRedirectLink = Linking.createURL("onConnect");

const buildUrl = (path: string, params: URLSearchParams) =>
  `https://phantom.app/ul/v1/${path}?${params.toString()}`;

const decryptPayload = (
  data: string,
  nonce: string,
  sharedSecret?: Uint8Array
) => {
  if (!sharedSecret) throw new Error("missing shared secret");

  const decryptedData = nacl.box.open.after(
    bs58.decode(data),
    bs58.decode(nonce),
    sharedSecret
  );
  if (!decryptedData) {
    throw new Error("Unable to decrypt data");
  }
  return JSON.parse(Buffer.from(decryptedData).toString("utf8"));
};

const encryptPayload = (payload: any, sharedSecret?: Uint8Array) => {
  if (!sharedSecret) throw new Error("missing shared secret");

  const nonce = nacl.randomBytes(24);

  const encryptedPayload = nacl.box.after(
    Buffer.from(JSON.stringify(payload)),
    nonce,
    sharedSecret
  );

  return [nonce, encryptedPayload];
};

interface ConnectWalletProps {}

export const ConnectPhantomButton = ({}: ConnectWalletProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { publicKey } = useAppSelector((state) => state.wallet);
  const [deepLink, setDeepLink] = useState<string>("");
  const connection = new Connection(RPC_CONNECTION);
  const scrollViewRef = useRef<any>(null);

  // store dappKeyPair, sharedSecret, session and account SECURELY on device
  // to avoid having to reconnect users.
  const [dappKeyPair] = useState(nacl.box.keyPair());
  const [sharedSecret, setSharedSecret] = useState<Uint8Array>();
  const [session, setSession] = useState<string>();
  const [phantomWalletPublicKey, setPhantomWalletPublicKey] =
    useState<PublicKey>();

  useEffect(() => {
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        setDeepLink(initialUrl);
      }
    })();
    Linking.addEventListener("url", handleDeepLink);
    return () => {
      Linking.removeEventListener("url", handleDeepLink);
    };
  }, []);

  const handleDeepLink = ({ url }: Linking.EventType) => {
    setDeepLink(url);
  };

  useEffect(() => {
    if (!deepLink) return;

    const url = new URL(deepLink);
    const params = url.searchParams;

    if (params.get("errorCode")) {
      return;
    }

    if (/onConnect/.test(url.pathname)) {
      const sharedSecretDapp = nacl.box.before(
        bs58.decode(params.get("phantom_encryption_public_key")!),
        dappKeyPair.secretKey
      );

      const connectData = decryptPayload(
        params.get("data")!,
        params.get("nonce")!,
        sharedSecretDapp
      );

      setSharedSecret(sharedSecretDapp);
      setSession(connectData.session);
      setPhantomWalletPublicKey(new PublicKey(connectData.public_key));

      const jsonValue = JSON.stringify({
        publicKey: connectData.public_key,
        userInfo: {},
      });

      AsyncStorage.setItem("@walletInfo", jsonValue);
      dispatch(
        setWallet({
          publicKey: connectData.public_key,
          privateKey: "",
          userInfo: {},
          walletType: "web3auth",
        })
      );
    } else if (/onDisconnect/.test(url.pathname)) {
    }
  }, [deepLink]);

  const connect = async () => {
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      cluster: "mainnet-beta",
      app_url: "https://phantom.app",
      redirect_link: onConnectRedirectLink,
    });

    const url = buildUrl("connect", params);
    Linking.openURL(url);
  };

  return (
    <ConnectButton onPress={() => connect()}>
      <LinearGradient
        colors={[`#4E44CE`, `#6D64E0`]}
        style={{
          padding: 16,
          borderRadius: 8,
          marginBottom: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 140,
          minWidth: 140,
          flex: 1,
        }}
      >
        <LogoContainer>
          <PhantomGhostLogo width={28} height={28} />
        </LogoContainer>
        <PhantomTextLogo width={80} height={80} />
      </LinearGradient>
    </ConnectButton>
  );
};

const ConnectButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 140px;
  min-height: 140px;
  max-width: 50%;
  margin-left: ${(props) => props.theme.spacing[1]};
`;

const LogoContainer = styled.View`
  margin-right: 8px;
`;
