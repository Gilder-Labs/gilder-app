import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { REALM_GOVERNANCE_PKEY } from "../constants/Solana";
import { PublicKey } from "@solana/web3.js";
import { getRealms, getRealm } from "@solana/spl-governance";
import * as web3 from "@solana/web3.js";

export interface realmState {
  realms: Array<any>;
  selectedRealm: any;
}

const initialState: realmState = {
  realms: [],
  selectedRealm: null,
};

//TODO:  Running into issues with buffer. Figure out issues with deserialization and buffer.

export const fetchRealms = createAsyncThunk(
  "realms/fetchRealms",
  async (_: any, { getState }) => {
    // const rpcEndpoint = "https://api.mainnet-beta.solana.com";
    const rpcEndpoint = "https://api.devnet.solana.com";
    const realms = await getRealms(rpcEndpoint, REALM_GOVERNANCE_PKEY);
    console.log("realms hopefully", realms[0].pubkey);
    return realms;
  }
);

export const fetchRealm = createAsyncThunk(
  "realms/fetchRealm",
  async (_: any, { getState }) => {
    const rpcEndpoint = "https://api.mainnet-beta.solana.com";
    let connection = new web3.Connection(
      web3.clusterApiUrl("mainnet-beta"),
      "confirmed"
    );
    const mangoRealmPkey = new PublicKey(
      "DPiH3H3c7t47BMxqTxLsuPQpEC6Kne8GA9VXbxpnZxFE"
    );
    // mango key
    const realm = await getRealm(connection, mangoRealmPkey);
    return realm;
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
      })
      .addCase(fetchRealm.pending, (state) => {})
      .addCase(fetchRealm.rejected, (state) => {})
      .addCase(fetchRealm.fulfilled, (state, action: any) => {
        state.selectedRealm = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const {} = realmSlice.actions;

export default realmSlice.reducer;
