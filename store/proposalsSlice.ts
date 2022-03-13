import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PublicKey, ConfirmedSignatureInfo, Connection } from "@solana/web3.js";
import {
  ProposalState,
  getAllProposals,
  getGovernanceChatMessages,
  GOVERNANCE_CHAT_PROGRAM_ID,
} from "@solana/spl-governance";
import { RPC_CONNECTION } from "../constants/Solana";

export interface ProposalsState {
  isLoadingProposals: boolean;
  proposals: Array<any>;
  proposalsMap: any;
  chatMessages: Array<ChatMessage>;
  isLoadingChatMessages: boolean;
}

const initialState: ProposalsState = {
  isLoadingProposals: false,
  proposals: [],
  proposalsMap: null,
  chatMessages: [],
  isLoadingChatMessages: false,
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

export const fetchProposalChat = createAsyncThunk(
  "realms/fetchProposalChat",
  async (proposalId: string) => {
    let rawChatMesssages;

    try {
      rawChatMesssages = await getGovernanceChatMessages(
        connection,
        GOVERNANCE_CHAT_PROGRAM_ID,
        new PublicKey(proposalId)
      );
      let parsedChatMessages = rawChatMesssages.map((message) => {
        return {
          postedAt: message.account.postedAt.toNumber(),
          replyTo: message.account.replyTo?.toString() || null,
          proposalId: message.account.proposal.toString(),
          body: message.account.body.value,
          author: message.account.author.toString(),
          isReply: message.account.body.isReply,
          isReaction: message.account.body.type === 0,
        };
      });

      parsedChatMessages = parsedChatMessages?.sort(
        (a, b) => b.postedAt - a.postedAt
      );

      return parsedChatMessages;
    } catch (error) {
      console.log("error", error);
    }
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
      })
      .addCase(fetchProposalChat.pending, (state) => {
        state.isLoadingChatMessages = true;
      })
      .addCase(fetchProposalChat.rejected, (state) => {
        state.isLoadingChatMessages = false;
      })
      .addCase(fetchProposalChat.fulfilled, (state, action: any) => {
        state.isLoadingChatMessages = false;
        state.chatMessages = action.payload;
      });
  },
});

export const {} = proposalsSlice.actions;

export default proposalsSlice.reducer;
