import { configureStore, combineReducers } from "@reduxjs/toolkit";
import solanaReducer from "./solanaSlice";
import realmReducer from "./realmSlice";
import walletReducer from "./walletSlice";
import treasuryReducer from "./treasurySlice";
import activityReducer from "./activitySlice";
import proposalsReducer from "./proposalsSlice";
import memberReducer from "./memberSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2, // merge old and new stuff. Will need to blacklist to remove old data.
  whitelist: ["solana"], // empty reducer for now
};

const realmsPersistConfig = {
  key: "realms",
  storage: AsyncStorage,
  whiteList: ["selectedRealm", "realmWatchlist", "userInfo"],
};

const walletPersistConfig = {
  key: "wallet",
  storage: AsyncStorage,
  whiteList: ["publicKey", "privateKey"],
};

const rootReducer = combineReducers({
  realms: persistReducer(realmsPersistConfig, realmReducer),
  solana: solanaReducer,
  wallet: persistReducer(walletPersistConfig, walletReducer),
  treasury: treasuryReducer,
  activities: activityReducer,
  proposals: proposalsReducer,
  members: memberReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
