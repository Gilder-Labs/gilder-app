import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PublicKey, ConfirmedSignatureInfo } from "@solana/web3.js";
import {
  getRealms,
  getRealm,
  getAllGovernances, // all governances of a realm
  ProposalState,
  getAllProposals,
  getAllTokenOwnerRecords, // returns all members of a realm
  GovernanceAccountType, // Map that has all types of governance
  GovernanceInstruction,
  getGovernance,
} from "@solana/spl-governance";

import * as web3 from "@solana/web3.js";
import {
  SPL_PUBLIC_KEY,
  REALM_GOVERNANCE_PKEY,
  RPC_CONNECTION,
} from "../constants/Solana";
import { cleanRealmData, getTokensInfo, extractLogInfo } from "../utils";

export interface realmState {
  realms: Array<any>;
  selectedRealm: any;
  realmsData: any;
  realmWatchlist: Array<string>;
  realmMembers: Array<any>;
  tokenPriceData: any;
  isLoadingMembers: boolean;
  isLoadingRealms: boolean;
}

interface realmType {
  name: string;
  pubKey: string;
  communityMint: string;
  councilMint: string;
  governanceId: string;
}

const cleanedRealmData = cleanRealmData();

const initialState: realmState = {
  realms: [],
  selectedRealm: null,
  realmsData: cleanedRealmData,
  realmMembers: [],
  tokenPriceData: null,
  realmWatchlist: [],
  isLoadingMembers: false,
  isLoadingRealms: false,
};

// getMultipleAccounts - gets account info of a bunch of accounts in 1 api request

let connection = new web3.Connection(RPC_CONNECTION, "confirmed");

export const fetchRealms = createAsyncThunk("realms/fetchRealms", async () => {
  let realms;
  const realmsRaw = await getRealms(connection, REALM_GOVERNANCE_PKEY);

  // get realms with unique program id
  let realmDataKeys = Object.keys(cleanedRealmData);
  let uniqueRealmGovs = realmDataKeys.filter(
    (realmId) =>
      cleanedRealmData[realmId].programId !== REALM_GOVERNANCE_PKEY.toString()
  );
  // add them into realms list
  let realmsWithGovs = uniqueRealmGovs.map((realmId) => {
    const realmWithGov = cleanedRealmData[realmId];
    return {
      name: realmWithGov?.displayName || realmWithGov?.symbol,
      governanceId: realmWithGov?.programId,
      pubKey: realmWithGov?.realmId,
    };
  });

  realms = realmsRaw.map((realm) => {
    // realm is in our realmdata from : https://github.com/solana-labs/governance-ui/blob/main/public/realms/mainnet-beta.json
    // delete off object so we can find custom governanceId realms we need to add to realm list
    return {
      name: realm.account.name,
      pubKey: realm.pubkey.toString(),
      communityMint: realm.account.communityMint.toString(),
      councilMint: realm.account?.config?.councilMint?.toString(),
      governanceId: realm?.owner.toString(),
      accountType: realm.account.accountType,
      votingProposalCount: realm.account.votingProposalCount,
    };
  });

  return { realms: [...realmsWithGovs, ...realms] };
});

export const fetchRealm = createAsyncThunk(
  "realms/fetchRealm",
  async (realmId: string) => {
    const rawRealm = await getRealm(connection, new PublicKey(realmId));
    return {
      name: rawRealm.account.name,
      pubKey: rawRealm.pubkey.toString(),
      communityMint: rawRealm.account.communityMint.toString(),
      councilMint: rawRealm.account?.config?.councilMint?.toString(),
      governanceId: rawRealm?.owner.toString(),
      accountType: rawRealm.account.accountType,
      votingProposalCount: rawRealm.account.votingProposalCount,
    };
  }
);

export const fetchRealmMembers = createAsyncThunk(
  "realms/fetchRealmMembers",
  async (realm: realmType) => {
    // TODO: handle councilMint tokens

    let rawTokenOwnerRecords;

    try {
      rawTokenOwnerRecords = await getAllTokenOwnerRecords(
        connection,
        new PublicKey(realm.governanceId),
        new PublicKey(realm.pubKey)
      );
      // console.log("token mems?", rawTokenOwnerRecords);
    } catch (error) {
      console.log("error", error);
    }

    const members = rawTokenOwnerRecords?.map((member) => {
      return {
        publicKey: member.pubkey.toString(),
        owner: member.owner.toString(), // RealmId
        totalVotesCount: member.account.totalVotesCount, // How many votes they have
        outstandingProposalCount: member.account.outstandingProposalCount,
        governingTokenOwner: member.account.governingTokenOwner.toString(), // Wallet address of owner of dao token
        governingTokenMint: member.account.governingTokenMint.toString(),
        depositAmount: member.account.governingTokenDepositAmount.toString(),
      };
    });

    const sortedMembers = members?.sort(
      // @ts-ignore
      (a, b) => b?.totalVotesCount - a?.totalVotesCount
    );

    return sortedMembers;
  }
);

export const realmSlice = createSlice({
  name: "realms",
  initialState,
  reducers: {
    toggleRealmInWatchlist: (state, action) => {
      const realmId = action.payload;

      const realmIdIndex = state.realmWatchlist.findIndex(
        (id) => id === realmId
      );
      if (realmIdIndex < 0) {
        // if in watchlist toggle off
        state.realmWatchlist.push(action.payload);
      } else {
        // else toggle on
        state.realmWatchlist.splice(realmIdIndex, 1);
      }
    },
    selectRealm: (state, action) => {
      state.selectedRealm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRealms.pending, (state) => {
        state.isLoadingRealms = true;
      })
      .addCase(fetchRealms.rejected, (state) => {
        state.isLoadingRealms = false;
        // TODO handle error
      })
      .addCase(fetchRealms.fulfilled, (state, action: any) => {
        state.realms = action.payload.realms;
        state.isLoadingRealms = false;

        // state.selectedRealm = action.payload.selectedRealm;
      })
      .addCase(fetchRealm.pending, (state) => {})
      .addCase(fetchRealm.rejected, (state) => {})
      .addCase(fetchRealm.fulfilled, (state, action: any) => {
        state.selectedRealm = action.payload;
      })
      .addCase(fetchRealmMembers.pending, (state) => {
        state.isLoadingMembers = true;
      })
      .addCase(fetchRealmMembers.rejected, (state) => {
        state.isLoadingMembers = false;
      })
      .addCase(fetchRealmMembers.fulfilled, (state, action: any) => {
        state.isLoadingMembers = false;

        state.realmMembers = action.payload;
      });
  },
});

export const { toggleRealmInWatchlist } = realmSlice.actions;

export default realmSlice.reducer;
