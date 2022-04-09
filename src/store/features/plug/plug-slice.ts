import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from 'src/store';
import { FeatureState } from 'src/store';

// Define a type for the slice state
interface PlugState {
  isConnected: boolean;
  principalId?: string;
  state: FeatureState;
  reverseName: string;
}

// Define the initial state using that type
const initialState: PlugState = {
  isConnected: false,
  principalId: undefined,
  state: 'not-started' as FeatureState,
  reverseName: ''
};

export const plugSlice = createSlice({
  name: 'plug',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setIsConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      if (!action.payload) {
        state.principalId = undefined;
        state.reverseName = '';
      }
    },
    setPrincipalId: (state, action: PayloadAction<string>) => {
      state.principalId = action.payload;
    },
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
    setReverseName: (state, action: PayloadAction<string>) => {
      state.reverseName = action.payload;
    },
  },
});

export const plugActions = plugSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPlugState = (state: RootState) => state.plug;

export default plugSlice.reducer;
