import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PublicKey, Connection } from "@solana/web3.js";
import {
  SPL_PUBLIC_KEY,
  REALM_GOVERNANCE_PKEY,
  RPC_CONNECTION,
  HEAVY_RPC_CONNECTION,
} from "../constants/Solana";
import {
  cleanRealmData,
  getTokensInfo,
  extractLogInfo,
  gqlClient,
} from "../utils";
import { RootState } from ".";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllRealms, getRealm } from "@gilder/gql-client";

export interface realmState {
  realms: Array<any>;
  realmsMap: any;
  selectedRealm: Realm;
  selectedRealmId: string;
  realmsData: any;
  realmWatchlist: Array<string>;
  isLoadingRealms: boolean;
  isLoadingSelectedRealm: boolean;
  isFetchingStorage: boolean;
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
  realmsMap: {},
  selectedRealm: null,
  realmsData: cleanedRealmData,
  selectedRealmId: "",
  realmWatchlist: [],
  isLoadingRealms: false,
  isLoadingSelectedRealm: false,
  isFetchingStorage: false,
};

// getMultipleAccounts - gets account info of a bunch of accounts in 1 api request

const connection = new Connection(RPC_CONNECTION, "confirmed");

export const fetchRealms = createAsyncThunk("realms/fetchRealms", async () => {
  try {
    let realms;
    let realmsMap = {};
    const realmsRaw = await getAllRealms(gqlClient);
    // const realmsRaw = await getRealms(connection, REALM_GOVERNANCE_PKEY);

    // get realms with unique program id
    let realmDataKeys = Object.keys(cleanedRealmData);
    let uniqueRealmGovs = realmDataKeys.filter(
      (realmId) =>
        cleanedRealmData[realmId].programId !== REALM_GOVERNANCE_PKEY.toBase58()
    );
    // add them into realms list
    let realmsWithGovs = uniqueRealmGovs.map((realmId) => {
      const realmWithGov = cleanedRealmData[realmId];
      const pubkey = realmWithGov?.realmId;

      let realmData = {
        name: realmWithGov?.displayName || realmWithGov?.symbol,
        governanceId: realmWithGov?.programId,
        pubKey: pubkey,
        realmId: pubkey,
      };

      // @ts-ignore
      realmsMap[pubkey] = realmData;
      return realmData;
    });

    realms = realmsRaw.map((realm) => {
      // realm is in our realmdata from : https://github.com/solana-labs/governance-ui/blob/main/public/realms/mainnet-beta.json
      // delete off object so we can find custom governanceId realms we need to add to realm list
      let realmId = realm.realmPk.toBase58();

      let realmData = {
        name: realm.name,
        pubKey: realmId,
        realmId: realmId,
        communityMint: realm.communityMintPk.toBase58(),
        councilMint: realm.config?.councilMintPk?.toBase58() || null,
        governanceId: realm.programPk.toBase58(),
        votingProposalCount: realm.votingProposalCount,
        maxVoteWeight:
          realm.config.communityMintMaxVoteWeightSource.value.toNumber(),
        minTokensToCreateGov:
          realm.config.minCommunityTokensToCreateGovernance.toString(),
      };
      // @ts-ignore
      realmsMap[realmId] = realmData;
      return realmData;
    });

    return { realms: [...realmsWithGovs, ...realms], realmsMap: realmsMap };
  } catch (error) {
    console.log("error", error);
  }
});

