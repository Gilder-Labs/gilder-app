// Wallet connect test
import WalletConnectClient from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";
import { CLIENT_EVENTS } from "@walletconnect/client";
import { PairingTypes } from "@walletconnect/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const setupWalletConnect = async () => {
  console.log("setting up wallet connect");
  let client;

  try {
    client = await WalletConnectClient.init({
      projectId: "ae379c40581d69d2257a5e78cbda246c",
      relayUrl: "wss://relay.walletconnect.com",
      metadata: {
        name: "Gilder",
        description: "Gilder is a dao tool for Solana.",
        url: "#",
        icons: ["https://walletconnect.com/walletconnect-logo.png"],
      },
      storageOptions: {
        // @ts-ignore
        asyncStorage: AsyncStorage,
      },
    });
  } catch (error) {
    console.log(error);
  }

  client?.on(
    CLIENT_EVENTS.pairing.proposal,
    async (proposal: PairingTypes.Proposal) => {
      // uri should be shared with the Wallet either through QR Code scanning or mobile deep linking
      const { uri } = proposal.signal.params;
    }
  );

  const session = await client?.connect({
    permissions: {
      blockchain: {
        chains: ["eip155:1"],
      },
      jsonrpc: {
        methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData"],
      },
    },
  });

  const result = await client?.request({
    //@ts-ignore
    topic: session?.topic,
    chainId: "eip155:1",
    request: {
      // @ts-ignore
      id: 1,
      jsonrpc: "2.0",
      method: "personal_sign",
      params: [
        "0x1d85568eEAbad713fBB5293B45ea066e552A90De",
        "0x7468697320697320612074657374206d65737361676520746f206265207369676e6564",
      ],
    },
  });

  console.log("session", session);
  console.log("result", result);
};
