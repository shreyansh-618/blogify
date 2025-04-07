import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./slices/postsSlice";
import categoriesReducer from "./slices/categoriesSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    categories: categoriesReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["posts/createPost/fulfilled"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: [],
      },
    }),
});
