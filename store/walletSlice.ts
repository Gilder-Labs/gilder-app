import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SPL_PUBLIC_KEY } from "../constants/Solana";
import { clusterApiUrl, Connection } from "@solana/web3.js";

export interface WalletState {}

const initialState: WalletState = {};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = walletSlice.actions;

export default walletSlice.reducer;
