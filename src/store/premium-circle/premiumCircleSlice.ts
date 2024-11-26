import { createSlice } from '@reduxjs/toolkit';

interface PremiumCircleState {
  premiumCircleFee: number;
  premiumCircleMonth: string;
}

const initialState: PremiumCircleState = {
  premiumCircleFee: 0,
  premiumCircleMonth: ''
};

const premiumCircleSlice = createSlice({
  name: 'premiumCircle',
  initialState,
  reducers: {
    setPrice(state, action) {
      state.premiumCircleFee = action.payload;
    },
    setMonth(state, action) {
      state.premiumCircleMonth = action.payload;
    }
  }
});

export const { setPrice, setMonth } = premiumCircleSlice.actions;

export default premiumCircleSlice.reducer;
