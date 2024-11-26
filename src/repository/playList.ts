import BaseAxios from '@/utils/common/axios';

const service = BaseAxios('https://seeds-dev.seeds.finance/', false);

export const getPlayList = async (): Promise<any> => {
  try {
    return await service(`/play/v1/list`);
  } catch (error) {
    await Promise.resolve();
  }
};
