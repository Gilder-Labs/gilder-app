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
  sendAndConfirmRawTransaction,
} from "@solana/web3.js";
import { withExecuteTransaction } from "@solana/spl-governance";
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
const devNetConnection = new Connection(
  "https://api.devnet.solana.com",
  "recent"
);

export const createProposalAttempt = createAsyncThunk(
  "proposalActions/createProposal",
  async ({ transactions }: any, { getState, dispatch }) => {
    try {
      const privateKey = await SecureStore.getItemAsync("privateKey");
      if (!privateKey) {
        throw Error();
      }
      const walletKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
      // transaction.recentBlockhash = recentBlock.blockhash;

      // transaction.sign(walletKeypair);
      // const response = await sendAndConfirmTransaction(
      //   connection,
      //   transaction,
      //   [walletKeypair]
      // );

      let index = 0;
      // console.log("able to create proposal", transactions);
      for (const tx of transactions) {
        tx.sign(walletKeypair);

        // temp work around to make sure stuff happens sequentially and doesn't throw program errors
        // console.log("tx", tx);
        const response = await sendAndConfirmRawTransaction(
          connection,
          tx.serialize(),
          {
            skipPreflight: true,
          }
        );
        index++;
        dispatch(setProgress(index));
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

// TEMP for demo
export const executeInstructions = createAsyncThunk(
  "proposalActions/executInstructions",
  async (
    {
      proposalInstructions,
      programId,
      programVersion,
      governanceId,
      proposalId,
    }: any,
    { getState, dispatch }
  ) => {
    try {
      const privateKey = await SecureStore.getItemAsync("privateKey");
      const instructions: TransactionInstruction[] = [];

      if (!privateKey) {
        throw Error();
      }
      const walletKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));

      await Promise.all(
        proposalInstructions.map((instruction: any) =>
          // withExecuteTransaction function mutate the given 'instructions' parameter
          withExecuteTransaction(
            instructions,
            new PublicKey(programId),
            programVersion, // program version, hard coded for now
            new PublicKey(governanceId),
            new PublicKey(proposalId),
            instruction.pubkey,
            [instruction.account.getSingleInstruction()]
          )
        )
      );

      // uh don't change this variable name to "tx" or it will break android builds lol.i
      const transaction = new Transaction().add(...instructions);

      transaction.sign(walletKeypair);

      const recentBlock = await connection.getLatestBlockhash();
      transaction.recentBlockhash = recentBlock.blockhash;

      const response = await sendAndConfirmRawTransaction(
        connection,
        transaction.serialize(),
        {
          skipPreflight: true,
        }
      );

      console.log("Successfully created and executed proposal!!!");
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
    setProgress: (state, action) => {
      state.transactionProgress = action.payload;
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
        state.transactionProgress = 0;
      })
      .addCase(executeInstructions.pending, (state, action) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(executeInstructions.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = true;
      })
      .addCase(executeInstructions.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload.error;
        state.transactionProgress = 0;
      });
  },
});

export const { setProgress } = proposalActionsSlice.actions;

export default proposalActionsSlice.reducer;
