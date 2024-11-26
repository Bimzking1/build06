import Loading from '@/components/popup/Loading';
import EditCircle from '@/containers/circle/[id]/EditCircle';
import ModalDeleteCircle from '@/containers/circle/[id]/ModalDeleteCircle';
import ModalLeaveCircle from '@/containers/circle/[id]/ModalLeaveCircle';
import ModalReportCircle from '@/containers/circle/[id]/ModalReportLeave';
import withRedirect from '@/helpers/withRedirect';
import {
  getDetailCircle,
  getStatusCircle
} from '@/repository/circleDetail.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { setMonth, setPrice } from '@/store/premium-circle/premiumCircleSlice';
import {
  selectPromoCodeValidationResult,
  setPromoCodeValidationResult
} from '@/store/redux/features/promo-code';
import { Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import MainPostLayout from '../../../components/layouts/MainPostLayout';

interface UserData {
  name: string;
  seedsTag: string;
  email: string;
  pin: string;
  avatar: string;
  bio: string;
  birthDate: string;
  phone: string;
  _pin: string;
}

const CirclePost = (): JSX.Element => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentUnixTime = Date.now() / 1000;
  const expiredUnixTime = parseInt(
    window.localStorage.getItem('expiresAt') as string
  );
  const circleId: string | any = router.query.circleid;
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = (): void => {
    if (isOpen) {
      document.body.classList.remove('modal-open');
    } else {
      document.body.classList.add('modal-open');
    }
    setIsOpen(!isOpen);
  };
  const [isLoading, setIsLoading] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalLeave, setOpenModalLeave] = useState(false);
  const [openModalReport, setOpenMOdalReport] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [dataCircle, setData]: any = useState({});
  const [isJoined, setIsJoined] = useState(false);
  const [userInfo, setUserInfo] = useState<UserData | null>(null);

  const redirect = async (): Promise<void> => {
    if (
      window.localStorage.getItem('accessToken') === null ||
      expiredUnixTime < currentUnixTime
    ) {
      await withRedirect(router, { ci: circleId }, '/auth');
      toast.error(t('landingPageV2.redirectError'));
    }
  };

  useEffect(() => {
    void fetchData();

    if (promoCodeValidationResult?.circleId !== circleId) {
      dispatch(setPromoCodeValidationResult(0));
    }
  }, []);

  const promoCodeValidationResult = useSelector(
    selectPromoCodeValidationResult
  );

  const fetchData = async (): Promise<void> => {
    try {
      const response = await getUserInfo();
      setUserInfo(response);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const fetchUserInfo = async (): Promise<void> => {
    try {
      setIsLoading(true);

      const { data } = await getStatusCircle({ circleId });
      const { status }: any = data;

      if (status === 'accepted') {
        setIsJoined(true);
      } else {
        setIsJoined(false);
      }
    } catch (error) {
      toast.error(`Error fetching Circle Post: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDetailCircle = async (): Promise<void> => {
    try {
      setIsLoading(true);

      const { data } = await getDetailCircle({ circleId });

      setData(data);
    } catch (error) {
      toast.error(`Error fetching Circle Detail: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (circleId !== undefined) {
      void fetchUserInfo();
      void fetchDetailCircle();
      void redirect();
    }
    dispatch(setPrice(0));
    dispatch(setMonth(''));
  }, [circleId]);

  const handlePages = (): any => {
    return (
      <div className="flex flex-col pl-14 pt-2 pb-4">
        <div
          className="w-full border border-neutral-ultrasoft rounded-xl cursor-pointer"
          onClick={(): void => {
            handleOpen();
          }}
        >
          <div className="flex flex-col p-4">
            <Typography className="font-poppins text-base text-black">
              {t('landingPageV2.placeHolder1')}
            </Typography>
            <Typography className="font-poppins text-base text-black">
              {t('landingPageV2.placeHolder2')}
            </Typography>
          </div>
        </div>
      </div>
    );
  };

  const handleOpenModalDelete = (): void => {
    setOpenModalDelete(!openModalDelete);
  };

  const handleOpenModalLeave = (): void => {
    setOpenModalLeave(!openModalLeave);
  };

  const handleOpenModalReport = (): void => {
    setOpenMOdalReport(!openModalReport);
  };

  const handleEditCircle = (): void => {
    setIsEdit(!isEdit);
  };

  return (
    <MainPostLayout
      open={isOpen}
      handleOpen={handleOpen}
      dataCircle={dataCircle}
      circleId={circleId}
      openModalDelete={handleOpenModalDelete}
      openModalLeave={handleOpenModalLeave}
      openModalReport={handleOpenModalReport}
      handleEdit={handleEditCircle}
      isEdit={isEdit}
      isJoined={isJoined}
      setIsJoined={setIsJoined}
      setIsLoading={setIsLoading}
      userInfo={userInfo}
    >
      {isLoading && <Loading />}
      {/* posting section */}
      <div className="bg-white mt-8 w-full rounded-xl">
        <div className="flex flex-col md:px-14">
          {isEdit ? (
            <EditCircle dataCircle={dataCircle} circleId={circleId} />
          ) : (
            <>
              <div className="flex justify-start gap-3">
                <img
                  alt="bg-avatar-sm"
                  src={userInfo?.avatar}
                  className="h-[48px] w-[48px] rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <div className="flex">
                    <h1 className="text-[#262626] font-semibold font-poppins text-base">
                      {userInfo?.name}
                    </h1>
                  </div>
                  <h1 className="text-[#7C7C7C] font-normal font-poppins text-sm">
                    @{userInfo?.seedsTag}
                  </h1>
                </div>
              </div>
              {/* form text section */}
              {handlePages()}
            </>
          )}
        </div>
      </div>
      <ModalDeleteCircle
        open={openModalDelete}
        handleOpen={handleOpenModalDelete}
        circleId={circleId}
      />

      <ModalLeaveCircle
        open={openModalLeave}
        handleOpen={handleOpenModalLeave}
        circleId={circleId}
      />

      <ModalReportCircle
        open={openModalReport}
        handleOpen={handleOpenModalReport}
        circleId={circleId}
      />
    </MainPostLayout>
  );
};

export default CirclePost;
