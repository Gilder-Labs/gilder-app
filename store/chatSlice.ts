import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./index";

export interface ChatState {
  isAuthenticating: boolean;
  chatUserToken: string;
  selectedChannelId: string;
}

const initialState: ChatState = {
  isAuthenticating: false,
  chatUserToken: "",
  selectedChannelId: "",
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
    setChannelId: (state, action) => {
      state.selectedChannelId = action.payload.channelId;
    },
    disconnectChat: (state, action) => {
      state.chatUserToken = "";
      state.selectedChannelId = "";
    },
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
        state.isAuthenticating = false;
        state.chatUserToken = action.payload.chatUserToken;
      });
  },
});

export const { setChannelId, disconnectChat } = chatSlice.actions;

export default chatSlice.reducer;
