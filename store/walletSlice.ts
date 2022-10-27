import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  PublicKey,
  ConfirmedSignatureInfo,
  Connection,
  LAMPORTS_PER_SOL,
  Keypair,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { RootState } from "./index";

import axios from "axios";
import { SPL_PUBLIC_KEY, RPC_CONNECTION } from "../constants/Solana";
import { getTokensInfo } from "../utils";

import bs58 from "bs58";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createCastVoteTransaction } from "../utils/castVote";

export interface WalletState {
  publicKey: string;
  userInfo: any;
  isWalletOpen: boolean;
  isLoadingTokens: boolean;
  tokens: Array<Token>;
  tokenPriceData: any;
  isTransactionModalOpen: boolean;
  transactionType: "VoteOnProposal" | "something" | "";
  transactionData: any;
  transactionState: "none" | "pending" | "success" | "error";
  isSendingTransaction: boolean;
  transactionError: any;
  isLoadingTransactions: boolean;
  transactions: any;
  isFetchingWalletInfo: boolean;
  isDisconnectingWallet: boolean;
  walletType: "sms" | "phantom" | "web3auth" | "none";
}

const initialState: WalletState = {
  publicKey: "",
  userInfo: null,
  isWalletOpen: false,
  tokens: [],
  isLoadingTokens: false,
  tokenPriceData: null,
  isTransactionModalOpen: false,
  transactionType: "",
  transactionData: null,
  isSendingTransaction: false,
  transactionError: "",
  transactionState: "none",
  isLoadingTransactions: false,
  transactions: [],
  isFetchingWalletInfo: false,
  isDisconnectingWallet: false,
  walletType: "none",
};

let connection = new Connection(RPC_CONNECTION, "confirmed");
const devNetConnection = new Connection(
  "https://api.devnet.solana.com",
  "confirmed"
);
const TokensInfo = getTokensInfo();

