import { Principal } from "@dfinity/principal";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserExt } from "src/canisters/model/dfusiondid";
import { RootState } from "src/store/store";

const initialState: UserExt = {
  id: Principal.fromText('aaaaa-aa'),
  likes: [],
  entries: [],
  following: [],
  followers: [],
}

// interface likeOperate {
//   entryId: bigint, 
//   like: boolean
// }

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
      state.likes.filter(
        (value, index) =>
          value !== action.payload
      )
    },
    setEntries: (state, action: PayloadAction<Array<bigint>>) => {
      state.likes = action.payload;
    }
  }
})

export const userExtAction = userExtSlice.actions;

export const selectUserExtState = (state: RootState) => state.userExt;

export default userExtSlice.reducer;


