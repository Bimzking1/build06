// import { useMemo } from 'react';

// export const useIsStarted = (startTime: string | undefined): boolean => {
//   const isStarted = useMemo((): boolean => {
//     const startingTime = startTime ?? '2024-12-31T17:00:00Z';
//     const timeStart = new Date(startingTime).getTime();
//     const timeNow = Date.now();
//     return timeStart < timeNow;
//   }, [startTime]);

//   return isStarted;
// };

import { useMemo } from 'react';

export const useIsStarted = (startTime: string | undefined): boolean => {
  const isStarted = useMemo((): boolean => {
    if (startTime === null || startTime === undefined) {
      return false;
    }

    const startingTime = startTime ?? '2024-12-31T17:00:00Z';
    const timeStart = new Date(startingTime).getTime();
    const timeNow = Date.now();
    return timeStart < timeNow;
  }, [startTime]);

  return isStarted;
};
