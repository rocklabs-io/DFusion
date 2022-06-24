import { Principal } from "@dfinity/principal";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserExt } from "src/canisters/model/dfusion.did";
import { FeatureState } from "src/store/models";
import { RootState } from "src/store/store";


interface TypeUserExt extends UserExt {
  subscribees?: string[];
  subscribeesState?: FeatureState;
  userExtState?: FeatureState;
}

const initialState: TypeUserExt = {
  id: Principal.fromText('aaaaa-aa'),
  bio: [],
  favorites: [],
  name: [],
  likes: [],
  entries: [],
  following: [],
  followers: [],
  subscribees: [],
  subscribeesState: FeatureState.NotStarted,
  userExtState: FeatureState.NotStarted,
}

export const userExtSlice = createSlice({
  name: 'userExt',
  initialState,
  reducers: {
    setAllLikes: (state, action: PayloadAction<Array<bigint>>) => {
      state.likes = action.payload
    },
    setLike: (state, action: PayloadAction<bigint>) => {
      state.likes.push(action.payload)
    },
    setUnlike: (state, action: PayloadAction<bigint>) => {
      state.likes = state.likes.filter(
        value => value !== action.payload
      )
    },
    setAll: (state, action: PayloadAction<TypeUserExt>) => {
      return {...state, ...action.payload}
    },
    setFollow: (state, action: PayloadAction<Principal>) => {
      state.following.push(action.payload)
    },
    setUnfollow: (state, action: PayloadAction<Principal>) => {
      state.following = state.following.filter(
        value => value !== action.payload
      )
    },
    setEntries: (state, action: PayloadAction<Array<bigint>>) => {
      state.likes = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload === '' ? [] : [action.payload];
    },
    setBio: (state, action: PayloadAction<string>) => {
      state.bio = action.payload === '' ? [] : [action.payload];
    },
    setSubscribees: (state, action: PayloadAction<Array<string>>) => {
      state.subscribees = action.payload;
    }, 
    setUserExtState: (state, action: PayloadAction<FeatureState>) => {
      state.userExtState = action.payload;
    },
    setSubscribeesState: (state, action: PayloadAction<FeatureState>) => {
      state.subscribeesState = action.payload;
    }
  }
})

export const userExtAction = userExtSlice.actions;

export const selectUserExtState = (state: RootState) => state.userExt;

export default userExtSlice.reducer;


