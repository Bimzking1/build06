import { createSlice } from '@reduxjs/toolkit';

interface BookingState {
  userName: string;
  userPhone: string;
  userEmail: string;
}

const initialState: BookingState = {
  userName: '',
  userPhone: '',
  userEmail: ''
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setUserName(state, action) {
      state.userName = action.payload;
    },
    setUserPhone(state, action) {
      state.userPhone = action.payload;
    },
    setUserEmail(state, action) {
      state.userEmail = action.payload;
    }
  }
});

export const { setUserName, setUserPhone, setUserEmail } = bookingSlice.actions;

export default bookingSlice.reducer;
