import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { REALM_GOVERNANCE_PKEY } from "../constants/Solana";
import { PublicKey, ConfirmedSignatureInfo } from "@solana/web3.js";
import {
  getRealms,
  getRealm,
  getTokenOwnerRecordsByOwner,
} from "@solana/spl-governance";
import * as web3 from "@solana/web3.js";
import { SPL_PUBLIC_KEY } from "../constants/Solana";
import { cleanRealmData } from "../utils";

export interface realmState {
  realms: Array<any>;
  selectedRealm: any;
  realmTokens: Array<any>;
  realmsData: any;
  realmWatchlist: Array<string>;
  realmMembers: Array<any>;
  realmProposals: Array<any>;
  realmActivity: Array<ConfirmedSignatureInfo>;
}

const initialState: realmState = {
  realms: [],
  selectedRealm: null,
  realmTokens: [],
  realmsData: cleanRealmData(),
  realmMembers: [],
  realmProposals: [],
  // TODO: eventually store in local storage
  realmWatchlist: [
    "DPiH3H3c7t47BMxqTxLsuPQpEC6Kne8GA9VXbxpnZxFE",
    "759qyfKDMMuo9v36tW7fbGanL63mZFPNbhU7zjPrkuGK",
    "GBXLYo4ycRNfzuzYeudu6y2ng4afNeW14WcpM2E4JJSL",
    "39aX7mDZ1VLpZcPWstBhQBoqwNkhf5f1KDACguvrryi6",
  ],
  realmActivity: [],
};

// Testing with mango key till dao selector is built.
const mangoRealmPkey = new PublicKey(
  "DPiH3H3c7t47BMxqTxLsuPQpEC6Kne8GA9VXbxpnZxFE"
);

const monkeDaoPkey = new PublicKey(
  "B1CxhV1khhj7n5mi5hebbivesqH9mvXr5Hfh2nD2UCh6"
);

// 'devnet' | 'testnet' | 'mainnet-beta';
const rpcNetwork = "mainnet-beta";

export const fetchRealms = createAsyncThunk("realms/fetchRealms", async () => {
  let connection = new web3.Connection(
    web3.clusterApiUrl(rpcNetwork),
    "recent"
  );
  let realms;
  const realmsRaw = await getRealms(connection, REALM_GOVERNANCE_PKEY);
  // console.log("realmsRaw", realmsRaw);
  realms = realmsRaw.map((realm) => {
    return {
      name: realm.account.name,
      pubKey: realm.pubkey.toString(),
      communityMint: realm.account.communityMint.toString(),
      councilMint: realm.account?.config?.councilMint?.toString(),
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

    return {
      name: rawRealm.account.name,
      pubKey: rawRealm.pubkey.toString(),
      communityMint: rawRealm.account.communityMint.toString(),
      councilMint: rawRealm.account?.config?.councilMint?.toString(),
      governanceId: rawRealm?.owner.toString(),
    };
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

export const fetchRealmActivity = createAsyncThunk(
  "realms/fetchRealmActivity",
  async (pubKey: string) => {
    let connection = new web3.Connection(
      web3.clusterApiUrl(rpcNetwork),
      "confirmed"
    );

    const transactions = await connection.getConfirmedSignaturesForAddress2(
      new PublicKey(pubKey),
      { limit: 20 }
    );

    // let signatures = transactions.map((transaction) => {
    //   return transaction.signature;
    // });

    // TODO: This gets more contextual info about our transactions
    // const rawTransactionsFilled =
    //   await connection.getParsedConfirmedTransactions(signatures);

    // console.log("rawTransactions filled?", rawTransactionsFilled);

    return transactions;
  }
);

export const fetchRealmMembers = createAsyncThunk(
  "realms/fetchRealmMembers",
  async (communityMint: string) => {
    // TODO: handle councilMint tokens
    let connection = new web3.Connection(
      web3.clusterApiUrl(rpcNetwork),
      "confirmed"
    );

    return [];
  }
);

export const fetchRealmProposals = createAsyncThunk(
  "realms/fetchRealmProposals",
  async () => {
    // TODO: handle councilMint tokens
    let connection = new web3.Connection(
      web3.clusterApiUrl(rpcNetwork),
      "confirmed"
    );

    return [];
  }
);

export const realmSlice = createSlice({
  name: "realms",
  initialState,
  reducers: {
    addRealmToWatchlist: (state, action) => {
      state.realmWatchlist.push(action.payload);
    },
  },
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
      .addCase(fetchRealmActivity.pending, (state) => {})
      .addCase(fetchRealmActivity.rejected, (state) => {})
      .addCase(fetchRealmActivity.fulfilled, (state, action: any) => {
        state.realmActivity = action.payload;
      })
      .addCase(fetchRealmMembers.pending, (state) => {})
      .addCase(fetchRealmMembers.rejected, (state) => {})
      .addCase(fetchRealmMembers.fulfilled, (state, action: any) => {
        state.realmMembers = action.payload;
      })
      .addCase(fetchRealmProposals.pending, (state) => {})
      .addCase(fetchRealmProposals.rejected, (state) => {})
      .addCase(fetchRealmProposals.fulfilled, (state, action: any) => {
        state.realmProposals = action.payload;
      })
      .addCase(fetchRealmTokens.pending, (state) => {})
      .addCase(fetchRealmTokens.rejected, (state) => {})
      .addCase(fetchRealmTokens.fulfilled, (state, action: any) => {
        state.realmTokens = action.payload;
      });
  },
});

export const { addRealmToWatchlist } = realmSlice.actions;

export default realmSlice.reducer;
