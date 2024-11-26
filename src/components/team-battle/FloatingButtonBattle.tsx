import FloatingIdea from '@/assets/play/tournament/floatingIdea.svg';
import FloatingUsers from '@/assets/play/tournament/floatingUsers.svg';
import FloatingVideo from '@/assets/play/tournament/floatingVideo.svg';
import ModalTutorialTournament from '@/components/popup/ModalTutorialTournament';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { XIcon } from 'public/assets/vector';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalGuidanceTournament from '../popup/ModalGuidanceTournament';

interface FloatingProps {
  id?: string;
}

const FloatingButtonBattle: React.FC<FloatingProps> = ({ id }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isTutorialModal, setIsTutorialModal] = useState<boolean>(false);
  const [isGuidanceModal, setIsGuidanceModal] = useState<boolean>(false);

  const [modalTutorialDescription, setModalTutorialDescription] =
    useState<boolean>(false);
  const [modalSocialDescription, setModalSocialDescription] =
    useState<boolean>(false);
  const [modalGuidanceDescription, setModalGuidanceDescription] =
    useState<boolean>(false);

  useEffect(() => {
    const visitedBefore = localStorage.getItem('visitedBefore');
    if (visitedBefore === 'true') {
      setModalTutorialDescription(false);
    } else {
      setIsExpanded(true);
      setModalTutorialDescription(true);
      localStorage.setItem('visitedBefore', 'true');
    }
  }, []);

  return (
    <div className="fixed right-0 md:right-[55px] bottom-[30vh] z-10">
      <div
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
        className="flex w-fit h-fit fixed right-0 md:right-[77px] bottom-[30vh] z-10"
      >
        {/* Open Close Modal */}
        {isTutorialModal && (
          <ModalTutorialTournament
            onClose={() => {
              setIsTutorialModal(prev => !prev);
            }}
          />
        )}
        {isGuidanceModal && (
          <ModalGuidanceTournament
            onClose={() => {
              setIsGuidanceModal(prev => !prev);
            }}
          />
        )}

        {/* Triple Circles */}
        <div
          className={`relative w-[20px] h-[40px] ${
            isExpanded ? 'block' : 'hidden'
          }`}
        >
          {/* Pop Up Circles */}
          <div
            onClick={() => {
              isExpanded && setIsTutorialModal(true);
            }}
            className="absolute right-0 top-[-55px] w-[45px] h-[45px] rounded-full bg-[#3AC4A0] flex justify-center items-center cursor-pointer hover:shadow-xl duration-300"
          >
            <Image
              width={100}
              height={100}
              alt=""
              src={FloatingVideo}
              className="w-[25px] h-[25px]"
            />
          </div>
          <div
            onClick={async () =>
              await router.push(`/play/tournament/${id as string}/social-wall`)
            }
            className="absolute right-[20px] top-0 bottom-0 m-auto w-[45px] h-[45px] rounded-full bg-[#3AC4A0] flex justify-center items-center cursor-pointer hover:shadow-xl duration-300"
          >
            <Image
              width={100}
              height={100}
              alt=""
              src={FloatingUsers}
              className="w-[25px] h-[25px]"
            />
          </div>
          <div
            onClick={() => {
              isExpanded && setIsGuidanceModal(true);
            }}
            className="absolute right-0 bottom-[-55px] w-[45px] h-[45px] rounded-full bg-[#3AC4A0] flex justify-center items-center cursor-pointer hover:shadow-xl duration-300"
          >
            <Image
              width={100}
              height={100}
              alt=""
              src={FloatingIdea}
              className="w-[25px] h-[25px]"
            />
          </div>
        </div>

        {/* Arrow Button */}
        <div className="w-[50px] h-[40px] pr-[20px] bg-[#BAFBD0] hover:bg-[#8fffb4] p-2 rounded-l-full cursor-pointer hover:shadow-xl duration-300">
          {isExpanded ? (
            <ChevronRightIcon className="w-full h-full text-[#3AC4A0] font-bold" />
          ) : (
            <ChevronLeftIcon className="w-full h-full text-[#3AC4A0] font-bold" />
          )}
        </div>
      </div>

      <div
        className={`relative w-[20px] h-[40px] ${
          isExpanded ? 'block' : 'hidden'
        }`}
      >
        {/* Pop Up Description */}
        {modalTutorialDescription && (
          <div className="w-[300px] h-fit bg-white p-4 absolute right-[20px] top-[-220px] md:right-[115px] md:top-[-170px] rounded-lg shadow-lg">
            <div className="w-full flex justify-between items-center mb-2">
              <div className="text-seeds-button-green text-sm font-semibold">
                Tutorial
              </div>
              <Image
                src={XIcon}
                alt="X"
                width={100}
                height={100}
                className="w-[15px] h-[15px] cursor-pointer"
                onClick={() => {
                  setModalSocialDescription(true);
                  setModalTutorialDescription(false);
                }}
              />
            </div>
            <div className="text-[#7C7C7C] text-sm">
              {t('tournament.floatingButton.text1')}
            </div>
          </div>
        )}
        {modalSocialDescription && (
          <div className="w-[300px] h-fit bg-white p-4 absolute right-[20px] top-[-220px] md:right-[135px] md:top-[-45px] rounded-lg shadow-lg">
            <div className="w-full flex justify-between items-center mb-2">
              <div className="text-seeds-button-green text-sm font-semibold">
                Social Wall
              </div>
              <Image
                src={XIcon}
                alt="X"
                width={100}
                height={100}
                className="w-[15px] h-[15px] cursor-pointer"
                onClick={() => {
                  setModalGuidanceDescription(true);
                  setModalSocialDescription(false);
                }}
              />
            </div>
            <div className="text-[#7C7C7C] text-sm">
              {t('tournament.floatingButton.text2')}
            </div>
          </div>
        )}
        {modalGuidanceDescription && (
          <div className="w-[300px] h-fit bg-white p-4 absolute right-[20px] top-[-220px] md:right-[115px] md:top-[70px] rounded-lg shadow-lg">
            <div className="w-full flex justify-between items-center mb-2">
              <div className="text-seeds-button-green text-sm font-semibold">
                Guidance
              </div>
              <Image
                src={XIcon}
                alt="X"
                width={100}
                height={100}
                className="w-[15px] h-[15px] cursor-pointer"
                onClick={() => {
                  setModalGuidanceDescription(false);
                }}
              />
            </div>
            <div className="text-[#7C7C7C] text-sm">
              {t('tournament.floatingButton.text3')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingButtonBattle;
