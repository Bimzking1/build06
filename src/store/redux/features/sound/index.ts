import { createSlice } from '@reduxjs/toolkit';

export interface ParkingStateI {
  soundActive: boolean;
}

const initialState: ParkingStateI = {
  soundActive: true
};

interface DefaultVehiclePayload {
  payload: {
    active: boolean;
  };
}

const soundSlice = createSlice({
  name: 'sound',
  initialState,
  reducers: {
    setSoundActive: (state, { payload }: DefaultVehiclePayload) => {
      state.soundActive = payload.active;
    }
  }
});

export const { setSoundActive } = soundSlice.actions;

export default soundSlice.reducer;
