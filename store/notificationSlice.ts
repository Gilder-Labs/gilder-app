import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface NotificationState {
  isLoadingNotifications: boolean;
  pushToken: string;
  notificationSettings: any;
}

const initialState: NotificationState = {
  isLoadingNotifications: false,
  notificationSettings: null,
  pushToken: "",
};

// API url: 54.157.218.96:3000

const API_URL = "https://gilderapi.ctrlrlabs.com";

export const fetchNotificationSettings = createAsyncThunk(
  "notifications/fetchNotificationSettings",
  async ({ pushToken }: any) => {
    try {
      console.log("Fetching settings @", pushToken);

      const response = await axios.post(
        `${API_URL}/notifyMe/listSubscriptions`,
        {
          mobileToken: pushToken,
        }
      );

      const notificationArray = response.data;
      let notificationMap = {};

      notificationArray.map((notification: { realm: string; type: string }) => {
        // @ts-ignore
        notificationMap[notification.realm] = notification;
      });

      console.log("FETCH response", response);

      return {
        notificationArray: notificationArray,
        notificationMap: notificationMap,
      };
    } catch (error) {
      console.log("transaction error", error);
    }
  }
);

export const subscribeToNotifications = createAsyncThunk(
  "notifications/subscribeToSettings",
  async ({ pushToken, realmId }: any) => {
    try {
      console.log("subscribing", pushToken);

      const response = await axios.post(`${API_URL}/notifyMe`, {
        type: "newProposals",
        mobileToken: pushToken,
        realm: realmId,
      });

      console.log("SUBSCRIBE response", response);

      return {};
    } catch (error) {
      console.log("transaction error", error);
    }
    return [];
  }
);

export const activitySlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.pushToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationSettings.pending, (state, action) => {
        state.isLoadingNotifications = true;
      })
      .addCase(fetchNotificationSettings.rejected, (state) => {
        state.isLoadingNotifications = false;
      })
      .addCase(fetchNotificationSettings.fulfilled, (state, action: any) => {
        state.isLoadingNotifications = false;
        state.notificationSettings = action.payload.notificationMap;
      });
  },
});

export const { setToken } = activitySlice.actions;

export default activitySlice.reducer;
