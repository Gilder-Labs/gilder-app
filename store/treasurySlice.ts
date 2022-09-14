import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PublicKey, LAMPORTS_PER_SOL, Connection } from "@solana/web3.js";
import {
  getAllGovernances, // all governances of a realm
  GovernanceAccountType, // Map that has all types of governance
  getNativeTreasuryAddress,
} from "@solana/spl-governance";
import axios from "axios";

import {
  SPL_PUBLIC_KEY,
  REALM_GOVERNANCE_PKEY,
  RPC_CONNECTION,
  INDEX_RPC_CONNECTION,
} from "../constants/Solana";
import { getTokensInfo, formatVoteWeight } from "../utils";
import { RootState } from "./index";

export interface TreasuryState {
  isLoadingVaults: boolean;
  isLoadingVaultPrices: boolean;
  tokenPriceData: any;
  vaults: Array<any>;
  governances: Array<any>;
  governancesMap: any;
  tokenMap: any;
  activeProposals: number;
  vaultsNfts: any;
  // nftCollectionData: any;
}

const initialState: TreasuryState = {
  isLoadingVaults: false,
  isLoadingVaultPrices: false,
  vaults: [],
  tokenPriceData: null,
  governances: [],
  governancesMap: null,
  tokenMap: null,
  activeProposals: 0,
  vaultsNfts: null,
  // nftCollectionData: null,
};

let connection = new Connection(RPC_CONNECTION, "recent");

const TokensInfo = getTokensInfo();

console.log("rpc connection", connection);

