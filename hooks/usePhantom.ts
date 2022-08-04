import { Buffer } from "buffer";
global.Buffer = global.Buffer || Buffer;
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

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useEffect, useState } from "react";
import { RPC_CONNECTION } from "../constants/Solana";
import { setWallet, disconnectWallet } from "../store/walletSlice";
import * as SecureStore from "expo-secure-store";

const onConnectRedirectLink = Linking.createURL("onConnect");
const onDisconnectRedirectLink = Linking.createURL("onDisconnect");
const onSignAndSendTransactionRedirectLink = Linking.createURL(
  "onSignAndSendTransaction"
);
const onSignAllTransactionsRedirectLink = Linking.createURL(
  "onSignAllTransactions"
);
const onSignTransactionRedirectLink = Linking.createURL("onSignTransaction");
const onSignMessageRedirectLink = Linking.createURL("onSignMessage");

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

export const usePhantom = () => {
  const dispatch = useAppDispatch();
  const { publicKey } = useAppSelector((state) => state.wallet);
  const [deepLink, setDeepLink] = useState<string>("");
  const connection = new Connection(RPC_CONNECTION);
  const [dappKeyPair, setDappKeyPair] = useState(nacl.box.keyPair());

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
    (async () => {
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

        // Keep track of public key
        const jsonValue = JSON.stringify({
          publicKey: connectData.public_key,
          userInfo: {},
        });

        // Securely store phantom info
        const securePhantomInfo = JSON.stringify({
          session: connectData.session,
          // convert to regular array for storage, can't store uint8Array
          sharedSecretDapp: Array.from(sharedSecretDapp),
          dappKeyPair: {
            publicKey: Array.from(dappKeyPair.publicKey),
            secretKey: Array.from(dappKeyPair.secretKey),
          },
        });

        await SecureStore.setItemAsync("phantomInfo", securePhantomInfo);

        AsyncStorage.setItem("@walletInfo", jsonValue);
        dispatch(
          setWallet({
            publicKey: connectData.public_key,
            userInfo: {},
            walletType: "phantom",
          })
        );
      } else if (/onDisconnect/.test(url.pathname)) {
        dispatch(disconnectWallet());
      }
    })();
  }, [deepLink]);

  const disconnect = async () => {
    const walletInfoJSON = await SecureStore.getItemAsync("phantomInfo");
    const phantomInfo = walletInfoJSON ? JSON.parse(walletInfoJSON) : {};
    const { session, sharedSecretDapp, dappKeyPair } = phantomInfo;

    const payload = {
      session: session,
    };
    const [nonce, encryptedPayload] = encryptPayload(
      payload,
      Uint8Array.from(sharedSecretDapp)
    );

    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(
        Uint8Array.from(dappKeyPair?.publicKey)
      ),
      nonce: bs58.encode(nonce),
      redirect_link: onDisconnectRedirectLink,
      payload: bs58.encode(encryptedPayload),
    });

    const url = buildUrl("disconnect", params);
    Linking.openURL(url);
  };

  const signMessage = async () => {
    const message =
      "To avoid digital dognappers, sign below to authenticate with CryptoCorgis.";

    const walletInfoJSON = await SecureStore.getItemAsync("phantomInfo");
    const phantomInfo = walletInfoJSON ? JSON.parse(walletInfoJSON) : {};
    const { session, sharedSecretDapp, dappKeyPair } = phantomInfo;

    const payload = {
      session: session,
      message: bs58.encode(Buffer.from(message)),
    };

    const [nonce, encryptedPayload] = encryptPayload(
      payload,
      Uint8Array.from(sharedSecretDapp)
    );

    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(
        Uint8Array.from(dappKeyPair.publicKey)
      ),
      nonce: bs58.encode(nonce),
      redirect_link: onSignMessageRedirectLink,
      payload: bs58.encode(encryptedPayload),
    });

    const url = buildUrl("signMessage", params);
    Linking.openURL(url);
  };

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
  return { disconnect, connect, signMessage };
};
