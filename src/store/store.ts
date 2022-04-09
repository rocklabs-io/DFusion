import { configureStore } from '@reduxjs/toolkit';
import plugReducer from 'src/store/features/plug/plug-slice';
import userExtReducer from 'src/store/features/userExt/userExt-slice';

// define view reducers and activity reducers here
export const store = configureStore({
  reducer: {
    plug: plugReducer,
    userExt: userExtReducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
