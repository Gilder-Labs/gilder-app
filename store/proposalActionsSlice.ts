import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./index";
import { createNewProposalTransaction } from "../utils/createProposal";
import bs58 from "bs58";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  PublicKey,
  ConfirmedSignatureInfo,
  Connection,
  LAMPORTS_PER_SOL,
  Keypair,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { RPC_CONNECTION } from "../constants/Solana";

export interface ProposalActionsState {
  isLoading: boolean;
}

const initialState: ProposalActionsState = {
  isLoading: false,
};

let connection = new Connection(RPC_CONNECTION, "confirmed");

export const createProposalAttempt = createAsyncThunk(
  "proposalActions/createProposal",
  async ({ vault, transactionInstructions }: any, { getState }) => {
    try {
      const { realms, wallet, members, treasury } = getState() as RootState;
      const { selectedRealm } = realms;
      const { membersMap } = members;
      const { publicKey } = wallet;

      const { governancesMap } = treasury;

      // todo change to user choice
      const isCommunityVote = false;
      const selectedDelegate = "EVa7c7XBXeRqLnuisfkvpXSw5VtTNVM8MNVJjaSgWm4i";
      const proposalData = {
        name: "test transfer sol",
        description: "test description",
        instrinctions: [],
      };

      console.log("vault", vault);

      const transaction = await createNewProposalTransaction({
        selectedRealm,
        walletAddress: publicKey,
        proposalData,
        membersMap,
        selectedDelegate,
        isCommunityVote,
        vault,
        governance: governancesMap[vault.governanceId],
        transactionInstructions,
      });

      const privateKey = await SecureStore.getItemAsync("privateKey");
      if (!privateKey) {
        throw Error();
      }
      const walletKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));

      transaction.sign(walletKeypair);
      const response = await sendAndConfirmTransaction(
        connection,
        transaction,
        [walletKeypair]
      );

      console.log("Successfully created proposal!!!", response);
      return {};
    } catch (error) {
      console.log("transaction error", error);
    }
  }
);

export const proposalActionsSlice = createSlice({
  name: "proposalActions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProposalAttempt.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(createProposalAttempt.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createProposalAttempt.fulfilled, (state, action: any) => {
        state.isLoading = false;
      });
  },
});

export const {} = proposalActionsSlice.actions;

export default proposalActionsSlice.reducer;
