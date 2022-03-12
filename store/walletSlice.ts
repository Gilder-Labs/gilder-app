import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SPL_PUBLIC_KEY } from "../constants/Solana";
import { clusterApiUrl, Connection } from "@solana/web3.js";

export interface WalletState {
  publicKey: string;
  privateKey: string;
  userInfo: any;
  isWalletOpen: boolean;
}

const initialState: WalletState = {
  privateKey: "",
  publicKey: "",
  userInfo: null,
  isWalletOpen: false,
};

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
    openWallet: (state, action) => {
      state.isWalletOpen = true;
    },
    closeWallet: (state, action) => {
      state.isWalletOpen = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setWallet, openWallet, closeWallet } = walletSlice.actions;

export default walletSlice.reducer;