export const fetchVaults = createAsyncThunk(
  "treasury/fetchVaults",
  async (realm: any, { getState }) => {
    // get state
    const { realms } = getState() as RootState;
    const { selectedRealm } = realms;

    try {
      const rawGovernances = await getAllGovernances(
        connection,
        new PublicKey(realm.governanceId),
        new PublicKey(realm.pubKey)
      );
      let activeProposals = 0;

      const rawFilteredVaults = rawGovernances.filter(
        (gov) =>
          gov.account.accountType === GovernanceAccountType.TokenGovernanceV1 ||
          gov.account.accountType === GovernanceAccountType.TokenGovernanceV2
      );

      const vaultsInfo = rawFilteredVaults.map((governance) => {
        return {
          pubKey: governance.pubkey.toBase58(), // program that controls vault/token account
          vaultId: governance.account?.governedAccount.toBase58(), // vault/token account where tokens are held
          isGovernanceVault: true,
          tokens: [],
        };
      });

      const rawNativeSolAddresses = await Promise.all(
        rawGovernances.map((x) =>
          getNativeTreasuryAddress(
            //@ts-ignore
            new PublicKey(selectedRealm?.governanceId),
            x!.pubkey
          )
        )
      );

      rawNativeSolAddresses.forEach((rawAddress, index) => {
        vaultsInfo.push({
          pubKey: rawAddress.toBase58(), // program that controls vault/token account
          vaultId: index.toString(), // vault/token account where tokens are held
          isGovernanceVault: false,
          tokens: [],
        });
      });

      const governancesMap = {};

      // formatVoteWeight(tokenAmt, decimals);

      const governancesParsed = rawGovernances.map((governance, index) => {
        let governanceId = governance.pubkey.toBase58();
        activeProposals += governance.account.votingProposalCount;
        let data = {
          governanceId: governanceId,
          governedAccount: governance.account.governedAccount.toBase58(),
          proposalCount: governance.account.proposalCount,
          activeProposals: governance.account.votingProposalCount,
          minCommunityTokensToCreateProposal: governance?.account?.config
            ?.minCommunityTokensToCreateProposal
            ? formatVoteWeight(
                governance.account.config.minCommunityTokensToCreateProposal.toString(),
                selectedRealm.communityMintDecimals
              )
            : undefined,
          minInstructionHoldUpTime:
            governance.account.config.minInstructionHoldUpTime,
          maxVotingTime: governance.account.config.maxVotingTime,
          minCouncilTokensToCreateProposal: governance?.account?.config
            ?.minCouncilTokensToCreateProposal
            ? formatVoteWeight(
                governance.account.config.minCouncilTokensToCreateProposal.toString(),
                selectedRealm.communityMintDecimals
              )
            : undefined,

          totalProposalCount: governance.account.proposalCount,
          votingProposalCount: governance.account.votingProposalCount,
          // percentage of total tokens that need to vote for there to be quorum
          communityVoteThresholdPercentage:
            governance.account.config.communityVoteThreshold.value,
          councilVoteThresholdPercentage:
            governance?.account?.config?.councilVetoVoteThreshold.value,

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

      return {
        vaults: vaultsInfo,
        governances: governancesParsed,
        governancesMap: governancesMap,
        activeProposals: activeProposals,
      };
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const fetchVaultPrices = createAsyncThunk(
  "treasury/fetchVaultPrices",
  async (_: any, { getState }) => {
    // get state
    const { treasury } = getState() as RootState;
    const { vaults } = treasury;

    try {
      const tokenMap = {};
      const vaultSolBalancesPromise = Promise.all(
        vaults.map((vault) =>
          connection.getBalance(new PublicKey(vault.pubKey))
        )
      );

      const vaultsWithTokensPromise = Promise.all(
        vaults.map((vault) =>
          connection.getParsedTokenAccountsByOwner(
            new PublicKey(vault.pubKey),
            {
              programId: SPL_PUBLIC_KEY,
            }
          )
        )
      );

      const vaultSolBalances = await vaultSolBalancesPromise;
      const vaultsWithTokensRaw = await vaultsWithTokensPromise;
      const tokensData = await TokensInfo;
      const coinGeckoUrl = "https://api.coingecko.com/api/v3/coins/markets";
      let tokenIds = new Set();

      let vaultsParsed = vaultsWithTokensRaw.map((vault, index) => {
        const tokens = vault.value.map((token) => {
          let tokenInfo = tokensData.get(token.account.data.parsed.info.mint);
          tokenIds.add(tokenInfo?.extensions?.coingeckoId);

          const tokenData = {
            ...tokenInfo,
            mint: token.account.data.parsed.info.mint,
            owner: token.account.data.parsed.info.owner.toString(),
            tokenAmount: token.account.data.parsed.info.tokenAmount,
            vaultId: token.pubkey.toString(),
          };
          //@ts-ignore
          tokenMap[tokenData.mint] = tokenData;
          return tokenData;
        });

        const solanaBalance = vaultSolBalances[index] / LAMPORTS_PER_SOL;

        const solTokenData = {
          tokenAmount: {
            amount: vaultSolBalances[index],
            decimals: 9,
            uiAmount: solanaBalance,
            uiAmountString: String(solanaBalance),
          },
          extensions: {
            coingeckoId: "solana",
          },
          logoURI:
            "https://assets.coingecko.com/coins/images/4128/small/solana.png?1640133422",
          decimals: 9,
          name: "Solana",
          symbol: "SOL",
          owner: "solana",
          mint: "sol",
        };

        tokens.push(solTokenData);

        return {
          pubKey: vaults[index].pubKey, // WALLET ID
          vaultId: vaults[index].vaultId,
          isGovernanceVault: vaults[index].isGovernanceVault,
          tokens: tokens,
        };
      });

      tokenIds.add("solana");
      const tokenIdsString = Array.from(tokenIds).join();
      const tokenPriceResponse = await axios.get(coinGeckoUrl, {
        params: {
          ids: tokenIdsString,
          vs_currency: "usd",
        },
      });

      return {
        vaults: vaultsParsed,
        tokenPriceData: tokenPriceResponse?.data,
        tokenMap: tokenMap,
      };
    } catch (error) {
      console.log("error", error);
    }
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
        state.vaults = action.payload?.vaults;
        state.isLoadingVaults = false;
        state.governances = action.payload?.governances;
        state.governancesMap = action.payload?.governancesMap;
        state.activeProposals = action.payload?.activeProposals;
      })
      .addCase(fetchVaultPrices.pending, (state) => {
        state.isLoadingVaultPrices = true;
      })
      .addCase(fetchVaultPrices.rejected, (state) => {
        state.isLoadingVaultPrices = false;
      })
      .addCase(fetchVaultPrices.fulfilled, (state, action: any) => {
        let tokenPriceObject = {};
        // @ts-ignore
        if (action?.payload?.tokenPriceData) {
          action?.payload?.tokenPriceData.forEach((token) => {
            // @ts-ignore
            tokenPriceObject[token.id] = token;
          });
        }
        state.vaults = action.payload?.vaults;
        state.isLoadingVaultPrices = false;
        state.tokenPriceData = tokenPriceObject;
        state.tokenMap = action.payload?.tokenMap;
      });
  },
});

export const {} = treasurySlice.actions;

export default treasurySlice.reducer;
