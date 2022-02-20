import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SPL_PUBLIC_KEY } from "../constants/Solana";
import { clusterApiUrl, Connection } from "@solana/web3.js";

export interface WalletState {
  publicKey: string;
  privateKey: string;
  userInfo: any;
}

const initialState: WalletState = {
  privateKey: "",
  publicKey: "",
  userInfo: null,
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallet: (state, action) => {
      state.publicKey = action.payload.publicKey;
      state.privateKey = action.payload.privateKey;
      state.userInfo = action.payload.userInfo;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setWallet } = walletSlice.actions;

export default walletSlice.reducer;
