import { configureStore } from '@reduxjs/toolkit';
import successReceiptReducer from './successReceiptSlice';
import withdrawReducer from './withdrawSlice';

const store = configureStore({
  reducer: {
    withdraw: withdrawReducer,
    successReceipt: successReceiptReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
