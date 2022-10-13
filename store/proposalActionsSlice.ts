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
  transactionProgress: number;
  error: boolean;
}

const initialState: ProposalActionsState = {
  isLoading: false,
  transactionProgress: 0,
  error: false,
};

let connection = new Connection(RPC_CONNECTION, "recent");

export const createProposalAttempt = createAsyncThunk(
  "proposalActions/createProposal",
  async (
    {
      vault,
      transactionInstructions,
      proposalTitle,
      proposalDescription,
      isCommunityVote,
      selectedDelegate,
      isTokenTransfer,
    }: any,
    { getState, dispatch }
  ) => {
    try {
      const { realms, wallet, members, treasury } = getState() as RootState;
      const { selectedRealm } = realms;
      const { membersMap } = members;
      const { publicKey } = wallet;

      const { governancesMap } = treasury;

      const proposalData = {
        name: proposalTitle,
        description: proposalDescription,
      };

      const transactions = await createNewProposalTransaction({
        selectedRealm,
        walletAddress: publicKey,
        proposalData,
        membersMap,
        selectedDelegate,
        isCommunityVote,
        vault,
        governance: governancesMap[vault.governanceId],
        transactionInstructions,
        isTokenTransfer,
      });

      const privateKey = await SecureStore.getItemAsync("privateKey");
      if (!privateKey) {
        throw Error();
      }
      const walletKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
      const recentBlock = await connection.getLatestBlockhash();
      // transaction.recentBlockhash = recentBlock.blockhash;

      // transaction.sign(walletKeypair);
      // const response = await sendAndConfirmTransaction(
      //   connection,
      //   transaction,
      //   [walletKeypair]
      // );

      let index = 0;
      console.log("able to create proposal", transactions);
      for (const tx of transactions) {
        const recentBlock = await connection.getLatestBlockhash();
        tx.recentBlockhash = recentBlock.blockhash;
        tx.sign(walletKeypair);

        // temp work around to make sure stuff happens sequentially and doesn't throw program errors
        console.log("tx", tx);
        const response = await sendAndConfirmTransaction(connection, tx, [
          walletKeypair,
        ]);
        index++;
        // setTimeout(() => {
        //   console.log("Delayed for 1 second.");
        // }, 1000);
      }

      console.log("Successfully created proposal!!!");
      return { error: false };
    } catch (error) {
      console.log("transaction error", error);
      return { error: true };
    }
  }
);

export const proposalActionsSlice = createSlice({
  name: "proposalActions",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProposalAttempt.pending, (state, action) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(createProposalAttempt.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = true;
      })
      .addCase(createProposalAttempt.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload.error;
      });
  },
});

export const {} = proposalActionsSlice.actions;

export default proposalActionsSlice.reducer;
