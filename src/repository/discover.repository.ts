import baseAxios from '@/utils/common/axios';
import { isEmptyString, isUndefindOrNull } from '@/utils/common/utils';

export interface EventListParams {
  page: number;
  limit: number;
  search?: string | null;
  section?: string | null;
  year?: number | null;
}

const discoverService = baseAxios(
  `${
    process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
  }/discover/v1/`
);

export const getBanner = async (params: any): Promise<any> => {
  try {
    if (isUndefindOrNull(params) || isEmptyString(params)) {
      return await Promise.resolve(null);
    }

    return await discoverService.get(`/banner`, {
      params
    });
  } catch (error: any) {
    return error.response;
  }
};
export const getBannerById = async (id: string): Promise<any> => {
  try {
    if (isUndefindOrNull(id) || isEmptyString(id)) {
      return null;
    }

    const response = await discoverService.get(`/banner/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching banner by ID:', error);
    return null;
  }
};

export const getEventList = async (params: EventListParams): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    return await discoverService.get(`/event/list`, {
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

export const likeEvent = async (eventId: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    return await discoverService.post(
      `/event/subscription`,
      {
        event_id: eventId
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    );
  } catch (error) {
    await Promise.reject(error);
  }
};

export const getEventById = async (id: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    return await discoverService.get(`/event/${id}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    await Promise.reject(error);
  }
};

export const getEventTicketById = async (id: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    return await discoverService.get(`/event/${id}/ticket`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    await Promise.reject(error);
  }
};

export const bookEvent = async (params: {
  event_id: string;
  payment_gateway?: string;
  payment_method?: string;
  name: string;
  phone_number: string;
  email: string;
  promo_code?: string;
  is_use_coins?: boolean;
  succes_url?: string;
  cancel_url?: string;
}): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    return await discoverService.post(`/event/buy-ticket`, params, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    await Promise.reject(error);
  }
};

export const updateEventNotification = async (
  payload: string[],
  id: string
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    return await discoverService.patch(
      `/event/${id}/ticket/notification`,
      {
        notification_type: payload
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    );
  } catch (error) {
    await Promise.reject(error);
  }
};

export const checkInOutEvent = async (params: {
  ticket_id: string;
  action: string;
}): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    return await discoverService.post(`/event/check-in-out`, params, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    await Promise.reject(error);
  }
};

export const getCertificateById = async (id: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    return await discoverService.get(`/event/${id}/certificate`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`
      }
    });
  } catch (error) {
    await Promise.reject(error);
  }
};

export const getMyCertificate = async (
  params: {
    page: number,
    limit: number
  }
): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null || accessToken === '') {
      return await Promise.resolve('Access token not found');
    }

    return await discoverService.get(`/my-certificates/event`, {
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

export const sendCertificateToEmail = async (ticketId: string): Promise<any> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken === null) {
      return 'Access token not found';
    }

    return await discoverService.post(
      `/event/${ticketId}/certificate/send`,
      {},
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

  } catch (error) {
    await Promise.reject(error);
  }
};