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

export const userExtSlice = createSlice({
  name: 'userExt',
  initialState,
  reducers: {
    setLikes: (state, action: PayloadAction<Array<bigint>>) => {
      state.likes = action.payload;
    },
    setEntries: (state, action: PayloadAction<Array<bigint>>) => {
      state.likes = action.payload;
    }
  }
})

export const userExtAction = userExtSlice.actions;

export const selectUserExtState = (state: RootState) => state.userExt;

export default userExtSlice.reducer;


