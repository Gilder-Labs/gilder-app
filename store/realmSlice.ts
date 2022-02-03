import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { REALM_GOVERNANCE_PKEY } from "../constants/Solana";
import { PublicKey } from "@solana/web3.js";
import { getRealms, getRealm } from "@solana/spl-governance";
import * as web3 from "@solana/web3.js";
import { SPL_PUBLIC_KEY } from "../constants/Solana";
import axios from "axios";
import { cleanRealmData } from "../utils";

export interface realmState {
  realms: Array<any>;
  selectedRealm: any;
  realmTokens: Array<any>;
  realmsData: any;
  realmWatchlist: Array<string>;
}

const initialState: realmState = {
  realms: [],
  selectedRealm: null,
  realmTokens: [],
  realmsData: cleanRealmData(),
  realmWatchlist: [
    "DPiH3H3c7t47BMxqTxLsuPQpEC6Kne8GA9VXbxpnZxFE",
    "759qyfKDMMuo9v36tW7fbGanL63mZFPNbhU7zjPrkuGK",
  ],
};

//TODO:  Running into issues with buffer. Figure out issues with deserialization and buffer.
// Testing with mango key till dao selector is built.
const mangoRealmPkey = new PublicKey(
  "DPiH3H3c7t47BMxqTxLsuPQpEC6Kne8GA9VXbxpnZxFE"
);

const monkeDaoPkey = new PublicKey(
  "B1CxhV1khhj7n5mi5hebbivesqH9mvXr5Hfh2nD2UCh6"
);

const rpcNetwork = "mainnet-beta";

export const fetchRealms = createAsyncThunk("realms/fetchRealms", async () => {
  let connection = new web3.Connection(
    web3.clusterApiUrl(rpcNetwork),
    "recent"
  );
  let realms;
  const realmsRaw = await getRealms(connection, REALM_GOVERNANCE_PKEY);
  realms = realmsRaw.map((realm) => {
    return {
      name: realm.account.name,
      pubKey: realm.pubkey.toString(),
    };
  });
  // TODO change this to selected dao
  return { realms: realms };
});

// TODO set up to be selectable
export const fetchRealm = createAsyncThunk(
  "realms/fetchRealm",
  async (realmId: string) => {
    let connection = new web3.Connection(
      web3.clusterApiUrl(rpcNetwork),
      "recent"
    );

    const rawRealm = await getRealm(connection, new PublicKey(realmId));

    return { name: rawRealm.account.name, pubKey: rawRealm.pubkey.toString() };
  }
);

// TODO needs to be optimized
export const fetchRealmTokens = createAsyncThunk(
  "realms/fetchRealmTokens",
  async (pubKey: string) => {
    let connection = new web3.Connection(
      web3.clusterApiUrl(rpcNetwork),
      "confirmed"
    );

    const rawTokensResponse = await connection.getParsedTokenAccountsByOwner(
      new PublicKey(pubKey),
      {
        programId: SPL_PUBLIC_KEY,
      }
    );
    const rawTokens = rawTokensResponse.value;

    let tokens = rawTokens.map((token) => {
      return {
        mint: token.account.data.parsed.info.mint,
        tokenAmount: token.account.data.parsed.info.tokenAmount,
        pubKey: token.pubkey.toString(),
      };
    });

    return tokens;
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
        state.realms = action.payload.realms;
        // state.selectedRealm = action.payload.selectedRealm;
      })
      .addCase(fetchRealm.pending, (state) => {})
      .addCase(fetchRealm.rejected, (state) => {})
      .addCase(fetchRealm.fulfilled, (state, action: any) => {
        state.selectedRealm = action.payload;
      })
      .addCase(fetchRealmTokens.pending, (state) => {})
      .addCase(fetchRealmTokens.rejected, (state) => {})
      .addCase(fetchRealmTokens.fulfilled, (state, action: any) => {
        state.realmTokens = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const {} = realmSlice.actions;

export default realmSlice.reducer;
