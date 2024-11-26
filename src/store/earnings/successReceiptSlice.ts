import { createSlice } from '@reduxjs/toolkit';

interface WithdrawReceipt {
  account_name: string;
  account_number: string;
  created_at: string;
  description: string;
  fee: number;
  id: string;
  nett_amount: number;
  payment_method: string;
  status: string;
  updated_at: string;
  user_id: string;
}

interface SuccessReceiptState {
  withdrawReceipt: WithdrawReceipt;
}

const initialState: SuccessReceiptState = {
  withdrawReceipt: {
    account_name: '',
    account_number: '',
    created_at: '',
    description: '',
    fee: 0,
    id: '',
    nett_amount: 0,
    payment_method: '',
    status: '',
    updated_at: '',
    user_id: ''
  }
};

const successReceiptSlice = createSlice({
  name: 'successReceipt',
  initialState,
  reducers: {
    setWithdrawReceipt(state, action) {
      state.withdrawReceipt = action.payload;
    },
    resetWithdrawReceipt(state) {
      state.withdrawReceipt = initialState.withdrawReceipt;
    }
  }
});

export const { setWithdrawReceipt, resetWithdrawReceipt } =
  successReceiptSlice.actions;

export default successReceiptSlice.reducer;