export const fetchRealm = createAsyncThunk(
  "realms/fetchRealm",
  async (realmId: string) => {
    try {
      const rawRealm = await getRealm({ realmPk: realmId }, gqlClient);
      let communityMintData = null;
      let communityMintPromise;
      let councilMintData = null;
      let councilMintPromise;

      if (rawRealm.communityMintPk) {
        communityMintPromise = connection.getParsedAccountInfo(
          new PublicKey(rawRealm.communityMintPk)
        );
      }
      if (rawRealm.config.councilMintPk) {
        councilMintPromise = connection.getParsedAccountInfo(
          new PublicKey(rawRealm.config.councilMintPk)
        );
      }

      if (rawRealm.communityMintPk) {
        communityMintData = await communityMintPromise;
        // console.log("community mint data", communityMintData);
      }
      if (rawRealm.config.councilMintPk) {
        councilMintData = await councilMintPromise;
        // console.log("council mint data", councilMintData);
      }

      // NOTE: if a realm has a addin, this will return what addins they have.
      // IE: mango has "communityVoterWeightAddin"
      // const realmConfig = await tryGetRealmConfig(
      //   connection,
      //   rawRealm?.owner,
      //   new PublicKey(realmId)
      // );
      // console.log("realm config", realmConfig);

      console.log(rawRealm);

      const selectedRealmData = {
        name: rawRealm.name,
        pubKey: rawRealm.realmPk.toBase58(),
        realmId: rawRealm.realmPk.toBase58(),
        communityMint: rawRealm.communityMintPk.toBase58(),
        communityMintDecimals: communityMintData
          ? communityMintData.value?.data?.parsed?.info?.decimals
          : null,
        communityMintSupply: communityMintData
          ? communityMintData.value?.data?.parsed?.info?.supply
          : null,
        councilMint: rawRealm?.config?.councilMintPk?.toBase58() || null,
        councilMintDecimals: councilMintData
          ? councilMintData.value?.data?.parsed?.info?.decimals
          : null,
        councilMintSupply: councilMintData
          ? councilMintData.value?.data?.parsed?.info?.supply
          : null,
        governanceId: rawRealm?.programPk.toBase58(),
        votingProposalCount: rawRealm.votingProposalCount,
        maxVoteWeight:
          rawRealm.config.communityMintMaxVoteWeightSource.value.toNumber(),
        minTokensToCreateGov:
          rawRealm.config.minCommunityTokensToCreateGovernance.toString(),
        fmtSupplyFraction:
          rawRealm.config.communityMintMaxVoteWeightSource.fmtSupplyFractionPercentage(),
        supplyFraction: rawRealm.config.communityMintMaxVoteWeightSource
          .getSupplyFraction()
          .toNumber(),
        isFullSupply:
          rawRealm.config.communityMintMaxVoteWeightSource.isFullSupply(),
      };

      await AsyncStorage.setItem(
        "@selectedRealm",
        JSON.stringify(selectedRealmData)
      );

      return selectedRealmData;
    } catch (error) {
      console.log("error in fetch realm", error);
      console.log("error fetching realm:", realmId);
    }
  }
);

export const fetchStorage = createAsyncThunk(
  "realms/fetchStorage",
  async () => {
    try {
      const watchListJSON = await AsyncStorage.getItem("@watchList");
      const selectedRealmJSON = await AsyncStorage.getItem("@selectedRealm");

      return {
        // @ts-ignore
        watchList: JSON.parse(watchListJSON)?.watchList || [],
        // @ts-ignore
        selectedRealm: JSON.parse(selectedRealmJSON),
      };
    } catch (error) {
      console.log("error in fetch realm", error);
    }
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
        const watchlist = { watchList: state.realmWatchlist };
        const jsonValue = JSON.stringify(watchlist);
        AsyncStorage.setItem("@watchList", jsonValue);
      } else {
        // else toggle on
        state.realmWatchlist.splice(realmIdIndex, 1);
        const watchlist = { watchList: state.realmWatchlist };
        const jsonValue = JSON.stringify(watchlist);
        AsyncStorage.setItem("@watchList", jsonValue);
      }
    },
    selectRealm: (state, action) => {
      state.selectedRealm = action.payload;
    },
    realmLoaded: (state, action) => {
      state.isLoadingSelectedRealm = false;
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
        state.realms = action.payload?.realms;
        state.realmsMap = action.payload?.realmsMap;
        state.isLoadingRealms = false;
      })
      .addCase(fetchRealm.pending, (state, action) => {
        state.selectedRealmId = action.meta?.arg;
        state.isLoadingSelectedRealm = true;
      })
      .addCase(fetchRealm.rejected, (state) => {
        state.isLoadingSelectedRealm = false;
      })
      .addCase(fetchRealm.fulfilled, (state, action: any) => {
        state.selectedRealm = action.payload;
        state.isLoadingSelectedRealm = false;
      })
      .addCase(fetchStorage.pending, (state, action) => {
        state.isFetchingStorage = true;
      })
      .addCase(fetchStorage.rejected, (state) => {
        state.isFetchingStorage = false;
      })
      .addCase(fetchStorage.fulfilled, (state, action: any) => {
        state.isFetchingStorage = false;
        state.selectedRealm = action.payload.selectedRealm
          ? action.payload.selectedRealm
          : null;
        state.selectedRealmId = action.payload.selectedRealm
          ? action.payload.selectedRealm.pubKey
          : null;
        state.realmWatchlist = action.payload?.watchList || [];
      });
  },
});

export const { toggleRealmInWatchlist, realmLoaded, selectRealm } =
  realmSlice.actions;

export default realmSlice.reducer;
