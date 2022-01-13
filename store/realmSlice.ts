import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { REALM_GOVERNANCE_PKEY } from "../constants/Solana";
import { PublicKey } from "@solana/web3.js";
import { getRealms } from "@solana/spl-governance";

export interface realmState {
  realms: Array<any>;
  selectedRealm: any;
}

const initialState: realmState = {
  realms: [],
  selectedRealm: null,
};

export const fetchRealms = createAsyncThunk(
  "realms/fetchRealms",
  async (_: any, { getState }) => {
    console.log("fetching realms!");
    const rpcEndpoint = "https://api.mainnet-beta.solana.com";
    const realms = await getRealms(rpcEndpoint, REALM_GOVERNANCE_PKEY);
    return [realms[0]];
  }
);

export const realmSlice = createSlice({
  name: "realms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRealms.pending, (state) => {})
      .addCase(fetchRealms.rejected, (state) => {})
      .addCase(fetchRealms.fulfilled, (state, action: any) => {
        state.realms = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const {} = realmSlice.actions;

export default realmSlice.reducer;
