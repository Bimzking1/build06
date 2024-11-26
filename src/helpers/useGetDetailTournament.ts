import { getPlayByIdWithAuth } from '@/repository/play.repository';
import { type IDetailTournament } from '@/utils/interfaces/tournament.interface';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useIsStarted } from './useIsStarted';

interface UseTournamentBarrierReturn {
  detailTournament: IDetailTournament | null;
  isStarted: boolean;
}

export const useGetDetailTournament = (
  id: string | undefined
): UseTournamentBarrierReturn => {
  const [detailTournament, setDetailTournament] =
    useState<IDetailTournament | null>(null);
  const isStarted = useIsStarted(detailTournament?.play_time);
  const router = useRouter();

  const getDetail = useCallback(async () => {
    try {
      const resp: IDetailTournament = await getPlayByIdWithAuth(id as string);
      setDetailTournament(resp);
    } catch (error) {
      toast.error(`ERROR fetching tournament: ${error as string}`);
    }
  }, [id]);

  useEffect(() => {
    if (id !== null && id !== undefined) {
      void getDetail();
    }
  }, [id, getDetail]);

  useEffect(() => {
    if (id !== null && detailTournament != null && !isStarted) {
      void router.push(`/play/tournament/${id as string}`);
      toast.error('Tournament has not started yet!');
    }
  }, [id, detailTournament, isStarted, router]);

  return {
    detailTournament,
    isStarted
  };
};
