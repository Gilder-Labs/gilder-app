import type {
  PublicKey,
  SendOptions,
  Transaction,
  TransactionSignature,
  VersionedTransaction,
} from "@solana/web3.js";

export interface GilderEvent {
  connect(...args: unknown[]): unknown;
  disconnect(...args: unknown[]): unknown;
  accountChanged(...args: unknown[]): unknown;
}

export interface GilderEventEmitter {
  on<E extends keyof GilderEvent>(
    event: E,
    listener: GilderEvent[E],
    context?: any
  ): void;
  off<E extends keyof GilderEvent>(
    event: E,
    listener: GilderEvent[E],
    context?: any
  ): void;
}

// interface of our wallet-standard wallet
export interface Gilder extends GilderEventEmitter {
  publicKey: PublicKey | null;
  connect(options?: {
    onlyIfTrusted?: boolean;
  }): Promise<{ publicKey: PublicKey }>;
  disconnect(): Promise<void>;
  signAndSendTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T,
    options?: SendOptions
  ): Promise<{ signature: TransactionSignature }>;
  signTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T
  ): Promise<T>;
  signAllTransactions<T extends Transaction | VersionedTransaction>(
    transactions: T[]
  ): Promise<T[]>;
  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
}

// Provider that we inject into webview so that the webapp can use our wallet

export class GilderWalletProvider {
  #isConnected: boolean;
  #publicKey?: PublicKey;

  constructor(config: { publicKey?: PublicKey }) {
    this.#isConnected = false;
    this.#publicKey = this.#publicKey;
  }

  async on(event, callback) {
    console.log("on", event, callback);
  }

  async off(event, callback) {
    console.log("off", event, callback);
  }

  async connect() {
    console.log("trying to connect");
    window?.ReactNativeWebView.postMessage(
      JSON.stringify({
        message: "connect",
        payload: {
          info: {
            title: document.title,
            host: window.location.host,
          },
        },
      })
    );
  }
}

// const walletAdapter = {
//   publicKey: {
//     toBytes: () => {
//       return "${toBytes}";
//     },
//     publicKey: "${walletId}",
//     toString: () => {
//       return "${walletId}";
//     },
//   },
//   on: (event, callback) => {
//     console.log("on", event, callback);
//   },
//   off: (event, callback) => {
//     console.log("off", event, callback);
//   },
//   signTransaction: async (transaction) => {
//     console.log("signTransaction", transaction);
//     window.ReactNativeWebView.postMessage(
//       JSON.stringify({
//         message: "signTransaction",
//         payload: {
//           transaction,
//           info: {
//             title: document.title,
//             host: window.location.host,
//           },
//         },
//       })
//     );
//     return communicate("signTransaction");
//   },
//   signAllTransactions: async (transaction) => {
//     console.log("signAllTransactions", transaction);
//     window.ReactNativeWebView.postMessage(
//       JSON.stringify({
//         message: "signAllTransactions",
//         payload: {
//           transaction,
//           info: {
//             title: document.title,
//             host: window.location.host,
//           },
//         },
//       })
//     );
//     return communicate("signAllTransactions");
//   },
//   signAndSendTransaction: async (transaction, options) => {
//     console.log("signAndSendTransaction", transaction);
//     window.ReactNativeWebView.postMessage(
//       JSON.stringify({
//         message: "signAndSendTransaction",
//         payload: {
//           transaction,
//           options,
//           info: {
//             title: document.title,
//             host: window.location.host,
//           },
//         },
//       })
//     );
//     return communicate("signAndSendTransaction");
//   },

//   signMessage: async (message) => {
//     console.log("signMessage", message);
//     window.ReactNativeWebView.postMessage(
//       JSON.stringify({
//         message: "signMessage",
//         payload: {
//           messageToSign: message,
//           info: {
//             title: document.title,
//             host: window.location.host,
//           },
//         },
//       })
//     );
//     return communicate("signAllTransactions");
//   },
//   connect: async () => {
//     console.log("trying to connect");
//     window.phantom.solana.isConnected = true;
//     window.solana.isConnected = true;
//     window.glowSolana.solana.isConnected = true;
//     window.phantom.isConnected = true;
//     window.glowSolana.isConnected = true;

//     window.ReactNativeWebView.postMessage(
//       JSON.stringify({
//         message: "connect",
//         payload: {
//           info: {
//             title: document.title,
//             host: window.location.host,
//           },
//         },
//       })
//     );
//   },

//   disconnect: async () => {
//     console.log("trying to disconnect");

//     window.solana.isConnected = false;
//     window.phantom.solana.isConnected = false;
//     window.glowSolana.solana.isConnected = false;
//     window.phantom.isConnected = false;
//     window.glowSolana.isConnected = false;

//     window.ReactNativeWebView.postMessage(
//       JSON.stringify({
//         message: "disconnect",
//         payload: {
//           info: {
//             title: document.title,
//             host: window.location.host,
//           },
//         },
//       })
//     );
//   },
// };
