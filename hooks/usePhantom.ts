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
  sendAndConfirmTransaction,
  sendAndConfirmRawTransaction,
  BlockheightBasedTransactionConfirmationStrategy,
} from "@solana/web3.js";
import Constants, { AppOwnership } from "expo-constants";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useEffect, useState } from "react";
import { RPC_CONNECTION } from "../constants/Solana";
import {
  setWallet,
  disconnectWallet,
  setTransactionLoading,
  setTransactionState,
} from "../store/walletSlice";
import * as SecureStore from "expo-secure-store";

const scheme = "gilder";

const onConnectRedirectLink =
  Constants.appOwnership == AppOwnership.Expo ||
  Constants.appOwnership == AppOwnership.Guest
    ? Linking.createURL("onConnect", {})
    : Linking.createURL("onConnect", { scheme: scheme });
const onDisconnectRedirectLink =
  Constants.appOwnership == AppOwnership.Expo ||
  Constants.appOwnership == AppOwnership.Guest
    ? Linking.createURL("onDisconnect", {})
    : Linking.createURL("onDisconnect", { scheme: scheme });
const onSignAndSendTransactionRedirectLink =
  Constants.appOwnership == AppOwnership.Expo ||
  Constants.appOwnership == AppOwnership.Guest
    ? Linking.createURL("onSignAndSendTransaction", {})
    : Linking.createURL("onSignAndSendTransaction", { scheme: scheme });
const onSignMessageRedirectLink =
  Constants.appOwnership == AppOwnership.Expo ||
  Constants.appOwnership == AppOwnership.Guest
    ? Linking.createURL("onSignMessage", {})
    : Linking.createURL("onSignMessage", { scheme: scheme });
const onSignAllTransactionsRedirectLink =
  Constants.appOwnership == AppOwnership.Expo ||
  Constants.appOwnership == AppOwnership.Guest
    ? Linking.createURL("onSignAllTransactions", {})
    : Linking.createURL("onSignAllTransactions", { scheme: scheme });

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
  const [signedMessage, setSignedMessage] = useState("");
  const [isSendingTransactions, setIsSendingTransactions] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        setDeepLink(initialUrl);
      }
    })();

    const event = Linking.addEventListener("url", handleDeepLink);
    return () => {
      event.remove();
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
        // something goes wrong or user cancels transaction
        dispatch(setTransactionLoading(false));
        return;
      }

      if (/onConnect/.test(url.href)) {
        try {
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
            walletType: "phantom",
          });
          AsyncStorage.setItem("@walletInfo", jsonValue);

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

          dispatch(
            setWallet({
              publicKey: connectData.public_key,
              userInfo: {},
              walletType: "phantom",
            })
          );
        } catch (error) {
          console.error(error);
        }
      } else if (/onSignAndSendTransaction/.test(url.href)) {
        dispatch(setTransactionLoading(false));
        dispatch(setTransactionState("success"));
      } else if (/onDisconnect/.test(url.href)) {
        dispatch(disconnectWallet());
        setSignedMessage("");
      } else if (/onSignAllTransactions/.test(url.href)) {
        const walletInfoJSON = await SecureStore.getItemAsync("phantomInfo");
        const phantomInfo = walletInfoJSON ? JSON.parse(walletInfoJSON) : {};
        const { sharedSecretDapp } = phantomInfo;
        setProgress(0);
        setIsSendingTransactions(true);
        const signAllTransactionsData = decryptPayload(
          params.get("data")!,
          params.get("nonce")!,
          Uint8Array.from(sharedSecretDapp)
        );

        const decodedTransactions = signAllTransactionsData.transactions.map(
          (t: string) => Transaction.from(bs58.decode(t))
        );

        for (const tx of decodedTransactions) {
          // const latestBlockHash = await connection.getLatestBlockhash();
          const signature = await sendAndConfirmRawTransaction(
            connection,
            tx.serialize(),
            {
              skipPreflight: true,
            }
          );
          // const latestBlockHash = await connection.getLatestBlockhash();
          // console.log("TRANSACTION SENT", signature);
          // const confirmStrategy: BlockheightBasedTransactionConfirmationStrategy =
          //   {
          //     blockhash: latestBlockHash.blockhash,
          //     lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          //     signature: signature,
          //   };
          // const result = await connection.confirmTransaction(confirmStrategy);
          // console.log("CONFIRM RESULT", result);

          setProgress(progress + 1);
        }

        console.log("PROPOSAL CREATED IN PHANTOM");
        setIsSendingTransactions(false);
      } else if (/onSignMessage/.test(url.href)) {
        const walletInfoJSON = await SecureStore.getItemAsync("phantomInfo");
        const phantomInfo = walletInfoJSON ? JSON.parse(walletInfoJSON) : {};
        const { sharedSecretDapp } = phantomInfo;

        const signMessageData = decryptPayload(
          params.get("data")!,
          params.get("nonce")!,
          Uint8Array.from(sharedSecretDapp)
        );
        setSignedMessage(signMessageData.signature);
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

  // TODO: send our transacitons here
  const signAllTransactions = async (transactions: Array<Transaction>) => {
    const walletInfoJSON = await SecureStore.getItemAsync("phantomInfo");
    const phantomInfo = walletInfoJSON ? JSON.parse(walletInfoJSON) : {};
    const { session, sharedSecretDapp, dappKeyPair } = phantomInfo;

    const serializedTransactions = transactions.map((t) =>
      bs58.encode(
        t.serialize({
          requireAllSignatures: false,
        })
      )
    );

    const payload = {
      session,
      transactions: serializedTransactions,
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
      redirect_link: onSignAllTransactionsRedirectLink,
      payload: bs58.encode(encryptedPayload),
    });

    const url = buildUrl("signAllTransactions", params);
    Linking.openURL(url);
  };

  const signAndSendTransaction = async (transaction: Transaction) => {
    const walletInfoJSON = await SecureStore.getItemAsync("phantomInfo");
    const phantomInfo = walletInfoJSON ? JSON.parse(walletInfoJSON) : {};
    const { session, sharedSecretDapp, dappKeyPair } = phantomInfo;

    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
    });

    const payload = {
      session,
      transaction: bs58.encode(serializedTransaction),
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
      redirect_link: onSignAndSendTransactionRedirectLink,
      payload: bs58.encode(encryptedPayload),
    });

    const url = buildUrl("signAndSendTransaction", params);

    Linking.openURL(url);
  };

  const signMessage = async () => {
    const message = "Proving DAO membership to authenticate into chat.";

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
      app_url: "https://gilder.xyz/",
      redirect_link: onConnectRedirectLink,
    });

    const url = buildUrl("connect", params);
    Linking.openURL(url);
  };

  return {
    disconnect,
    connect,
    signMessage,
    signAndSendTransaction,
    signedMessage,
    signAllTransactions,
    isSendingTransactions,
    progress,
  };
};
