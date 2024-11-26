import { createSlice } from '@reduxjs/toolkit';

export const promoCodeSlice = createSlice({
  name: 'promoCode',
  initialState: {},
  reducers: {
    setPromoCodeValidationResult: (state, action) => {
      return {
        ...state,
        validation: action.payload
      };
    }
  }
});

export const { setPromoCodeValidationResult } = promoCodeSlice.actions;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectPromoCodeValidationResult = (state: any) =>
  state.promoCode.validation;

export default promoCodeSlice.reducer;
