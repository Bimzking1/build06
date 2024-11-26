import baseAxios from '@/utils/common/axios';
import { isUndefindOrNull } from '@/utils/common/utils';
import {
  type AssetActiveBattleParams,
  type ICreateOrderBattle,
  type MyRankParamsI,
  type TeamBattleListParams
} from '@/utils/interfaces/team-battle.interface';
import { toast } from 'react-toastify';

export interface BattleParticipantsI {
  page: number;
  limit: number;
}

const teamBattleService = baseAxios(
  `${
    process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
  }/battle/v1`
);

export const getBattleList = async (
  params: TeamBattleListParams
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await teamBattleService.get(`/list`, {
      params,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return response;
  } catch (error: any) {
    toast.error(error.message, { type: 'error' });
  }
};

export const getBattleDetail = async (id: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await teamBattleService.get(`/${id}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return response;
  } catch (error: any) {
    toast.error(error.message, { type: 'error' });
  }
};

export const joinBattle = async (
  battleId: string,
  groupId?: string
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await teamBattleService.post(
      `/join`,
      {
        battle_id: battleId,
        group_id: groupId
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    );
    return response;
  } catch (error: any) {
    toast.error(error.response.data.message, {
      type: 'error'
    });
  }
};

export const getGroupBattle = async (
  battleId: string,
  invitationCode: string
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await teamBattleService.get(`/${battleId}/groups`, {
      params: {
        invitation_code: invitationCode
      },
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return response;
  } catch (error) {
    await Promise.reject(error);
  }
};

export const getBattleBalance = async (
  id: string,
  params: { currency: string }
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    return await teamBattleService(`/${id}/balance`, {
      params,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    await Promise.resolve();
  }
};

export const getBattlePortfolio = async (
  id: string,
  currency: string
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    return await teamBattleService(`/${id}/portfolio-summary`, {
      params: {
        currency
      },
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    await Promise.resolve();
  }
};

export const getBattleArena = async (id: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    return await teamBattleService(`/${id}/arena`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    await Promise.resolve();
  }
};

export const getBattleAssets = async (
  id: string,
  assetId: string
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    return await teamBattleService(`/${id}/assets/${assetId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    await Promise.resolve();
  }
};

export const getBattleHistoryTransaction = async (
  id: string,
  params: { limit: number; page: number; currency: string; stage: string }
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    return await teamBattleService(`/${id}/history`, {
      params,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    await Promise.reject(error);
  }
};

export const createOrderBattle = async (
  body: ICreateOrderBattle,
  id: string
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }
    if (
      isUndefindOrNull(body.amount) ||
      isUndefindOrNull(body.asset_id) ||
      isUndefindOrNull(body.type)
    ) {
      return await Promise.resolve(null);
    }

    const response = await teamBattleService.post(`/${id}/order/create`, body, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getBattleParticipants = async (
  battleId: string,
  params: BattleParticipantsI
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    return await teamBattleService.get(`${battleId}/participants`, {
      params,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    await Promise.reject(error);
  }
};

export const getMyRankBattle = async (
  id: string,
  params: MyRankParamsI
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    return await teamBattleService(`/${id}/my-rank`, {
      params,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    await Promise.resolve();
  }
};

export const getBattleLeaderboard = async (
  battleId: string,
  stage: string,
  params?: { page: number; limit: number }
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await teamBattleService.get(
      `/${battleId}/leaderboard/${stage.toUpperCase()}`,
      {
        params,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    );
    return response;
  } catch (error: any) {
    toast.error(error.message, { type: 'error' });
  }
};

export const getActiveAssetBattle = async (
  id: string,
  params: AssetActiveBattleParams
): Promise<any> => {
  const timeoutDuration = 100000;

  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.reject(new Error('Access token not found'));
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutDuration);

    const response = await teamBattleService(`/${id}/assets/active`, {
      params,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      },
      signal
    });

    clearTimeout(timeoutId);

    return response;
  } catch (error) {
    await Promise.reject(error);
  }
};

export const getBattleDataPerStage = async (
  id: string,
  params: MyRankParamsI
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    return await teamBattleService(`/${id}`, {
      params,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    await Promise.resolve();
  }
};