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
} from "@solana/spl-governance";

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
  isSendingTransaction: boolean;
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
        // new PublicKey(publicKey),
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
      const { realms, wallet, members, treasury } = getState() as RootState;
      const { proposal } = transactionData;
      const { selectedRealm } = realms;
      const { governancesMap } = treasury;
      const walletPubkey = new PublicKey(wallet.publicKey);
      const tokenOwnerRecord = members.membersMap[wallet.publicKey];
      console.log("members", members);
      console.log("wallet pubkey", wallet.publicKey);

      const governanceAuthority = walletPubkey;
      const payer = walletPubkey;

      const signers: Keypair[] = [];
      const instructions: TransactionInstruction[] = [];

      // await withCastVote(
      //   instructions,
      //   programId,
      //   programVersion,
      //   realm.pubkey,
      //   proposal.account.governance,
      //   proposal.pubkey,
      //   proposal.account.tokenOwnerRecord,
      //   tokeOwnerRecord,
      //   governanceAuthority,
      //   proposal.account.governingTokenMint,
      //   Vote.fromYesNoVote(yesNoVote),
      //   payer,
      //   voterWeight
      // )

      // export const withCastVote = async (
      //   instructions: TransactionInstruction[],
      //   programId: PublicKey,
      //   programVersion: number,
      //   realm: PublicKey,
      //   governance: PublicKey,
      //   proposal: PublicKey,
      //   proposalOwnerRecord: PublicKey,
      //   tokenOwnerRecord: PublicKey,
      //   governanceAuthority: PublicKey,
      //   governingTokenMint: PublicKey,
      //   vote: Vote,
      //   payer: PublicKey,
      //   voterWeightRecord?: PublicKey,
      //   maxVoterWeightRecord?: PublicKey,
      // ) => {

      await withCastVote(
        instructions,
        new PublicKey(selectedRealm.governanceId), //  realm/governance PublicKey
        selectedRealm.accountType, // number, version of realm
        new PublicKey(selectedRealm.pubKey), // realms publicKey
        new PublicKey(proposal.governanceId), // proposal governance Public key
        new PublicKey(proposal.proposalId), // proposal public key
        new PublicKey(proposal.tokenOwnerRecord), // proposal token owner record, publicKey
        new PublicKey(tokenOwnerRecord.publicKey), // publicKey of tokenOwnerRecord
        governanceAuthority, // wallet publicKey
        new PublicKey(proposal.governingTokenMint), // proposal governanceMint publicKey
        Vote.fromYesNoVote(1), //??  *Vote* class? 0 = no, 1 = yes
        payer
        // voterWeight
      );

      //   export declare enum YesNoVote {
      //     Yes = 0,
      //     No = 1
      // }

      //   Vote...
      //   constructor(args: {
      //     voteType: VoteKind;
      //     approveChoices: VoteChoice[] | undefined;
      //     deny: boolean | undefined;
      // });

      //   export declare enum VoteKind {
      //     Approve = 0,
      //     Deny = 1
      // }

      //   export declare class VoteChoice {
      //     rank: number;
      //     weightPercentage: number;
      //     constructor(args: {
      //         rank: number;
      //         weightPercentage: number;
      //     });
      // }

      console.log("Instructions??", instructions);

      //   export declare class Vote {
      //     voteType: VoteKind;
      //     approveChoices: VoteChoice[] | undefined;
      //     deny: boolean | undefined;
      //     constructor(args: {
      //         voteType: VoteKind;
      //         approveChoices: VoteChoice[] | undefined;
      //         deny: boolean | undefined;
      //     });
      //     toYesNoVote(): YesNoVote;
      //     static fromYesNoVote(yesNoVote: YesNoVote): Vote;
      // }

      // const transaction = new Transaction()
      // transaction.add(...instructions)

      // await sendTransaction({ transaction, wallet, connection, signers })
    } catch (error) {
      console.log("error", error);
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
    },
    closeTransactionModal: (state, action) => {
      state.isTransactionModalOpen = false;
      state.transactionType = "";
      state.transactionData = null;
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
      .addCase(castVote.rejected, (state) => {
        state.isSendingTransaction = false;
      })
      .addCase(castVote.fulfilled, (state, action: any) => {
        state.isSendingTransaction = false;
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
