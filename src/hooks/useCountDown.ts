import type { ICountDown } from '@/utils/interfaces/hooks.interfaces';
import { t } from 'i18next';
import { useEffect, useState } from 'react';

export const useCountDown = (seconds: number = 0): ICountDown => {
  const [countdown, setCountdown] = useState<number>(seconds);
  const [blockByCountdown, setBlockByCountdown] = useState<boolean>(false);

  const resetCountdown = (): void => {
    if (blockByCountdown) return;
    setCountdown(seconds);
    blockHandler();
  };

  const blockHandler = (): void => {
    setBlockByCountdown(true);
  };
  const stopHandler = (): void => {
    setBlockByCountdown(false);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      blockByCountdown &&
        countdown > 1 &&
        setCountdown(countdown => countdown - 1);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [blockByCountdown, countdown]);

  useEffect(() => {
    if (countdown === 0) stopHandler();
  }, [countdown]);

  const countdownText = ` ${countdown.toString() ?? '0'} ${
    countdown > 1 ? t('seconds') : t('second')
  }`;

  return {
    countdown,
    resetCountdown,
    blockHandler,
    stopHandler,
    countdownText,
    blockByCountdown
  };
};
