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
  tokens: Array<Token>;
  tokenPriceData: any;
  isTransactionModalOpen: boolean;
  transactionType: "VoteOnProposal" | "something" | "";
  transactionData: any;
  transactionState: "none" | "pending" | "success" | "error";
  isSendingTransaction: boolean;
  transactionError: any;
}

const initialState: WalletState = {
  privateKey: "",
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
};

let connection = new Connection(RPC_CONNECTION, "confirmed");
const TokensInfo = getTokensInfo();

export const fetchTokens = createAsyncThunk(
  "wallet/fetchTokens",
  async (publicKey: string) => {
    console.log("TRYING tokens");
    try {
      // TODO: GET THE SOL OF THE ACCOUNT WITH `getBalance`
      // TODO: differentiate between NFTS/tokens

      const solanaLamportsInWallet = await connection.getBalance(
        new PublicKey(publicKey)
      );

      const solanaBalance = solanaLamportsInWallet / LAMPORTS_PER_SOL;
      console.log("solana balance", solanaBalance);

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
          owner: token.account.data.parsed.info.owner.toString(),
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

export const castVote = createAsyncThunk(
  "wallet/castVote",
  async ({ publicKey, transactionData }: any, { getState }) => {
    try {
      console.log("TRYING to cast vote", transactionData);
      const { realms, wallet, members } = getState() as RootState;
      const { proposal, action } = transactionData;
      const { selectedRealm } = realms;
      const walletPubkey = new PublicKey(wallet.publicKey);
      const tokenOwnerRecord = members.membersMap[wallet.publicKey];

      const governanceAuthority = walletPubkey;
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
        new PublicKey(tokenOwnerRecord.publicKey), // publicKey of tokenOwnerRecord
        governanceAuthority, // wallet publicKey
        new PublicKey(proposal.governingTokenMint), // proposal governanceMint publicKey
        Vote.fromYesNoVote(action), //  *Vote* class? 1 = no, 0 = yes
        payer
        // voterWeight
      );

      const privateKey = wallet.privateKey;
      const walletKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
      const recentBlockhash = await connection.getRecentBlockhash();

      console.log("Instructions??", instructions);
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
    },
    closeWallet: (state, action) => {
      state.isWalletOpen = false;
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
      .addCase(castVote.pending, (state) => {
        state.isSendingTransaction = true;
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
