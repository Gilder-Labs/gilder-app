import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { NOTIFICATION_API_URL } from "../constants/Notifications";

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

export const fetchNotificationSettings = createAsyncThunk(
  "notifications/fetchNotificationSettings",
  async ({ pushToken }: any) => {
    try {
      const response = await axios.post(
        `${NOTIFICATION_API_URL}/api/v1/notifications/listSubscriptions`,
        {
          mobileToken: pushToken,
        }
      );

      console.log(JSON.stringify(response.data, undefined, 4));

      const notificationArray = response.data;
      let notificationMap = {};

      notificationArray.map(
        (notification: { realmPk: string; type: string }) => {
          // @ts-ignore
          notificationMap[notification.realmPk] = notification;
        }
      );

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
  async ({ pushToken, realmId, isSubscribing }: any) => {
    try {
      const path = isSubscribing ? "subscribe" : "unsubscribe";

      const response = await axios.post(
        `${NOTIFICATION_API_URL}/api/v1/notifications/${path}`,
        {
          type: "newProposals",
          mobileToken: pushToken,
          realmPk: realmId,
        }
      );

      console.log("SUBSCRIBE response", response.status);

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
        state.notificationSettings = action.payload?.notificationMap;
      });
  },
});

export const { setToken } = activitySlice.actions;

export default activitySlice.reducer;