export const fetchTokens = createAsyncThunk(
  "wallet/fetchTokens",
  async (publicKey: string) => {
    try {
      // TODO: GET THE SOL OF THE ACCOUNT WITH `getBalance`

      const solanaLamportsInWallet = await connection.getBalance(
        new PublicKey(publicKey)
      );

      const solanaBalance = solanaLamportsInWallet / LAMPORTS_PER_SOL;

      const response = await connection.getParsedTokenAccountsByOwner(
        new PublicKey(publicKey),
        {
          programId: SPL_PUBLIC_KEY,
        }
      );
      const tokensData = await TokensInfo;
      const coinGeckoUrl = "https://api.coingecko.com/api/v3/coins/markets";
      let tokenIds = new Set();
      tokenIds.add("solana");

      const tokens = response.value.map((token) => {
        let tokenInfo = tokensData.get(token.account.data.parsed.info.mint);
        if (tokenInfo?.extensions?.coingeckoId) {
          tokenIds.add(tokenInfo?.extensions?.coingeckoId);
        }

        const tokenData = {
          ...tokenInfo,
          mint: token.account.data.parsed.info.mint,
          owner: token.account.data.parsed.info.owner,
          tokenAmount: token.account.data.parsed.info.tokenAmount,
        };

        //@ts-ignore
        return tokenData;
      });

      const solTokenData = {
        tokenAmount: {
          amount: solanaLamportsInWallet,
          decimals: 9,
          uiAmount: solanaBalance,
          uiAmountString: String(solanaBalance),
        },
        extensions: {
          coingeckoId: "solana",
        },
        logoURI:
          "https://assets.coingecko.com/coins/images/4128/small/solana.png?1640133422",
        decimals: 9,
        name: "Solana",
        symbol: "SOL",
        owner: "solana",
        mint: "sol",
      };
      tokens.push(solTokenData);
      //@ts-ignore

      const tokenIdsString = Array.from(tokenIds).join();
      const tokenPriceResponse = await axios.get(coinGeckoUrl, {
        params: {
          ids: tokenIdsString,
          vs_currency: "usd",
        },
      });

      let tokenPriceObject = {};
      // @ts-ignore
      tokenPriceResponse.data.forEach((token) => {
        // @ts-ignore
        tokenPriceObject[token.id] = token;
      });

      return { tokens: tokens, tokenPriceData: tokenPriceObject };
    } catch (e) {
      return { tokens: [] };
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  "wallet/fetchTransactions",
  async (publicKey: string) => {
    try {
      let rawTransactionsFilled;
      let transactionsParsed = [];

      let transactions = await connection.getConfirmedSignaturesForAddress2(
        new PublicKey(publicKey),
        {
          limit: 20,
          // before: fetchAfterSignature ? fetchAfterSignature : undefined,
        }
      );

      let signatures = transactions.map((transaction) => {
        return transaction.signature;
      });

      rawTransactionsFilled = await connection.getParsedTransactions(
        signatures
      );

      transactionsParsed = rawTransactionsFilled?.map((transaction, index) => {
        return {
          signature: transactions[index].signature,
          blockTime: transaction?.blockTime,
          // @ts-ignore
          status: transaction?.meta?.status,
          logs: transaction?.meta?.logMessages,
          // logsParsed: extractLogInfo(transaction?.meta?.logMessages),
        };
      });

      return { transactions: transactionsParsed };
    } catch (e) {
      return { transactions: [] };
    }
  }
);

export const castVote = createAsyncThunk(
  "wallet/castVote",
  async (
    { transactionData, selectedDelegate, isCommunityVote }: any,
    { getState }
  ) => {
    try {
      const { realms, wallet, members } = getState() as RootState;
      const { selectedRealm } = realms;

      const transaction = await createCastVoteTransaction(
        selectedRealm,
        wallet.publicKey,
        transactionData,
        members.membersMap,
        selectedDelegate,
        isCommunityVote
      );

      const privateKey = await SecureStore.getItemAsync("privateKey");
      if (!privateKey) {
        throw Error();
      }
      const walletKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
      transaction.sign(walletKeypair);
      const response = await sendAndConfirmTransaction(
        connection,
        transaction,
        [walletKeypair]
      );
      return { transactionError: "" };
    } catch (error) {
      return { transactionError: error };
    }
  }
);

export const fetchWalletInfo = createAsyncThunk(
  "wallet/fetchWalletInfo",
  async () => {
    try {
      const walletInfoJSON = await AsyncStorage.getItem("@walletInfo");
      const walletInfoData = JSON.parse(walletInfoJSON);

      return {
        publicKey: walletInfoData.publicKey,
        userInfo: walletInfoData.userInfo,
        walletType: walletInfoData.walletType,
      };
    } catch (e) {
      return { publicKey: "", userInfo: {} };
    }
  }
);

export const disconnectWallet = createAsyncThunk(
  "wallet/disconnectWallet",
  async () => {
    try {
      // clear wallet data
      await SecureStore.setItemAsync("privateKey", "");
      const jsonValue = JSON.stringify({
        publicKey: "",
        userInfo: null,
        walletType: "none",
      });
      AsyncStorage.setItem("@walletInfo", jsonValue);

      return {};
    } catch (e) {
      return {};
    }
  }
);

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallet: (state, action) => {
      state.publicKey = action.payload.publicKey;
      state.userInfo = action.payload.userInfo;
      state.walletType = action.payload.walletType;
      state.isWalletOpen = true;
    },
    openWallet: (state, action) => {
      state.isWalletOpen = true;
      state.isSendingTransaction = false;
    },
    closeWallet: (state, action) => {
      state.isWalletOpen = false;
      state.isSendingTransaction = false;
    },
    openTransactionModal: (state, action) => {
      const { type, transactionData } = action.payload;
      state.isTransactionModalOpen = true;
      state.transactionType = type;
      state.transactionData = transactionData;
      state.transactionState = "pending";
    },
    closeTransactionModal: (state, action) => {
      state.isTransactionModalOpen = false;
      state.transactionType = "";
      state.transactionData = null;
      state.transactionState = "none";
    },
    setTransactionLoading: (state, action: { payload: boolean }) => {
      state.isSendingTransaction = action?.payload;
    },
    setTransactionState: (state, action: { payload: "success" }) => {
      state.transactionState = action?.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTokens.pending, (state) => {
        state.isLoadingTokens = true;
      })
      .addCase(fetchTokens.rejected, (state) => {
        state.isLoadingTokens = false;
      })
      .addCase(fetchTokens.fulfilled, (state, action: any) => {
        state.isLoadingTokens = false;
        state.tokens = action.payload.tokens;
        state.tokenPriceData = action.payload.tokenPriceData;
      })
      .addCase(castVote.pending, (state) => {
        state.isSendingTransaction = true;
        state.transactionError = "";
      })
      .addCase(castVote.rejected, (state, action: any) => {
        const error = action.payload.transactionError;

        state.isSendingTransaction = false;
        state.transactionState = "error";
        state.transactionError = error;
      })
      .addCase(castVote.fulfilled, (state, action: any) => {
        const error = action.payload.transactionError;

        state.isSendingTransaction = false;
        state.transactionState = error ? "error" : "success";
        state.transactionError = error;
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoadingTransactions = true;
      })
      .addCase(fetchTransactions.rejected, (state) => {
        state.isLoadingTransactions = false;
      })
      .addCase(fetchTransactions.fulfilled, (state, action: any) => {
        state.isLoadingTransactions = false;
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchWalletInfo.pending, (state) => {
        state.isFetchingWalletInfo = true;
      })
      .addCase(fetchWalletInfo.rejected, (state) => {
        state.isFetchingWalletInfo = false;
      })
      .addCase(fetchWalletInfo.fulfilled, (state, action: any) => {
        state.isFetchingWalletInfo = false;
        state.publicKey = action.payload.publicKey;
        state.userInfo = action.payload.userInfo;
        state.walletType = action.payload.walletType;
      })
      .addCase(disconnectWallet.pending, (state) => {
        state.isDisconnectingWallet = true;
      })
      .addCase(disconnectWallet.rejected, (state) => {
        state.isDisconnectingWallet = false;
      })
      .addCase(disconnectWallet.fulfilled, (state, action: any) => {
        state.isDisconnectingWallet = false;
        state.publicKey = "";
        state.walletType = "none";
        state.userInfo = null;
        state.isWalletOpen = false;
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  setWallet,
  openWallet,
  closeWallet,
  openTransactionModal,
  closeTransactionModal,
  setTransactionLoading,
  setTransactionState,
} = walletSlice.actions;

export default walletSlice.reducer;
