import { type Type_VA } from '@/utils/interfaces/withdraw.interfaces';
import { createSlice } from '@reduxjs/toolkit';

interface WithdrawState {
  accountName: string;
  bankAccount: Type_VA;
  accountNumber: string;
}

const initialState: WithdrawState = {
  accountName: '',
  bankAccount: {
    admin_fee: 0,
    id: '',
    is_active: false,
    is_priority: false,
    is_promo_available: false,
    logo_url: '',
    minimum_withdrawal: 0,
    payment_gateway: '',
    payment_method: '',
    payment_type: '',
    promo_price: 0,
    service_fee: 0
  },
  accountNumber: ''
};

const withdrawSlice = createSlice({
  name: 'withdraw',
  initialState,
  reducers: {
    setAccountName(state, action) {
      state.accountName = action.payload;
    },
    setBankAccount(state, action) {
      state.bankAccount = action.payload;
    },
    setAccountNumber(state, action) {
      state.accountNumber = action.payload;
    }
  }
});

export const { setAccountName, setBankAccount, setAccountNumber } =
  withdrawSlice.actions;

export default withdrawSlice.reducer;
