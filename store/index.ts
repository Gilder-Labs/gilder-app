import { configureStore, combineReducers } from "@reduxjs/toolkit";
import solanaReducer from "./solanaSlice";
import realmReducer from "./realmSlice";
import walletReducer from "./walletSlice";
import treasuryReducer from "./treasurySlice";
import activityReducer from "./activitySlice";
import proposalsReducer from "./proposalsSlice";
import memberReducer from "./memberSlice";
import notificationReducer from "./notificationSlice";
import utilityReducer from "./utilitySlice";

const rootReducer = combineReducers({
  realms: realmReducer,
  solana: solanaReducer,
  wallet: walletReducer,
  treasury: treasuryReducer,
  activities: activityReducer,
  proposals: proposalsReducer,
  members: memberReducer,
  notifications: notificationReducer,
  utility: utilityReducer,
});

// const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
