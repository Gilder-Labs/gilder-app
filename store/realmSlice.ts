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
} from "@solana/spl-governance";

import * as web3 from "@solana/web3.js";
import { SPL_PUBLIC_KEY, REALM_GOVERNANCE_PKEY } from "../constants/Solana";
import { cleanRealmData, getTokensInfo } from "../utils";

export interface realmState {
  realms: Array<any>;
  selectedRealm: any;
  realmVaults: Array<any>;
  realmsData: any;
  realmWatchlist: Array<string>;
  realmMembers: Array<any>;
  realmProposals: Array<any>;
  realmActivity: Array<ConfirmedSignatureInfo>;
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
  realmVaults: [],
  realmsData: cleanedRealmData,
  realmMembers: [],
  realmProposals: [],
  // TODO: eventually store in local storage
  realmWatchlist: [
    "DPiH3H3c7t47BMxqTxLsuPQpEC6Kne8GA9VXbxpnZxFE", // mango
    "759qyfKDMMuo9v36tW7fbGanL63mZFPNbhU7zjPrkuGK", // socean
    // "GBXLYo4ycRNfzuzYeudu6y2ng4afNeW14WcpM2E4JJSL", // uxd
    "B1CxhV1khhj7n5mi5hebbivesqH9mvXr5Hfh2nD2UCh6", // real monke dao
    "By2sVGZXwfQq6rAiAM3rNPJ9iQfb5e2QhnF4YjJ4Bip", // grape
  ],
  realmActivity: [],
};
/* 
  main: https://ssc-dao.genesysgo.net/  
  devnet: https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/
  devent: wss://psytrbhymqlkfrhudd.dev.genesysgo.net:8900/
*/
const rpcConnection = "https://ssc-dao.genesysgo.net/";

let connection = new web3.Connection(rpcConnection, "confirmed");
const TokensInfo = getTokensInfo();

export const fetchRealms = createAsyncThunk("realms/fetchRealms", async () => {
  let realms;
  const realmsRaw = await getRealms(connection, REALM_GOVERNANCE_PKEY);
  realms = realmsRaw.map((realm) => {
    return {
      name: realm.account.name,
      pubKey: realm.pubkey.toString(),
      communityMint: realm.account.communityMint.toString(),
      councilMint: realm.account?.config?.councilMint?.toString(),
      overnanceId: realm?.owner.toString(),
    };
  });
  return { realms: realms };
});

export const fetchRealm = createAsyncThunk(
  "realms/fetchRealm",
  async (realmId: string) => {
    const rawRealm = await getRealm(connection, new PublicKey(realmId));
    console.log("rawrealm", rawRealm);
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
export const fetchRealmVaults = createAsyncThunk(
  "realms/fetchRealmVaults",
  async (realm: any) => {
    const rawGovernances = await getAllGovernances(
      connection,
      new PublicKey(realm.governanceId),
      new PublicKey(realm.pubKey)
    );

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

    let vaultsParsed = vaultsWithTokensRaw.map((vault, index) => {
      return {
        pubKey: vaultsInfo[index].pubKey,
        vaultId: vaultsInfo[index].vaultId,
        tokens: vault.value.map((token) => {
          let tokenInfo = tokensData.get(token.account.data.parsed.info.mint);
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

    return vaultsParsed;
  }
);

export const fetchRealmActivity = createAsyncThunk(
  "realms/fetchRealmActivity",
  async (realm: any) => {
    let transactions;

    try {
      transactions = await connection.getConfirmedSignaturesForAddress2(
        new PublicKey(realm?.pubKey),
        { limit: 20 }
      );

      transactions = transactions?.sort(
        // @ts-ignore
        (a, b) => b?.blockTime - a?.blockTime
      );
    } catch (error) {
      console.log("transaction error", error);
    }

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

    return members;
  }
);

export const fetchRealmProposals = createAsyncThunk(
  "realms/fetchRealmProposals",
  async (realm: any) => {
    let rawProposals;
    const governanceId = new PublicKey(realm.governanceId);

    try {
      rawProposals = await getAllProposals(
        connection,
        governanceId,
        new PublicKey(realm.pubKey)
      );
      rawProposals = rawProposals.flat();
    } catch (error) {
      console.log("error", error);
    }

    // votingAt, signingOffAt, votingCompletedAt, draftAt, executingAt
    // format(getStateTimestamp * 1000, "LLL cc, yyyy"
    let proposals = rawProposals?.map((proposal: any) => {
      return {
        description: proposal?.account?.descriptionLink,
        name: proposal?.account?.name,
        proposalId: proposal.pubkey.toString(),
        status: ProposalState[proposal?.account?.state],
        isVoteFinalized: proposal.account.isVoteFinalized(),
        isFinalState: proposal.account.isFinalState(),
        getStateSortRank: proposal.account.getStateSortRank(),
        isPreVotingState: proposal.account.isPreVotingState(),
        // getYesVoteOption: proposal.account.getYesVoteOption(),
        getYesVoteCount: proposal.account.getYesVoteCount().toString(),
        getNoVoteCount: proposal.account.getNoVoteCount().toString(),
        // getTimeToVoteEnd: proposal.account.getTimeToVoteEnd(governanceId),
        // hasVoteTimeEnded: proposal.account.hasVoteTimeEnded(governanceId),

        // Dates
        getStateTimestamp: proposal.account.getStateTimestamp(), // date/time it hit currents state
        votingAt: proposal.account?.votingAt?.toNumber(),
        signingOffAt: proposal.account?.signingOffAt?.toNumber(),
        votingCompletedAt: proposal.account?.votingCompletedAt?.toNumber(),
        draftAt: proposal.account?.draftAt?.toNumber(),
        executingAt: proposal.account?.executingAt?.toNumber(),
      };
    });

    // sorts in most recent first.
    proposals = proposals?.sort(
      (a, b) => b.getStateTimestamp - a.getStateTimestamp
    );

    return proposals;
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
      .addCase(fetchRealmVaults.pending, (state) => {})
      .addCase(fetchRealmVaults.rejected, (state) => {})
      .addCase(fetchRealmVaults.fulfilled, (state, action: any) => {
        state.realmVaults = action.payload;
      });
  },
});

export const { addRealmToWatchlist } = realmSlice.actions;

export default realmSlice.reducer;
