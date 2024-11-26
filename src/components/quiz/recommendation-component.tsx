/* eslint-disable @next/next/no-img-element */
import close from '@/assets/more-option/close.svg';
import { getUserInfo } from '@/repository/profile.repository';
import { getQuizTrending } from '@/repository/quiz.repository';
import { type IQuiz } from '@/utils/interfaces/quiz.interfaces';
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { DocumentSVG, LikeSVG, MemberSVG } from 'public/assets/images';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import CCard from '../CCard';
interface props {
  open: boolean;
  handleOpen: () => void;
}
const ReccomendationCirclePopup: React.FC<props> = ({ open, handleOpen }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [topQuizes, setTopQuizes] = useState<IQuiz[]>([]);
  const [, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>();
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const dataInfo = await getUserInfo();

        setUserInfo(dataInfo);
      } catch (error: any) {
        toast.error('Error when fetch user info');
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, []);

  const getTopQuiz = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await getQuizTrending(userInfo?.preferredCurrency);
      if (resp.data !== undefined) {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (resp.data) {
          const resTopQuiz: IQuiz[] = resp.data;
          setTopQuizes(resTopQuiz);
        }
      }
    } catch (error) {
      toast(`ERROR fetch quiz ${error as string}`);
    } finally {
      setLoading(false);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo !== undefined) {
      void getTopQuiz();
    }
  }, [getTopQuiz]);

  return (
    <Dialog
      dismiss={{
        outsidePress: false
      }}
      open={open}
      size={'xs'}
      handler={handleOpen}
      className="text-center p-5 m-0 max-w-full sm:max-w-xs self-end sm:self-center md:self-center lg:self-center rounded-none rounded-t-2xl sm:rounded-2xl"
    >
      <DialogHeader className="p-0 font-poppins my-4">
        <div className="flex flex-col w-full gap-1">
          <div className="flex justify-between w-full">
            <Typography className="text-lg text-start font-poppins font-semibold text-black">
              {t('quiz.quizDone1')}
            </Typography>
            <div className="flex items-center">
              <Image
                src={close}
                alt="close"
                className="cursor-pointer"
                onClick={() => {
                  handleOpen();
                }}
              />
            </div>
          </div>
          <div className="flex justify-start">
            <Typography className="text-sm text-start font-poppins font-normal text-[#7C7C7C">
              {t('quiz.quizDone2')}
            </Typography>
          </div>
        </div>
      </DialogHeader>
      <DialogBody className="p-0 mb-6 font-poppins">
        <div className="flex flex-col gap-4">
          {topQuizes?.map(el => {
            return (
              <CCard
                className="flex w-full px-4 py-3 border rounded-xl shadow-none bg-[#F9F9F9]"
                key={el?.id}
              >
                <div className="flex justify-start gap-3 md:gap-4 w-full">
                  <div className="bg-white rounded-full p-1 flex items-center">
                    <img
                      src={el?.banner?.image_url}
                      alt="circle"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        minHeight: '100px',
                        minWidth: '100px'
                      }}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <Typography className="text-xs text-start md:text-sm font-poppins font-semibold text-[#3AC4A0]">
                      {el?.name}
                    </Typography>
                    <div className="flex flex-col w-fit">
                      <div className="flex flex-row text-center mt-2 border-b pb-1 border-[#DADADA]">
                        <div className="flex flex-row items-center mr-2 pr-2 border-r border-[#3AC4A0]">
                          <Image
                            src={LikeSVG}
                            alt="member"
                            className="w-5 h-5 mr-1"
                          />
                          <Typography className="text-xs font-normal text-black">
                            {el?.questions}
                          </Typography>
                        </div>
                        <div className="flex flex-row items-center mr-2 pr-2 border-r border-[#3AC4A0]">
                          <Image
                            src={DocumentSVG}
                            alt="member"
                            className="w-5 h-5 mr-1"
                          />
                          <Typography className="text-xs font-normal text-black">
                            {el?.questions}
                          </Typography>
                        </div>
                        <div className="flex flex-row items-center">
                          <Image
                            src={MemberSVG}
                            alt="member"
                            className="w-5 h-5 mr-1"
                          />
                          <Typography className="text-xs font-normal text-black">
                            {el?.participants}
                          </Typography>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center text-[#3AC4A0] font-semibold text-right">
                          {el.admission_fee === 0
                            ? t('quiz.free')
                            : el.admission_fee.toLocaleString('id-ID', {
                                currency:
                                  userInfo?.preferredCurrency?.length > 0
                                    ? userInfo?.preferredCurrency
                                    : 'IDR',
                                style: 'currency'
                              })}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-end h-full">
                      <Button
                        className="rounded-full capitalize font-semibold text-sm bg-[#3AC4A0] text-white font-poppins py-2"
                        onClick={() => {
                          void router.push(`/play/quiz/${el?.id}`);
                        }}
                      >
                        Play
                      </Button>
                    </div>
                  </div>
                </div>
              </CCard>
            );
          })}
        </div>
      </DialogBody>
    </Dialog>
  );
};
export default ReccomendationCirclePopup;
