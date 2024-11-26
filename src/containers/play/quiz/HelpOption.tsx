/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import QuizButton from '@/components/quiz/button.component';
import HelpBox from '@/components/quiz/help-box.component';
import QuizLayoutComponent from '@/components/quiz/quiz-layout.component';
import VerifyCompanion from '@/components/quiz/verify-companion.component';
import Modal from '@/components/ui/modal/Modal';
import TrackerEvent from '@/helpers/GTM';
import { useOnLeavePageConfirmation } from '@/hooks/useOnLeaveConfirmation';
import useSoundEffect from '@/hooks/useSoundEffects';
import { type PaymentData } from '@/pages/play/quiz/[id]/help-option';
import { getUserInfo } from '@/repository/profile.repository';
import { getQuizById, joinQuiz } from '@/repository/quiz.repository';
import i18n from '@/utils/common/i18n';
import {
  LifelinesEnum,
  type IDetailQuiz
} from '@/utils/interfaces/quiz.interfaces';
import { type AxiosError } from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import FiftySeedy from '../../../assets/play/quiz/5050-seedy.png';
import Fifty from '../../../assets/play/quiz/fifty.svg';
import PhoneSeedy from '../../../assets/play/quiz/phone-seedy.png';
import Phone from '../../../assets/play/quiz/phone.svg';
import ExtraCash from '../../../assets/play/quiz/seedy-extra-cash.png';
import VoteSeedy from '../../../assets/play/quiz/vote-seedy.png';
import Vote from '../../../assets/play/quiz/vote.svg';

