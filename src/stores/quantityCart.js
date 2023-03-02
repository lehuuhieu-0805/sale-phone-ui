import { createSlice } from '@reduxjs/toolkit';

let initialState = 0;

const quantityCart = createSlice({
  name: 'quantityCart',
  initialState,
  reducers: {
    updateQuantityCart: (state, action) => {
      state = action.payload;
      return state;
    },
    removeQuantityCart: (state) => {
      state = initialState;
      return state;
    }
  }
});

const { reducer, actions } = quantityCart;
export const { updateQuantityCart, removeQuantityCart } = actions;
export default reducer;