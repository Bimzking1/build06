// store.js
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook
} from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import successReceiptSlice from '../earnings/successReceiptSlice';
import withdrawSlice from '../earnings/withdrawSlice';
import bookingSlice from '../event/bookingSlice';
import premiumCircleSlice from '../premium-circle/premiumCircleSlice';
import expSlice from './features/exp';
import { promoCodeSlice } from './features/promo-code';
import soundSlice from './features/sound';
import userSlice from './features/user';

const reducers = combineReducers({
  exp: expSlice,
  user: userSlice,
  soundSlice,
  promoCode: promoCodeSlice.reducer,
  withdraw: withdrawSlice,
  successReceipt: successReceiptSlice,
  booking: bookingSlice,
  premiumCircle: premiumCircleSlice
});

const persistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = () =>
  useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