const HelpOption = ({ onPay }: { onPay: (data: PaymentData) => void }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const id = router.query.id;
  useOnLeavePageConfirmation(false);
  const [lifelines, setLifelines] = useState<LifelinesEnum[]>([]);
  const [selectedLL, setSelectedLL] = useState<LifelinesEnum>();
  const [showLifelineDesc, setShowLifelineDesc] = useState(false);
  const [showAlertPrice, setShowAlertPrice] = useState(false);
  const [redeemCoin, setRedeemCoin] = useState(false);
  const [detailQuiz, setDetailQuiz] = useState<IDetailQuiz>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userInfo, setUserInfo] = useState();
  const invitationCode = router.query.invitationCode ?? '';

  const [verifyCompanionVisibility, setVerifyCompanionVisibility] =
    useState<boolean>(false);

  useEffect(() => {
    setRedeemCoin(router.query.useCoins === 'true');
  }, [router.query.useCoins]);

  const baseUrl =
    process.env.NEXT_PUBLIC_DOMAIN ?? 'https://user-dev-gcp.seeds.finance';
  const audioConfig = {
    routeName: router.pathname,
    audioFiles: [
      {
        name: baseUrl + '/assets/quiz/sound/Waiting_time_loop.mp3',
        isAutoPlay: true
      }
    ]
  };

  useSoundEffect(audioConfig);

  const lifelinesDesc = new Map<LifelinesEnum, { text: string; title: string }>(
    [
      [LifelinesEnum['50_50'], { text: t('quiz.fiftyfifty'), title: '50:50' }],
      [
        LifelinesEnum.PHONE,
        {
          text: t('quiz.phone'),
          title: 'Phone a friend'
        }
      ],
      [
        LifelinesEnum.VOTE,
        {
          text: t('quiz.vote'),
          title: 'Vote'
        }
      ]
    ]
  );

  const getDetail = useCallback(async () => {
    try {
      const dataInfo = await getUserInfo();
      setPhoneNumber(dataInfo.phoneNumber);
      setUserInfo(dataInfo);
      const resp: IDetailQuiz = await getQuizById({
        id: id as string,
        currency:
          dataInfo.preferredCurrency !== undefined
            ? dataInfo.preferredCurrency
            : 'IDR'
      });
      setDetailQuiz(resp);
    } catch (error) {
      toast(`ERROR fetch quiz ${error as string}`);
    }
  }, [id]);

  useEffect(() => {
    void getDetail();
  }, [id]);

  const seedyImage = () => {
    if (selectedLL === LifelinesEnum.PHONE) {
      return PhoneSeedy;
    }
    if (selectedLL === LifelinesEnum['50_50']) {
      return FiftySeedy;
    }
    return VoteSeedy;
  };

  const submitHandler = async () => {
    let total = 0;
    const found = detailQuiz?.lifelines[lifelines.length - 1];
    total += found?.price ?? 0;
    if (total + (detailQuiz?.admission_fee ?? 0) !== 0) {
      onPay({
        payment: {
          quiz_id: id as string,
          lifelines,
          language: i18n.language,
          payment_gateway: '',
          payment_method: '',
          phone_number: phoneNumber,
          promo_code: '',
          invitation_code: '',
          is_use_coins: false
        },
        quiz: {
          lifelines: detailQuiz?.lifelines ?? [],
          fee: total,
          admission_fee: detailQuiz?.admission_fee ?? 0
        }
      });
      // navigateAndReset(
      //   [
      //     { name: 'Tabs', params: { playTab: 1 } },
      //     { name: 'QuizDetailScreen', params: { id: detailQuiz.id } },
      //     {
      //       name: 'PaymentListScreen',
      //       params: {
      //         data: {
      //           payment: {
      //             quiz_id: id,
      //             lifelines,
      //             language: i18n.language,
      //             payment_gateway: '',
      //             payment_method: '',
      //             phone_number: phoneNumber,
      //             promo_code: '',
      //             invitation_code: ''
      //           },
      //           quiz: {
      //             lifelines: detailQuiz?.lifelines,
      //             fee: total,
      //             admission_fee: detailQuiz?.admission_fee
      //           }
      //         },
      //         feature: PAYMENT_QUIZ,
      //         promoCode: ''
      //       }
      //     }
      //   ],
      //   1
      // );
    } else {
      try {
        await joinQuiz({
          quiz_id: id as string,
          lifelines,
          language: i18n.language,
          payment_gateway: '',
          payment_method: '',
          phone_number: phoneNumber,
          promo_code: '',
          invitation_code: invitationCode as string,
          is_use_coins: redeemCoin
        });
        const formattedText = (text: string): string => {
          return text.replaceAll(/[^a-zA-Z0-9_-]/g, '_');
        };
        TrackerEvent({
          event: 'SW_quiz_payment',
          userData: userInfo,
          quizData: {
            ...detailQuiz,
            name: formattedText(detailQuiz?.name as string)
          },
          paymentData: { statusPayment: 'FREE' }
        });
        void router.replace(`/play/quiz/${detailQuiz?.id}/start`);
      } catch (error) {
        const err = error as AxiosError;
        toast(err.message ?? 'Unknown Error');
      }
    }
  };

  const addOrRemoveLifelines = (value: LifelinesEnum | undefined) => {
    if (value) {
      if (lifelines.includes(value)) {
        setLifelines(item => {
          const temp = [...item];
          const index = temp.indexOf(value);
          if (index !== -1) {
            temp.splice(index, 1);
          }
          return temp;
        });
      } else {
        setLifelines(item => [...item, value]);
      }
      setShowLifelineDesc(false);
    }
  };

  const handleTapOption = (value: LifelinesEnum) => {
    if (lifelines.includes(value)) {
      addOrRemoveLifelines(value);
    } else {
      setSelectedLL(value);
      handlePresentModalPress();
    }
  };

  const handlePresentModalPress = useCallback(() => {
    setShowLifelineDesc(true);
  }, []);

  const continueHandler = useCallback(async () => {
    if (lifelines.length < 3) {
      setVerifyCompanionVisibility(true);
    } else {
      await submitHandler();
    }
  }, [lifelines]);

  return (
    <>
      <QuizLayoutComponent>
        <div className="w-full h-full flex flex-col justify-center items-center font-poppins text-white text-center gap-12 px-3 md:p-8">
          <div className="lg:w-7/12">
            <div className="text-3xl lg:text-4xl font-semibold text-yellow-500 mb-2">
              {t('quiz.quizCompanion')}
            </div>
            <div className="text-base lg:text-lg drop-shadow-[0_1px_1px_#27A590]">
              {t('quiz.chooseOptions')}
            </div>
          </div>
          <div>
            <div className="flex flex-row justify-center items-center gap-2 lg:gap-6">
              <HelpBox
                title="Phone Seedy"
                icon={Phone}
                selected={lifelines.includes(LifelinesEnum.PHONE)}
                onClick={() => {
                  handleTapOption(LifelinesEnum.PHONE);
                }}
                background="#95DB56"
                darkBackground="#4DA81C"
              />
              <HelpBox
                title="50:50"
                icon={Fifty}
                selected={lifelines.includes(LifelinesEnum['50_50'])}
                onClick={() => {
                  handleTapOption(LifelinesEnum['50_50']);
                }}
                background="#7B8BFC"
                darkBackground="#3C49D6"
              />
              <HelpBox
                title="Vote"
                icon={Vote}
                selected={lifelines.includes(LifelinesEnum.VOTE)}
                onClick={() => {
                  handleTapOption(LifelinesEnum.VOTE);
                }}
                background="#B798FF"
                darkBackground="#7555DA"
              />
            </div>
            {/* <div className="text-sm lg:text-base mt-6">
              {t('quiz.freeOptions')}
            </div> */}
          </div>
          <div className="mt-24 w-full lg:w-1/3">
            <QuizButton
              disabled={lifelines.length === 0}
              title={t('quiz.continue')}
              background="#67EB00"
              darkBackground="#4EC307"
              onClick={continueHandler}
            />
          </div>
        </div>
      </QuizLayoutComponent>
      {showLifelineDesc && (
        <Modal
          onClose={() => {
            setShowLifelineDesc(false);
          }}
          modalClasses="z-30 animate-slide-down fixed top-[35%] lg:left-[30%] mt-[-12.35rem] w-full lg:w-[40%] h-fit p-4 text-center rounded-3xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white"
        >
          <div className="w-full flex flex-col gap-6 justify-center items-center">
            <Image
              src={seedyImage()}
              alt={selectedLL ?? ''}
              width={200}
              height={200}
              className="object-contain w-80"
            />
            <div className="font-poppins text-center">
              <div className="text-lg text-neutral-medium font-semibold">
                {lifelinesDesc.get(selectedLL ?? LifelinesEnum.PHONE)?.title}
              </div>
              <div className="text-base text-neutral-soft mt-2">
                {lifelinesDesc.get(selectedLL ?? LifelinesEnum.PHONE)?.text}
              </div>
            </div>
            <div className="flex flex-row items-center justify-center gap-3 w-full">
              <QuizButton
                title={t('quiz.cancel')}
                background="#FE4B60"
                darkBackground="#ED0F29"
                onClick={() => {
                  setShowLifelineDesc(false);
                }}
              />
              <QuizButton
                title={t('quiz.select')}
                background="#67EB00"
                darkBackground="#4EC307"
                onClick={() => {
                  if (
                    lifelines.length >= 1 &&
                    detailQuiz?.lifelines?.[lifelines.length]?.price !==
                      undefined &&
                    detailQuiz?.lifelines?.[lifelines.length]?.price > 0
                  ) {
                    setShowLifelineDesc(false);
                    setTimeout(() => {
                      setShowAlertPrice(true);
                    }, 500);
                  } else {
                    addOrRemoveLifelines(selectedLL);
                  }
                }}
              />
            </div>
          </div>
        </Modal>
      )}
      {showAlertPrice && (
        <Modal
          onClose={() => {
            setShowAlertPrice(false);
          }}
          modalClasses="z-30 animate-slide-down fixed top-[35%] left-0 right-0 m-auto md:left-[40%] md:right-[40%] mt-[-12.35rem] w-80 h-fit p-4 text-center rounded-3xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white"
        >
          <div className="w-full flex flex-col gap-6 justify-center items-center">
            <Image
              src={ExtraCash}
              alt="Extra cash"
              width={200}
              height={200}
              className="object-contain w-80"
            />
            <div className="font-poppins text-center">
              <div className="text-lg text-neutral-medium font-semibold">
                {t('quiz.notification')}
              </div>
              <div className="text-base text-neutral-soft mt-2">
                {t('quiz.extraCash', {
                  amount:
                    detailQuiz?.lifelines?.[
                      lifelines.length
                    ]?.price?.toLocaleString('id-ID') ?? '0'
                })}
              </div>
            </div>
            <div className="flex flex-row items-center justify-center gap-3 w-full">
              <QuizButton
                title={t('quiz.cancel')}
                background="#FE4B60"
                darkBackground="#ED0F29"
                onClick={() => {
                  setShowAlertPrice(false);
                }}
              />
              <QuizButton
                title={t('quiz.continue')}
                background="#67EB00"
                darkBackground="#4EC307"
                onClick={() => {
                  addOrRemoveLifelines(selectedLL);
                  setShowAlertPrice(false);
                }}
              />
            </div>
          </div>
        </Modal>
      )}
      {verifyCompanionVisibility && (
        <VerifyCompanion
          setVisible={setVerifyCompanionVisibility}
          lifelines={lifelines}
          setLifelines={setLifelines}
          lifelinesPrice={detailQuiz?.lifelines}
          onSubmit={submitHandler}
        />
      )}
    </>
  );
};

export default HelpOption;
