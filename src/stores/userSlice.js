import { createSlice } from '@reduxjs/toolkit';

let initialState = null;

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    save: (state, action) => {
      state = action.payload;
      return state;
    },
    remove: (state) => {
      state = initialState;
      return state;
    }
  }
});

const { reducer, actions } = user;
export const { save, remove } = actions;
export default reducer;