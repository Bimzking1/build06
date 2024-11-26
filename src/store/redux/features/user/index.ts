// userSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = `${
  process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
}/user/v1/`;

interface IForm {
  name: string;
  seedsTag: string;
  email: string;
  avatar: string;
  bio: string;
  birthDate: string;
  phone: string;
}
// Create Async Thunk for fetching user data
export const fetchUserData = createAsyncThunk(
  'users/fetchUserData',
  async () => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(API_BASE_URL, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token ?? ''}`
      }
    });
    return response.data;
  }
);

// Create Async Thunk for updating user data
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (userData: IForm) => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.patch(API_BASE_URL, userData, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token ?? ''}`
      }
    });
    return response;
  }
);

// Create Async Thunk for deleting a user
export const deleteUser = createAsyncThunk('users/deleteUser', async () => {
  const token = localStorage.getItem('accessToken');
  const response = await axios.delete(API_BASE_URL, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token ?? ''}`
    }
  });
  return response;
});

interface IClaims {
  sub: string;
  phoneNumber: string;
  email: string;
  birthDate: string;
  name: string;
  seedsTag: string;
  refCode: string;
  avatar: string;
  role: string;
  preferredLanguage: string;
  preferredCurrency: string;
  iss: string;
  aud: string[];
  exp: number;
  nbf: number;
  iat: number;
}

interface IUserData {
  id: string;
  phoneNumber: string;
  email: string;
  birthDate: string;
  name: string;
  seedsTag: string;
  refCode: string;
  avatar: string;
  preferredLanguage: string;
  preferredCurrency: string;
  bio: string;
  pin: boolean;
  followers: number;
  following: number;
  posts: number;
  region: string;
  verified: boolean;
  email_verification: boolean;
  badge: string;
  claims: IClaims;
  refCodeUsage: number;
  label: string;
  currentExp: number;
  isPasswordExists: boolean;
}

interface IUserState {
  dataUser: IUserData;
  status: string;
  error: string | undefined;
}
const initialState: IUserState = {
  dataUser: {
    id: '',
    phoneNumber: '',
    email: '',
    birthDate: '',
    name: '',
    seedsTag: '',
    refCode: '',
    avatar: '',
    preferredLanguage: '',
    preferredCurrency: '',
    bio: '',
    pin: false,
    followers: 0,
    following: 0,
    posts: 0,
    region: '',
    verified: false,
    email_verification: false,
    badge: '',
    claims: {
      sub: '',
      phoneNumber: '',
      email: '',
      birthDate: '',
      name: '',
      seedsTag: '',
      refCode: '',
      avatar: '',
      role: '',
      preferredLanguage: '',
      preferredCurrency: '',
      iss: '',
      aud: [''],
      exp: 0,
      nbf: 0,
      iat: 0
    },
    refCodeUsage: 0,
    label: '',
    currentExp: 0,
    isPasswordExists: false
  },
  status: 'idle',
  error: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: { resetUser: () => initialState },
  extraReducers: builder => {
    // Handle fetching user data
    builder.addCase(fetchUserData.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.dataUser = action.payload;
    });
    builder.addCase(fetchUserData.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });

    // Handle adding, updating, and deleting user data

    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
    });
  }
});

export const { resetUser } = userSlice.actions;

export default userSlice.reducer;
