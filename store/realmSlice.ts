import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { REALM_GOVERNANCE_PKEY } from "../constants/Solana";
import { PublicKey } from "@solana/web3.js";
import { getRealms, getRealm, getGovernance } from "@solana/spl-governance";
import * as web3 from "@solana/web3.js";
import { SPL_PUBLIC_KEY } from "../constants/Solana";
import axios from "axios";

export interface realmState {
  realms: Array<any>;
  selectedRealm: any;
  realmTokens: Array<any>;
}

const initialState: realmState = {
  realms: [],
  selectedRealm: null,
  realmTokens: [],
};

//TODO:  Running into issues with buffer. Figure out issues with deserialization and buffer.
// Testing with mango key till dao selector is built.
const mangoRealmPkey = new PublicKey(
  "DPiH3H3c7t47BMxqTxLsuPQpEC6Kne8GA9VXbxpnZxFE"
);

const monkeDaoPkey = new PublicKey(
  "B1CxhV1khhj7n5mi5hebbivesqH9mvXr5Hfh2nD2UCh6"
);

const rpcEndpoint = "https://api.mainnet-beta.solana.com";

export const fetchRealms = createAsyncThunk(
  "realms/fetchRealms",
  async (_: any, { getState: Rootstate }) => {
    // const realms = await getRealms(getState., REALM_GOVERNANCE_PKEY);
    // console.log("realms hopefully", realms[0].pubkey);
    // return realms;
    return [];
  }
);

export const fetchRealm = createAsyncThunk("realms/fetchRealm", async () => {
  let connection = new web3.Connection(
    web3.clusterApiUrl("mainnet-beta"),
    "confirmed"
  );

  const realm = await getRealm(connection, mangoRealmPkey);
  return realm;
});

export const fetchTokens = createAsyncThunk("realms/fetchTokens", async () => {
  console.log("starting fetch");
  let connection = new web3.Connection(
    web3.clusterApiUrl("mainnet-beta"),
    "confirmed"
  );

  const rawTokenAccountResult = await connection.getParsedTokenAccountsByOwner(
    // mangoRealmPkey,
    monkeDaoPkey,
    {
      programId: SPL_PUBLIC_KEY,
    }
  );
  console.log("raw tokens", rawTokenAccountResult);

  return [];
});

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
      })
      .addCase(fetchTokens.pending, (state) => {})
      .addCase(fetchTokens.rejected, (state) => {})
      .addCase(fetchTokens.fulfilled, (state, action: any) => {
        state.realmTokens = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const {} = realmSlice.actions;

export default realmSlice.reducer;
