import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
import {
  withCastVote,
  CastVoteArgs,
  RpcContext,
  Vote,
  getGovernanceProgramVersion,
} from "@solana/spl-governance";
import bs58 from "bs58";

export interface WalletState {
  publicKey: string;
  privateKey: string;
  userInfo: any;
  isWalletOpen: boolean;
  isLoadingTokens: boolean;
  isLoadingNfts: boolean;
  tokens: Array<Token>;
  nfts: Array<any>;
  tokenPriceData: any;
  isTransactionModalOpen: boolean;
  transactionType: "VoteOnProposal" | "something" | "";
  transactionData: any;
  transactionState: "none" | "pending" | "success" | "error";
  isSendingTransaction: boolean;
  transactionError: any;
  isLoadingTransactions: boolean;
  transactions: any;
}

const initialState: WalletState = {
  privateKey: "",
  publicKey: "",
  userInfo: null,
  isWalletOpen: false,
  tokens: [],
  nfts: [],
  isLoadingTokens: false,
  isLoadingNfts: false,
  tokenPriceData: null,
  isTransactionModalOpen: false,
  transactionType: "",
  transactionData: null,
  isSendingTransaction: false,
  transactionError: "",
  transactionState: "none",
  isLoadingTransactions: false,
  transactions: [],
};

let connection = new Connection(RPC_CONNECTION, "confirmed");
const TokensInfo = getTokensInfo();

export const fetchTokens = createAsyncThunk(
  "wallet/fetchTokens",
  async (publicKey: string) => {
    try {
      // TODO: GET THE SOL OF THE ACCOUNT WITH `getBalance`
      // TODO: differentiate between NFTS/tokens

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
          owner: token.account.data.parsed.info.owner.toBase58(),
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
      console.log("error", e);
      return { tokens: [] };
    }
  }
);

export const fetchNfts = createAsyncThunk(
  "wallet/fetchNfts",
  async (publicKey: string) => {
    try {
      const nftResponse = await axios.get(
        "https://api.cybertino.io/querier/getSolNftByAddress",
        {
          params: {
            address: publicKey,
          },
        }
      );

      return { nfts: nftResponse.data.results };
    } catch (e) {
      console.log("error", e);
      return { nfts: [] };
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
      console.log("error", e);
      return { transactions: [] };
    }
  }
);

export const castVote = createAsyncThunk(
  "wallet/castVote",
  async (
    { publicKey, transactionData, selectedDelegate, isCommunityVote }: any,
    { getState }
  ) => {
    try {
      const { realms, wallet, members } = getState() as RootState;
      const { proposal, action } = transactionData;
      const { selectedRealm } = realms;
      const walletPubkey = new PublicKey(wallet.publicKey);
      let tokenOwnerRecord;
      const governanceAuthority = walletPubkey;

      // if Member has a token, use their own token
      if (members.membersMap[wallet.publicKey] && !selectedDelegate) {
        tokenOwnerRecord = members.membersMap[wallet.publicKey];
      } else {
        // else get the token from the tokens that have been delegated to them
        tokenOwnerRecord = members.membersMap[selectedDelegate];
      }

      // each member can have a token record for community or council.
      let tokenRecordPublicKey = isCommunityVote
        ? tokenOwnerRecord.communityPublicKey
        : tokenOwnerRecord.councilPublicKey;
      // 1. Check if current wallet is member and has token to be voted with
      // 2. If it does, do vote with that token
      // 3. If not check if current wallet is delegated from an token owner record
      // 4. if it is, check if it has the token for the proposal
      // 5. if it does, attempt vote

      console.log("PUBLIC KEY?", tokenRecordPublicKey);

      const payer = walletPubkey;

      const signers: Keypair[] = [];
      const instructions: TransactionInstruction[] = [];

      const programVersion = await getGovernanceProgramVersion(
        connection,
        new PublicKey(selectedRealm.governanceId)
      );

      await withCastVote(
        instructions,
        new PublicKey(selectedRealm.governanceId), //  realm/governance PublicKey
        programVersion, // version object, version of realm
        new PublicKey(selectedRealm.pubKey), // realms publicKey
        new PublicKey(proposal.governanceId), // proposal governance Public key
        new PublicKey(proposal.proposalId), // proposal public key
        new PublicKey(proposal.tokenOwnerRecord), // proposal token owner record, publicKey
        new PublicKey(tokenRecordPublicKey), // publicKey of tokenOwnerRecord
        governanceAuthority, // wallet publicKey
        new PublicKey(proposal.governingTokenMint), // proposal governanceMint publicKey
        Vote.fromYesNoVote(action), //  *Vote* class? 1 = no, 0 = yes
        payer
        // TODO: handle plugin stuff here.
      );

      const privateKey = wallet.privateKey;
      const walletKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
      const recentBlockhash = await connection.getRecentBlockhash();

      const transaction = new Transaction({
        recentBlockhash: recentBlockhash.blockhash,
      });

      transaction.add(...instructions);
      transaction.sign(walletKeypair);

      console.log(
        `SOL transfer would cost: ${
          (transaction.signatures.length *
            recentBlockhash.feeCalculator.lamportsPerSignature) /
          LAMPORTS_PER_SOL
        } sol`
      );

      const response = await sendAndConfirmTransaction(
        connection,
        transaction,
        [walletKeypair]
      );
      console.log("response", response);
      return { transactionError: "" };
    } catch (error) {
      console.log("error", error);
      return { transactionError: error };
    }
  }
);

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallet: (state, action) => {
      state.publicKey = action.payload.publicKey;
      state.privateKey = action.payload.privateKey;
      state.userInfo = action.payload.userInfo;
      state.isWalletOpen = true;
    },
    disconnectWallet: (state, action) => {
      state.publicKey = "";
      state.privateKey = "";
      state.userInfo = null;
      state.isWalletOpen = false;
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
      .addCase(fetchNfts.pending, (state) => {
        state.isLoadingNfts = true;
      })
      .addCase(fetchNfts.rejected, (state) => {
        state.isLoadingNfts = false;
      })
      .addCase(fetchNfts.fulfilled, (state, action: any) => {
        state.isLoadingNfts = false;
        state.nfts = action.payload.nfts;
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
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  setWallet,
  openWallet,
  closeWallet,
  disconnectWallet,
  openTransactionModal,
  closeTransactionModal,
} = walletSlice.actions;

export default walletSlice.reducer;
