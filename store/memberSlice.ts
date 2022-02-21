import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PublicKey, ConfirmedSignatureInfo } from "@solana/web3.js";
import {
  getRealms,
  getRealm,
  getAllTokenOwnerRecords, // returns all members of a realm

  // TODO:
  getVoteRecordsByVoter, // get all votes a member did
  getGovernanceChatMessagesByVoter,
  GOVERNANCE_CHAT_PROGRAM_ID,
} from "@solana/spl-governance";

import * as web3 from "@solana/web3.js";
import { REALM_GOVERNANCE_PKEY, RPC_CONNECTION } from "../constants/Solana";

export interface realmState {
  members: Array<Member>;
  isLoadingMembers: boolean;
  memberChat: Array<ChatMessage>;
  isLoadingChat: boolean;
}

const initialState: realmState = {
  members: [],
  isLoadingMembers: false,
  memberChat: [],
  isLoadingChat: false,
};

interface realmType {
  name: string;
  pubKey: string;
  communityMint: string;
  councilMint: string;
  governanceId: string;
}

let connection = new web3.Connection(RPC_CONNECTION, "confirmed");

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

    console.log("rawMembers", rawTokenOwnerRecords);

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

export const fetchMemberChat = createAsyncThunk(
  "realms/fetchMemberChat",
  async (member: Member) => {
    console.log("fetching member chat");

    let rawChatMesssages;

    try {
      rawChatMesssages = await getGovernanceChatMessagesByVoter(
        connection,
        GOVERNANCE_CHAT_PROGRAM_ID,
        new PublicKey(member.governingTokenOwner)
      );
      console.log("raw messages", rawChatMesssages);
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

    return [];
  }
);

export const memberSlice = createSlice({
  name: "realms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRealmMembers.pending, (state) => {
        state.isLoadingMembers = true;
      })
      .addCase(fetchRealmMembers.rejected, (state) => {
        state.isLoadingMembers = false;
      })
      .addCase(fetchRealmMembers.fulfilled, (state, action: any) => {
        state.isLoadingMembers = false;

        state.members = action.payload;
      })
      .addCase(fetchMemberChat.pending, (state) => {
        state.isLoadingChat = true;
      })
      .addCase(fetchMemberChat.rejected, (state) => {
        state.isLoadingChat = false;
      })
      .addCase(fetchMemberChat.fulfilled, (state, action: any) => {
        state.isLoadingChat = false;
        state.memberChat = action.payload;
      });
  },
});

export const {} = memberSlice.actions;

export default memberSlice.reducer;
