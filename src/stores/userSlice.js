import { createSlice } from '@reduxjs/toolkit';

let initialState = null;

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveUser: (state, action) => {
      state = action.payload;
      return state;
    },
    removeUser: (state) => {
      state = initialState;
      return state;
    }
  }
});

const { reducer, actions } = user;
export const { saveUser, removeUser } = actions;
export default reducer;