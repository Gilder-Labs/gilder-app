import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PublicKey, ConfirmedSignatureInfo, Connection } from "@solana/web3.js";
import {
  ProposalState,
  getAllProposals,
  getGovernanceChatMessages,
  GOVERNANCE_CHAT_PROGRAM_ID,
  ProposalTransaction,
  getGovernanceAccounts,
  pubkeyFilter,
} from "@solana/spl-governance";
import { RPC_CONNECTION, INDEX_RPC_CONNECTION } from "../constants/Solana";
import { getVoteRecords } from "../utils/gov-ui-functions/getVoteRecords";
import { RootState } from "./index";

export interface ProposalsState {
  isLoadingProposals: boolean;
  proposals: Array<any>;
  proposalsMap: any;
  chatMessages: Array<ChatMessage>;
  isLoadingChatMessages: boolean;
  isRefreshingProposals: boolean;
  isLoadingVotes: boolean;
  isLoadingInstructions: boolean;
  votes: Array<any>;
  walletToVoteMap: any;
  proposalInstructions: any;
}

const initialState: ProposalsState = {
  isLoadingProposals: false,
  proposals: [],
  proposalsMap: null,
  chatMessages: [],
  isLoadingChatMessages: false,
  isLoadingVotes: false,
  isLoadingInstructions: false,
  isRefreshingProposals: false,
  votes: [],
  walletToVoteMap: {},
  proposalInstructions: null,
};

let connection = new Connection(RPC_CONNECTION, "confirmed");

export const fetchRealmProposals = createAsyncThunk(
  "realms/fetchRealmProposals",
  async ({ realm, isRefreshing }: any) => {
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
      const proposalId = proposal.pubkey.toBase58();
      let data = {
        governanceId: proposal?.account?.governance.toBase58(),
        description: proposal?.account?.descriptionLink,
        name: proposal?.account?.name,
        programId: proposal.owner.toBase58(),
        proposalId: proposalId,
        status: ProposalState[proposal?.account?.state],
        isVoteFinalized: proposal.account.isVoteFinalized(),
        isFinalState: proposal.account.isFinalState(),
        getStateSortRank: proposal.account.getStateSortRank(),
        isPreVotingState: proposal.account.isPreVotingState(),
        getYesVoteCount: proposal.account.getYesVoteCount().toString(),
        getNoVoteCount: proposal.account.getNoVoteCount().toString(),
        tokenOwnerRecord: proposal.account.tokenOwnerRecord.toBase58(),
        // Determines whether council or community token is used for votes
        governingTokenMint: proposal.account.governingTokenMint.toBase58(),
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

    return {
      proposals: proposals,
      proposalsMap: proposalsMap,
      isRefreshing: isRefreshing,
    };
  }
);

export const fetchProposalVotes = createAsyncThunk(
  "realms/fetchProposalVotes",
  async (proposalId: string, { getState }) => {
    let rawVotes;
    try {
      const { realms } = getState() as RootState;
      const { selectedRealm } = realms;

      rawVotes = await getGovernanceChatMessages(
        connection,
        GOVERNANCE_CHAT_PROGRAM_ID,
        new PublicKey(proposalId)
      );
      rawVotes = await getVoteRecords({
        connection: connection,
        programId: new PublicKey(selectedRealm?.governanceId),
        proposalPk: new PublicKey(proposalId),
      });

      let walletIdToVoteMap = {};

      if (rawVotes && rawVotes.value) {
        let parsedVoteRecords = rawVotes.value.map((vote) => {
          const walletId = vote?.account?.governingTokenOwner?.toBase58();
          const voteData = {
            walletId: vote?.account?.governingTokenOwner?.toBase58(),
            proposalId: vote?.account?.proposal?.toBase58(),
            voteWeightNo: vote?.account?.getNoVoteWeight()?.toString(),
            voteWeightYes: vote?.account?.getYesVoteWeight()?.toString(),
          };

          // @ts-ignore
          walletIdToVoteMap[walletId] = voteData;

          return voteData;
        });

        return { votes: parsedVoteRecords, walletIdToVoteMap };
      }
      return [];
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const fetchProposalInstructions = createAsyncThunk(
  "realms/fetchProposalInstructions",
  async ({ proposalId, programId }: any) => {
    try {
      const instructions = await getGovernanceAccounts(
        connection,
        new PublicKey(programId),
        ProposalTransaction,
        [pubkeyFilter(1, new PublicKey(proposalId))!]
      );

      return instructions;
    } catch (error) {
      console.log("error", error);
    }
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
          replyTo: message.account.replyTo?.toBase58() || null,
          proposalId: message.account.proposal.toBase58(),
          body: message.account.body.value,
          author: message.account.author.toBase58(),
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
      .addCase(fetchRealmProposals.pending, (state, action) => {
        if (action?.meta?.arg?.isRefreshing) {
          state.isRefreshingProposals = true;
        } else {
          state.isLoadingProposals = true;
        }
      })
      .addCase(fetchRealmProposals.rejected, (state) => {
        state.isLoadingProposals = false;
      })
      .addCase(fetchRealmProposals.fulfilled, (state, action: any) => {
        state.isLoadingProposals = false;
        state.isRefreshingProposals = false;
        state.proposals = action.payload?.proposals;
        state.proposalsMap = action.payload?.proposalsMap;
      })
      .addCase(fetchProposalChat.pending, (state) => {
        state.isLoadingChatMessages = true;
        state.chatMessages = [];
      })
      .addCase(fetchProposalChat.rejected, (state) => {
        state.isLoadingChatMessages = false;
      })
      .addCase(fetchProposalChat.fulfilled, (state, action: any) => {
        state.isLoadingChatMessages = false;
        state.chatMessages = action?.payload;
      })
      .addCase(fetchProposalInstructions.pending, (state) => {
        state.isLoadingInstructions = true;
        state.votes = [];
      })
      .addCase(fetchProposalInstructions.rejected, (state) => {
        state.isLoadingInstructions = false;
      })
      .addCase(fetchProposalInstructions.fulfilled, (state, action: any) => {
        state.isLoadingInstructions = false;
        state.votes = action.payload?.votes;
        state.proposalInstructions = action.payload;
      })
      .addCase(fetchProposalVotes.pending, (state) => {
        state.isLoadingVotes = true;
        state.votes = [];
      })
      .addCase(fetchProposalVotes.rejected, (state) => {
        state.isLoadingVotes = false;
      })
      .addCase(fetchProposalVotes.fulfilled, (state, action: any) => {
        state.isLoadingVotes = false;
        state.votes = action.payload?.votes;
        state.walletToVoteMap = action.payload?.walletIdToVoteMap;
      });
  },
});

export const {} = proposalsSlice.actions;

export default proposalsSlice.reducer;
