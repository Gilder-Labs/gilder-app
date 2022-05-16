import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clusterApiUrl, Connection } from "@solana/web3.js";

export interface UtilityState {
  isShowingToast: boolean;
}

const initialState: UtilityState = {
  isShowingToast: false,
};

export const utilitySlice = createSlice({
  name: "utility",
  initialState,
  reducers: {
    setShowToast: (state, action) => {
      state.isShowingToast = action.payload;
    },
  },
});

export const { setShowToast } = utilitySlice.actions;

export default utilitySlice.reducer;
