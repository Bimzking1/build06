/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useAppSelector } from '@/store/redux/store';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export interface AudioFileConfig {
  name: string;
  isLoop?: boolean;
  isAutoPlay?: boolean;
}

interface AudioConfig {
  routeName: string;
  audioFiles: AudioFileConfig[];
}

const useSoundEffect = (audioConfig: AudioConfig) => {
  const router = useRouter();
  const settingsQuiz = useAppSelector(state => ({
    ...state.soundSlice
  }));

  const [soundEffectRefs, setSoundEffectRefs] = useState<
    Map<string, HTMLAudioElement | null>
  >(new Map());

  const play = (audioFileConfig: AudioFileConfig) => {
    if (!settingsQuiz.soundActive) return;

    const { name, isLoop } = audioFileConfig;

    setSoundEffectRefs(prev => {
      const newAudio = new Audio(name);
      newAudio.loop = isLoop ?? false;
      void newAudio.play();
      console.info('playing audio:', newAudio);
      return prev.set(name, newAudio);
    });
  };

  const stop = (name: string, cleanup: boolean = false) => {
    const audioRef = soundEffectRefs.get(name);
    if (audioRef) {
      audioRef.pause();
      console.info('stop audio:', name);
      if (!cleanup) {
        setSoundEffectRefs(prev => {
          const newData = prev;
          newData.delete(name);
          return newData;
        });
      }
    }
  };

  useEffect(() => {
    const currentRouteName = router.pathname;

    if (
      settingsQuiz.soundActive &&
      currentRouteName === audioConfig.routeName
    ) {
      audioConfig.audioFiles.forEach(audioFileConfig => {
        if (audioFileConfig.isAutoPlay) {
          play(audioFileConfig);
        }
      });
    } else {
      audioConfig.audioFiles.forEach(audioFileConfig => {
        stop(audioFileConfig.name);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsQuiz.soundActive]);

  useEffect(() => {
    return () => {
      soundEffectRefs.forEach((item, key) => {
        stop(key, true);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    playAudio: (audioFileConfig: AudioFileConfig) => {
      play(audioFileConfig);
    },
    stopAudio: stop
  };
};

export default useSoundEffect;
