import { configureStore } from "@reduxjs/toolkit";
import solanaReducer from "./solanaSlice";
import realmReducer from "./realmSlice";

export const store = configureStore({
  reducer: {
    solana: solanaReducer,
    realms: realmReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
