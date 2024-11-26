import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = `${
  process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
}/earn-exp/v1/`;

export const fetchExpData = createAsyncThunk('exp/fetchExpData', async () => {
  const token = localStorage.getItem('accessToken');
  const response = await axios.get(`${API_BASE_URL}tiers`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token ?? ''}`
    }
  });
  return response.data;
});

interface IReward {
  name: string;
  description: string;
}

interface ITierList {
  image: string;
  name: string;
  rewards: IReward[];
  exp: number;
}

interface IExpData {
  currentExp: number;
  currentTier: string;
  nextExp: number;
  expExpiration: string;
  tierList: ITierList[];
}

interface IExpState {
  dataExp: IExpData;
  status: string;
  error: string | undefined;
}
const initialState: IExpState = {
  dataExp: {
    currentExp: 0,
    currentTier: '',
    nextExp: 0,
    expExpiration: '',
    tierList: [
      {
        image: 'https://dev-assets.seeds.finance/svg-files/seeds.svg',
        name: 'Seeds',
        rewards: [],
        exp: 0
      },
      {
        image: 'https://dev-assets.seeds.finance/svg-files/sprout.svg',
        name: 'Sprout',
        rewards: [
          {
            name: 'Create 1 Circle',
            description: 'Rewards for entering Sprout stage'
          }
        ],
        exp: 200
      },
      {
        image: 'https://dev-assets.seeds.finance/svg-files/seedling.svg',
        name: 'Seedling',
        rewards: [
          {
            name: 'Create 2 Circle',
            description: 'Rewards for entering Seedling stage'
          }
        ],
        exp: 300
      },
      {
        image: 'https://dev-assets.seeds.finance/svg-files/sapling.svg',
        name: 'Sapling',
        rewards: [
          {
            name: 'Create 3 Circle',
            description: 'Rewards for entering Sapling stage'
          }
        ],
        exp: 500
      },
      {
        image: 'https://dev-assets.seeds.finance/svg-files/tree.svg',
        name: 'Tree',
        rewards: [
          {
            name: 'Create a Play Arena',
            description: 'Rewards for entering Tree stage'
          }
        ],
        exp: 1000
      }
    ]
  },
  status: 'idle',
  error: ''
};

const expSlice = createSlice({
  name: 'exp',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchExpData.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(fetchExpData.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.dataExp = action.payload;
    });
    builder.addCase(fetchExpData.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  }
});

export default expSlice.reducer;
