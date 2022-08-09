import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./index";

export interface ChatState {
  isAuthenticating: boolean;
  chatUserToken: string;
}

const initialState: ChatState = {
  isAuthenticating: false,
  chatUserToken: "",
};

const API_URL = "https://gilderapi.ctrlrlabs.com";

export const fetchChatUserToken = createAsyncThunk(
  "chat/fetchJWT",
  async ({ publicKey, signedMessage }: any, { getState }) => {
    const { realms } = getState() as RootState;
    const { selectedRealm } = realms;

    try {
      const response = await axios.post(`${API_URL}/authenticate`, {
        pubKey: publicKey,
        message: signedMessage,
        realm: {
          governanceId: selectedRealm?.governanceId,
          pubKey: selectedRealm?.pubKey,
        },
      });

      console.log("RESPONSE IN REDUX", response);
      return {
        chatUserToken: response?.data?.streamToken,
      };
    } catch (error) {
      console.log("transaction error", error);
    }
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setToken: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatUserToken.pending, (state, action) => {
        state.isAuthenticating = true;
      })
      .addCase(fetchChatUserToken.rejected, (state) => {
        state.isAuthenticating = false;
      })
      .addCase(fetchChatUserToken.fulfilled, (state, action: any) => {
        state.isAuthenticating = true;
        state.chatUserToken = action.payload.chatUserToken;
      });
  },
});

export const {} = chatSlice.actions;

export default chatSlice.reducer;
