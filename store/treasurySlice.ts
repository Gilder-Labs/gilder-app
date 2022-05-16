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
  INDEX_RPC_CONNECTION,
} from "../constants/Solana";
import { getTokensInfo } from "../utils";

export interface TreasuryState {
  isLoadingVaults: boolean;
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
  vaults: [],
  tokenPriceData: null,
  governances: [],
  governancesMap: null,
  tokenMap: null,
  activeProposals: 0,
  vaultsNfts: null,
  // nftCollectionData: null,
};

let connection = new Connection(RPC_CONNECTION, "confirmed");
const indexConnection = new Connection(INDEX_RPC_CONNECTION, "recent");

const TokensInfo = getTokensInfo();

export const fetchVaults = createAsyncThunk(
  "realms/fetchVaults",
  async (realm: any) => {
    try {
      const rawGovernances = await getAllGovernances(
        indexConnection,
        new PublicKey(realm.governanceId),
        new PublicKey(realm.pubKey)
      );
      const tokenMap = {};
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
        };
      });

      const vaultsWithTokensPromise = Promise.all(
        vaultsInfo.map((vault) =>
          connection.getParsedTokenAccountsByOwner(
            new PublicKey(vault.pubKey),
            {
              programId: SPL_PUBLIC_KEY,
            }
          )
        )
      );

      const vaultNftsPromise = Promise.all(
        vaultsInfo.map((vault) =>
          axios.get("https://api.cybertino.io/querier/getSolNftByAddress", {
            params: {
              address: vault.pubKey,
            },
          })
        )
      );

      // const collectionPromise = await axios.get(
      //   "https://api-mainnet.magiceden.dev/v2/collections/runcible/stats"
      // );
      // console.log("Collections", collectionPromise.data);
      // // https://api-mainnet.magiceden.io/all_collections?edge_cache=true
      //         "https://api-mainnet.magiceden.io/all_collections_with_escrow_data?edge_cache=true"

      // const collectionResponse = await collectionPromise;
      // const collectionData = collectionResponse.data.collections;

      // SOLSCAN api for nft floor
      //https://api.solscan.io/collection?sortBy=volume&offset=0&limit=24

      const vaultNfts = await vaultNftsPromise;
      const vaultNftsMap = {};
      // const collectionMap = {};

      vaultNfts.forEach(
        (vault) =>
          // @ts-ignore
          (vaultNftsMap[vault.config.params.address] = vault.data.results)
      );

      // collectionData.forEach(
      //   (nftCollection: any) =>
      //     // @ts-ignore
      //     (collectionMap[nftCollection.symbol] = nftCollection)
      // );

      const vaultsWithTokensRaw = await vaultsWithTokensPromise;
      const tokensData = await TokensInfo;
      const coinGeckoUrl = "https://api.coingecko.com/api/v3/coins/markets";
      let tokenIds = new Set();

      let vaultsParsed = vaultsWithTokensRaw.map((vault, index) => {
        return {
          pubKey: vaultsInfo[index].pubKey, // WALLET ID
          vaultId: vaultsInfo[index].vaultId,
          // nfts: vaultNftsMap[vault]
          tokens: vault.value.map((token) => {
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
          }),
        };
      });

      const governancesMap = {};

      const governancesParsed = rawGovernances.map((governance, index) => {
        let governanceId = governance.pubkey.toBase58();
        activeProposals += governance.account.votingProposalCount;
        let data = {
          governanceId: governanceId,
          governedAccount: governance.account.governedAccount.toBase58(),
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
          // percentage of total tokens that need to vote for there to be quorum
          voteThresholdPercentage:
            governance.account.config.voteThresholdPercentage.value,
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
        vaultsNfts: vaultNftsMap,
        tokenPriceData: tokenPriceResponse.data,
        governances: governancesParsed,
        governancesMap: governancesMap,
        tokenMap: tokenMap,
        activeProposals: activeProposals,
        // nftCollectionData: collectionMap,
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
        let tokenPriceObject = {};
        // @ts-ignore
        action.payload.tokenPriceData.forEach((token) => {
          // @ts-ignore
          tokenPriceObject[token.id] = token;
        });

        state.vaultsNfts = action.payload.vaultsNfts;
        state.vaults = action.payload.vaults;
        state.isLoadingVaults = false;
        state.tokenPriceData = tokenPriceObject;
        state.governances = action.payload.governances;
        state.governancesMap = action.payload.governancesMap;
        state.tokenMap = action.payload.tokenMap;
        state.activeProposals = action.payload.activeProposals;
        // state.nftCollectionData = action.payload.nftCollectionData;
      });
  },
});

export const {} = treasurySlice.actions;

export default treasurySlice.reducer;
