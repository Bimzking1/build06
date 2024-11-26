import CopyLink from '@/assets/play/tournament/copyTournamentLink.svg';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { XIcon } from 'public/assets/vector';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface Props {
  onClose: () => void;
  url: string;
}

const ModalShareCourse: React.FC<Props> = ({ onClose, url }) => {
  const { t } = useTranslation();
  const baseUrl =
    process.env.NEXT_PUBLIC_DOMAIN ?? 'https://user-dev-gcp.seeds.finance';

  const handleCopyClick = async (): Promise<void> => {
    const textToCopy = `${baseUrl}/academy/course/${url}`;
    await navigator.clipboard.writeText(textToCopy).then(() => {
      toast('Course link copied!');
    });
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-end justify-center sm:items-center z-50">
        <div className="bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden w-full sm:w-3/4 lg:w-1/2 border-2 p-3">
          <div className="flex justify-between mb-4">
            <Typography className="font-semibold text-lg">
              {t('academy.shareCourse')}
            </Typography>
            <Image
              src={XIcon}
              alt="X"
              width={30}
              height={30}
              onClick={onClose}
              className="hover:scale-110 transition ease-out cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-2 justify-center px-2 lg:px-8 pt-2 items-center text-center">
            <Typography className="text-base">
              {t('academy.shareLinks')}
            </Typography>
            <div className="w-full h-fit flex mb-4">
              <input
                type="text"
                readOnly={true}
                disabled={false}
                value={`${baseUrl}/academy/course/${url}`}
                className="block w-full text-[#262626] h-10 leading-4 placeholder-text-[#BDBDBD] focus:outline-none disabled:bg-[#E9E9E9] p-4 rounded-xl border border-[#BDBDBD]"
              />
              <div className="w-12 lg:w-[50px] flex justify-center items-center">
                <Image
                  onClick={handleCopyClick}
                  alt="copy-link"
                  src={CopyLink}
                  className="w-[20px] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalShareCourse;
