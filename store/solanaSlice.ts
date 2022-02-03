import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SPL_PUBLIC_KEY } from "../constants/Solana";
import { clusterApiUrl, Connection } from "@solana/web3.js";

export interface SolanaState {
  // tokens: Array<any>;
  connection?: any;
  network: string;
}

const initialState: SolanaState = {
  // tokens: [],
  network: clusterApiUrl("mainnet-beta"),
  // connection: new Connection(clusterApiUrl("mainnet-beta"), "confirmed"),
};

export const web3Slice = createSlice({
  name: "solana",
  initialState,
  reducers: {
    changeNetwork: (
      state,
      action: PayloadAction<"devnet" | "testnet" | "mainnet-beta">
    ) => {
      state.connection = new Connection(
        clusterApiUrl(action.payload),
        "confirmed"
      );
    },
  },
});

// Get token price data
// https://public-api.solscan.io/docs/#/Token/get_token_list

export const { changeNetwork } = web3Slice.actions;

export default web3Slice.reducer;
