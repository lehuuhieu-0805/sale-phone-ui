import { configureStore } from '@reduxjs/toolkit';
import quantityCartReducer from './quantityCart';
import userReducer from './userSlice';

const rootReducer = {
  user: userReducer,
  quantityCart: quantityCartReducer
};

const store = configureStore({
  reducer: rootReducer
});

export default store;