'use client';
import { CancelSVG } from '@/assets/play/quiz';
import { setSoundActive } from '@/store/redux/features/sound';
import { useAppDispatch, useAppSelector } from '@/store/redux/store';
import { Switch } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { memo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import BackButton from '../../assets/play/quiz/back.svg';
import MusicIcon from '../../assets/play/quiz/music.svg';
import SettingsButton from '../../assets/play/quiz/settings.svg';
import Modal from '../ui/modal/Modal';
import QuizButton from './button.component';

interface Props {
  children: ReactNode;
  withButton?: boolean;
  hideBackButton?: boolean;
  centerContent?: ReactNode;
  enableScroll?: boolean;
  cancelButton?: boolean;
  isQuestionHasMedia?: boolean;
}
const QuizLayout: React.FC<Props> = ({
  children,
  withButton = true,
  hideBackButton = false,
  centerContent,
  enableScroll = false,
  cancelButton = false,
  isQuestionHasMedia = false
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { soundActive } = useAppSelector(state => state.soundSlice);
  const [showSettings, setShowSettings] = useState(false);
  const [localSound, setLocalSound] = useState(soundActive);

  return (
    <>
      <div
        style={{ backgroundImage: "url('/assets/quiz/bg-quiz.png')" }}
        className={`w-full h-screen lg:h-auto bg-center bg-cover bg-no-repeat ${
          isQuestionHasMedia ? 'rounded-[32px]' : ' lg:aspect-[947/685]'
        }`}
      >
        <div className="w-full h-full max-h-full flex flex-col">
          {withButton ? (
            <div className="flex flex-row justify-between items-center p-3 md:p-8 z-10">
              {!hideBackButton ? (
                <button
                  onClick={() => {
                    router.back();
                  }}
                >
                  <Image
                    src={BackButton}
                    alt="quiz-back-button"
                    width={100}
                    height={100}
                    className="object-contain h-10 md:h-12 w-10 md:w-12"
                  />
                </button>
              ) : (
                <div />
              )}
              {centerContent}
              {cancelButton ? (
                <button
                  onClick={() => {
                    void router.push('/play');
                  }}
                >
                  <Image
                    src={CancelSVG}
                    alt="quiz-settings-button"
                    width={100}
                    height={100}
                    className="object-contain h-10 md:h-12 w-10 md:w-12"
                  />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowSettings(true);
                  }}
                >
                  <Image
                    src={SettingsButton}
                    alt="quiz-settings-button"
                    width={100}
                    height={100}
                    className="object-contain h-10 md:h-12 w-10 md:w-12"
                  />
                </button>
              )}
            </div>
          ) : null}
          <div
            className={`${
              enableScroll ? 'h-full overflow-auto scroll-hidden' : 'flex-grow'
            } w-full`}
          >
            {children}
          </div>
        </div>
      </div>
      {showSettings && (
        <Modal
          onClose={() => {
            setShowSettings(false);
          }}
          modalClasses="z-30 animate-slide-down fixed top-[35%] lg:left-[35%] mt-[-12.35rem] w-full lg:w-[30%] h-fit p-4 text-center rounded-3xl shadow-sm shadow-hite drop-shadow-[-5px_5px_0_rgba(255,255,255,1)] bg-[#7555DA]"
        >
          <div className="w-full flex flex-col gap-3 justify-center items-center p-3">
            <div className="font-poppins font-semibold text-2xl text-center text-white">
              Setting
            </div>
            <div className="bg-white rounded-3xl w-full flex flex-col items-center justify-center p-2">
              <div className="flex flex-row w-full items-center justify-between py-6 px-10">
                <label
                  htmlFor="music"
                  className="inline-flex items-center justify-center gap-2"
                >
                  <Image
                    src={MusicIcon}
                    alt="quiz-music-button"
                    width={100}
                    height={100}
                    className="object-contain h-10 md:h-12 w-10 md:w-12"
                  />
                  <div className="text-xl font-semibold font-poppins text-[#7555DA]">
                    Music
                  </div>
                </label>
                <Switch
                  id="music"
                  ripple={true}
                  className="h-full w-full checked:bg-[#C5ACFF]"
                  containerProps={{
                    className: 'w-11 h-6'
                  }}
                  circleProps={{
                    className:
                      'before:hidden border-none bg-[#553BB8] h-7 w-7 left-3'
                  }}
                  checked={localSound}
                  onChange={e => {
                    setLocalSound(e.target.checked);
                  }}
                />
              </div>
              <div className="flex flex-row w-full items-center gap-2 mt-3">
                <QuizButton
                  title={t('quiz.cancel')}
                  background="#FE4B60"
                  darkBackground="#ED0F29"
                  onClick={() => {
                    setShowSettings(false);
                  }}
                />
                <QuizButton
                  title={t('button.label.save')}
                  background="#67EB00"
                  darkBackground="#4EC307"
                  onClick={() => {
                    dispatch(setSoundActive({ active: localSound }));
                    setShowSettings(false);
                  }}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default memo(QuizLayout);
