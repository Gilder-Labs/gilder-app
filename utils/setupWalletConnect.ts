// Wallet connect test
import WalletConnectClient from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";
import { CLIENT_EVENTS } from "@walletconnect/client";
import { PairingTypes } from "@walletconnect/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const setupWalletConnect = async () => {
  console.log("setting up wallet connect");

  try {
    const client = await WalletConnectClient.init({
      projectId: "ae379c40581d69d2257a5e78cbda246c",
      relayUrl: "wss://relay.walletconnect.com",
      metadata: {
        name: "Example Dapp",
        description: "Example Dapp",
        url: "#",
        icons: ["https://walletconnect.com/walletconnect-logo.png"],
      },
    });
  } catch (error) {
    console.log(error);
  }

  // console.log("client", client);

  // client.on(
  //   CLIENT_EVENTS.pairing.proposal,
  //   async (proposal: PairingTypes.Proposal) => {
  //     // uri should be shared with the Wallet either through QR Code scanning or mobile deep linking
  //     const { uri } = proposal.signal.params;
  //   }
  // );

  // console.log("client on");

  // const session = await client.connect({
  //   permissions: {
  //     blockchain: {
  //       chains: ["eip155:1"],
  //     },
  //     jsonrpc: {
  //       methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData"],
  //     },
  //   },
  // });

  // console.log("session", session);
};
