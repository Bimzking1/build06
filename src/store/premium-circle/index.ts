import { configureStore } from '@reduxjs/toolkit';
import premiumCircleReducer from './premiumCircleSlice';

const store = configureStore({
  reducer: {
    premiumCircle: premiumCircleReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
