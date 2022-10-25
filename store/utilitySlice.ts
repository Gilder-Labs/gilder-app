import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UtilityState {
  isShowingToast: boolean;
  hasCompletedOnboarding: boolean;
  isFetchingOnboarding: boolean;
  isOnDevnet: boolean;
}

const initialState: UtilityState = {
  isShowingToast: false,
  hasCompletedOnboarding: false,
  isFetchingOnboarding: false,
  isOnDevnet: false,
};

export const fetchOnboarding = createAsyncThunk(
  "utility/fetchOnboarding",
  async () => {
    try {
      const hasCompletedOnboarding = await AsyncStorage.getItem(
        "@hasCompletedOnboarding"
      );
      return hasCompletedOnboarding === "true" || false;
    } catch (e) {
      return false;
    }
  }
);

export const utilitySlice = createSlice({
  name: "utility",
  initialState,
  reducers: {
    setShowToast: (state, action) => {
      state.isShowingToast = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOnboarding.pending, (state) => {
        state.isFetchingOnboarding = true;
      })
      .addCase(fetchOnboarding.rejected, (state) => {
        state.isFetchingOnboarding = false;
      })
      .addCase(fetchOnboarding.fulfilled, (state, action: any) => {
        state.isFetchingOnboarding = false;
        state.hasCompletedOnboarding = action.payload;
      });
  },
});

export const { setShowToast } = utilitySlice.actions;

export default utilitySlice.reducer;
