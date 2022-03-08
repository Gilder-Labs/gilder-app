import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PublicKey, ConfirmedSignatureInfo, Connection } from "@solana/web3.js";
import {
  getAllGovernances, // all governances of a realm
  GovernanceAccountType, // Map that has all types of governance
} from "@solana/spl-governance";
import axios from "axios";

import {
  SPL_PUBLIC_KEY,
  REALM_GOVERNANCE_PKEY,
  RPC_CONNECTION,
} from "../constants/Solana";
import { getTokensInfo } from "../utils";

export interface TreasuryState {
  isLoadingVaults: boolean;
  tokenPriceData: any;
  vaults: Array<any>;
  governances: Array<any>;
  governancesMap: any;
}

const initialState: TreasuryState = {
  isLoadingVaults: false,
  vaults: [],
  tokenPriceData: null,
  governances: [],
  governancesMap: null,
};

let connection = new Connection(RPC_CONNECTION, "confirmed");
const TokensInfo = getTokensInfo();

export const fetchVaults = createAsyncThunk(
  "realms/fetchVaults",
  async (realm: any) => {
    const rawGovernances = await getAllGovernances(
      connection,
      new PublicKey(realm.governanceId),
      new PublicKey(realm.pubKey)
    );

    // console.log("governances", rawGovernances);

    const rawFilteredVaults = rawGovernances.filter(
      (gov) =>
        gov.account.accountType === GovernanceAccountType.TokenGovernanceV1 ||
        gov.account.accountType === GovernanceAccountType.TokenGovernanceV2
    );

    const vaultsInfo = rawFilteredVaults.map((governance) => {
      return {
        pubKey: governance.pubkey.toString(), // program that controls vault/token account
        vaultId: governance.account?.governedAccount.toString(), // vault/token account where tokens are held
      };
    });

    const vaultsWithTokensRaw = await Promise.all(
      vaultsInfo.map((vault) =>
        connection.getParsedTokenAccountsByOwner(new PublicKey(vault.pubKey), {
          programId: SPL_PUBLIC_KEY,
        })
      )
    );

    const tokensData = await TokensInfo;
    const coinGeckoUrl = "https://api.coingecko.com/api/v3/coins/markets";
    let tokenIds = new Set();

    let vaultsParsed = vaultsWithTokensRaw.map((vault, index) => {
      return {
        pubKey: vaultsInfo[index].pubKey,
        vaultId: vaultsInfo[index].vaultId,
        tokens: vault.value.map((token) => {
          let tokenInfo = tokensData.get(token.account.data.parsed.info.mint);
          tokenIds.add(tokenInfo?.extensions?.coingeckoId);
          return {
            ...tokenInfo,
            mint: token.account.data.parsed.info.mint,
            owner: token.account.data.parsed.info.owner.toString(),
            tokenAmount: token.account.data.parsed.info.tokenAmount,
            vaultId: token.pubkey.toString(),
          };
        }),
      };
    });

    const governancesMap = {};

    const governancesParsed = rawGovernances.map((governance, index) => {
      let governanceId = governance.pubkey.toString();
      let data = {
        governanceId: governanceId,
        governedAccount: governance.account.governedAccount.toString(),
        minCommunityTokensToCreateProposal:
          governance.account.config.minCommunityTokensToCreateProposal.toNumber(),
        minInstructionHoldUpTime:
          governance.account.config.minInstructionHoldUpTime,
        maxVotingTime: governance.account.config.maxVotingTime,
        voteTipping: governance.account.config.voteTipping,
        proposalCoolOffTime: governance.account.config.proposalCoolOffTime,
        minCouncilTokensToCreateProposal:
          governance.account.config.minCouncilTokensToCreateProposal.toNumber(),
        totalProposalCount: governance.account.proposalCount,
        votingProposalCount: governance.account.votingProposalCount,
        // voteThresholdPercentage:
        //   governance.account.config.voteThresholdPercentage,
        accountType: governance.account.accountType,
        isAccountGovernance: governance.account.isAccountGovernance(),
        isMintGovernance: governance.account.isMintGovernance(),
        isProgramGovernance: governance.account.isProgramGovernance(),
        isTokenGovernance: governance.account.isTokenGovernance(),
      };
      // @ts-ignore
      governancesMap[governanceId] = data;
      return data;
    });

    const tokenIdsString = Array.from(tokenIds).join();
    const tokenPriceResponse = await axios.get(coinGeckoUrl, {
      params: {
        ids: tokenIdsString,
        vs_currency: "usd",
      },
    });

    return {
      vaults: vaultsParsed,
      tokenPriceData: tokenPriceResponse.data,
      governances: governancesParsed,
      governancesMap: governancesMap,
    };
  }
);

export const treasurySlice = createSlice({
  name: "treasury",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVaults.pending, (state) => {
        state.isLoadingVaults = true;
      })
      .addCase(fetchVaults.rejected, (state) => {
        state.isLoadingVaults = false;
      })
      .addCase(fetchVaults.fulfilled, (state, action: any) => {
        let tokenPriceObject = {};
        // @ts-ignore
        action.payload.tokenPriceData.forEach((token) => {
          // @ts-ignore
          tokenPriceObject[token.id] = token;
        });

        state.vaults = action.payload.vaults;
        state.isLoadingVaults = false;
        state.tokenPriceData = tokenPriceObject;
        state.governances = action.payload.governances;
        state.governancesMap = action.payload.governancesMap;
      });
  },
});

export const {} = treasurySlice.actions;

export default treasurySlice.reducer;
