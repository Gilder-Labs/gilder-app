import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PublicKey, Connection } from "@solana/web3.js";

import { RPC_CONNECTION } from "../constants/Solana";
import { extractLogInfo } from "../utils";

export interface ActivityState {
  isLoadingActivities: boolean;
  realmActivity: Array<any>;
}

const initialState: ActivityState = {
  isLoadingActivities: false,
  realmActivity: [],
};

let connection = new Connection(RPC_CONNECTION, "confirmed");

export const fetchRealmActivity = createAsyncThunk(
  "realms/fetchRealmActivity",
  async ({ realm, fetchAfterSignature }: any) => {
    let rawTransactionsFilled;
    let activitiesParsed = [];

    try {
      let transactions = await connection.getConfirmedSignaturesForAddress2(
        new PublicKey(realm?.pubKey),
        {
          limit: 20,
          before: fetchAfterSignature ? fetchAfterSignature : undefined,
        }
      );

      transactions = transactions?.sort(
        // @ts-ignore
        (a, b) => b?.blockTime - a?.blockTime
      );

      let signatures = transactions.map((transaction) => {
        return transaction.signature;
      });

      rawTransactionsFilled = await connection.getParsedTransactions(
        signatures
      );

      activitiesParsed = rawTransactionsFilled?.map((transaction, index) => {
        return {
          signature: transactions[index].signature,
          blockTime: transaction?.blockTime,
          // @ts-ignore
          status: transaction?.meta?.status,
          logs: transaction?.meta?.logMessages,
          logsParsed: extractLogInfo(transaction?.meta?.logMessages),
        };
      });

      return {
        activities: activitiesParsed,
        fetchedMore: !!fetchAfterSignature,
      };
    } catch (error) {
      console.log("transaction error", error);
    }
    return [];
  }
);

export const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRealmActivity.pending, (state) => {
        state.isLoadingActivities = true;
      })
      .addCase(fetchRealmActivity.rejected, (state) => {
        state.isLoadingActivities = false;
      })
      .addCase(fetchRealmActivity.fulfilled, (state, action: any) => {
        state.isLoadingActivities = false;

        if (action.payload.fetchedMore) {
          state.realmActivity = [
            ...state.realmActivity,
            ...action.payload.activities,
          ];
        } else {
          state.realmActivity = action.payload.activities;
        }
      });
  },
});

export const {} = activitySlice.actions;

export default activitySlice.reducer;
