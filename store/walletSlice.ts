import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  PublicKey,
  ConfirmedSignatureInfo,
  Connection,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import axios from "axios";
import { SPL_PUBLIC_KEY, RPC_CONNECTION } from "../constants/Solana";
import { getTokensInfo } from "../utils";

export interface WalletState {
  publicKey: string;
  privateKey: string;
  userInfo: any;
  isWalletOpen: boolean;
  isLoadingTokens: boolean;
  tokens: Array<Token>;
  tokenPriceData: any;
}

const initialState: WalletState = {
  privateKey: "",
  publicKey: "",
  userInfo: null,
  isWalletOpen: false,
  tokens: [],
  isLoadingTokens: false,
  tokenPriceData: null,
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
      });
  },
});

// Action creators are generated for each case reducer function
export const { setWallet, openWallet, closeWallet, disconnectWallet } =
  walletSlice.actions;

export default walletSlice.reducer;
