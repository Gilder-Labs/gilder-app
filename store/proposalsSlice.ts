import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PublicKey, ConfirmedSignatureInfo, Connection } from "@solana/web3.js";
import { ProposalState, getAllProposals } from "@solana/spl-governance";
import { RPC_CONNECTION } from "../constants/Solana";

export interface ProposalsState {
  isLoadingProposals: boolean;
  proposals: Array<any>;
  proposalsMap: any;
}

const initialState: ProposalsState = {
  isLoadingProposals: false,
  proposals: [],
  proposalsMap: null,
};

let connection = new Connection(RPC_CONNECTION, "confirmed");

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

    const proposalsMap = {};
    console.log("proposals raw", rawProposals);

    // votingAt, signingOffAt, votingCompletedAt, draftAt, executingAt
    // format(getStateTimestamp * 1000, "LLL cc, yyyy"
    let proposals = rawProposals?.map((proposal: any) => {
      const proposalId = proposal.pubkey.toString();
      let data = {
        governanceId: proposal?.account?.governance.toString(),
        description: proposal?.account?.descriptionLink,
        name: proposal?.account?.name,
        proposalId: proposalId,
        status: ProposalState[proposal?.account?.state],
        isVoteFinalized: proposal.account.isVoteFinalized(),
        isFinalState: proposal.account.isFinalState(),
        getStateSortRank: proposal.account.getStateSortRank(),
        isPreVotingState: proposal.account.isPreVotingState(),
        getYesVoteCount: proposal.account.getYesVoteCount().toString(),
        getNoVoteCount: proposal.account.getNoVoteCount().toString(),
        // Determines whether council or community token is used for votes
        governingTokenMint: proposal.account.governingTokenMint.toString(),
        // Dates
        getStateTimestamp: proposal.account.getStateTimestamp(), // date/time it hit currents state
        votingAt: proposal.account?.votingAt?.toNumber(),
        signingOffAt: proposal.account?.signingOffAt?.toNumber(),
        votingCompletedAt: proposal.account?.votingCompletedAt?.toNumber(),
        draftAt: proposal.account?.draftAt?.toNumber(),
        executingAt: proposal.account?.executingAt?.toNumber(),
      };
      //@ts-ignore
      proposalsMap[proposalId] = data;
      return data;
    });

    // sorts in most recent first.
    proposals = proposals?.sort(
      (a, b) => b.getStateTimestamp - a.getStateTimestamp
    );

    return { proposals: proposals, proposalsMap: proposalsMap };
  }
);

export const proposalsSlice = createSlice({
  name: "proposals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRealmProposals.pending, (state) => {
        state.isLoadingProposals = true;
      })
      .addCase(fetchRealmProposals.rejected, (state) => {
        state.isLoadingProposals = false;
      })
      .addCase(fetchRealmProposals.fulfilled, (state, action: any) => {
        state.isLoadingProposals = false;
        state.proposals = action.payload.proposals;
        state.proposalsMap = action.payload.proposalsMap;
      });
  },
});

export const {} = proposalsSlice.actions;

export default proposalsSlice.reducer;
