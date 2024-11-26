import dot_menu from '@/assets/circle-page/3dot.svg';
import notification from '@/assets/circle-page/notification.svg';
import pencil from '@/assets/circle-page/pencil.svg';
import Loading from '@/components/popup/Loading';
import { standartCurrency } from '@/helpers/currency';
import TrackerEvent from '@/helpers/GTM';
import { joinCirclePost } from '@/repository/circleDetail.repository';
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList
} from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface props {
  setIsLoading: any;
  dataCircle: any;
  openModalDelete: any;
  openModalLeave: any;
  openModalReport: any;
  handleEdit: any;
  isJoined: boolean;
  setIsJoined: any;
  userInfo: any;
  circleId: any;
}

const CirclePostSection1: React.FC<props> = ({
  dataCircle,
  openModalDelete,
  openModalLeave,
  openModalReport,
  handleEdit,
  isJoined,
  setIsJoined,
  userInfo,
  circleId
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleJoin = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (dataCircle.type === 'free') {
        const { success }: any | boolean = await joinCirclePost({
          circle_id: dataCircle.id,
          duration: 1,
          payment_request: {}
        });
        if (success === true) {
          setIsJoined(true);
        }
      } else {
        router
          .push(`/connect/payment/${dataCircle?.id as string}`)
          .catch(error => {
            toast.error(`${error as string}`);
          });
      }
    } catch (error) {
      toast.error(`Error Join Circle: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-xl">
      {isLoading && <Loading />}
      <div className="flex flex-col rounded-b-3xl md:px-14 pt-4">
        <button className="sm:block hidden bg-white rounded-full relative top-10 w-fit left-[90%] md:left-[92%] lg:left-[93%] xl:left-[94%] 2xl:left-[95%] p-1">
          <Image alt="pencil-edit" src={pencil} className="h-[13px] w-[14px]" />
        </button>
        <img
          alt="bg-circle"
          src={dataCircle?.cover}
          className="md:max-h-[200px] max-h-[150px] 2xl:w-[100%] object-cover sm:rounded-t-3xl"
        />
        <div className="bg-white left-5 rounded-full relative bottom-14 w-fit">
          <img
            alt="bg-circle-avatar"
            src={dataCircle?.avatar}
            className="h-[100px] w-[100px] rounded-full object-cover border-2 border-white"
          />
        </div>
        <div className="md:hidden flex justify-end h-fit gap-4 relative bottom-20">
          {isJoined ? (
            <button className="cursor-default bg-neutral-ultrasoft w-[30%] lg:w-[260px] py-2 rounded-full font-poppins font-semibold text-xs text-neutral-soft">
              {t('circleDetail.statusJoined')}
            </button>
          ) : (
            <button
              onClick={handleJoin}
              className="bg-seeds-button-green w-[30%] lg:w-[260px] py-2 rounded-full font-poppins font-semibold text-xs text-white"
            >
              {t('circleDetail.statusNotJoined')}
            </button>
          )}
          <div className="flex flex-col justify-center">
            <div className="flex">
              <Image
                alt="notification"
                src={notification}
                className="h-[24px] w-[24px] object-cover"
              />
              <Menu placement="left">
                <MenuHandler>
                  <button type="button">
                    <Image
                      alt="menu_dot"
                      src={dot_menu}
                      className="h-[24px] w-[24px] object-cover"
                    />
                  </button>
                </MenuHandler>
                <MenuList>
                  {userInfo?.id === dataCircle?.owner?.id && (
                    <>
                      <MenuItem onClick={handleEdit}>
                        <div className="flex flex-row">
                          <PencilSquareIcon className="w-5 h-5 text-[#3AC4A0] mr-2" />
                          {t('circleSetting.popUpCircle.option1')}
                        </div>
                      </MenuItem>
                      <hr />
                      <MenuItem onClick={openModalDelete}>
                        <div className="flex flex-row text-[#DD2525]">
                          <TrashIcon className="w-5 h-5 text-[#DD2525] mr-2 " />
                          {t('circleSetting.popUpCircle.option2')}
                        </div>
                      </MenuItem>
                      <hr />
                    </>
                  )}
                  <MenuItem onClick={openModalReport}>
                    <div className="flex flex-row text-[#DD2525]">
                      <ExclamationCircleIcon className="w-5 h-5 text-[#DD2525] mr-2" />
                      {t('circleSetting.popUpCircle.option3')}
                    </div>
                  </MenuItem>
                  =
                  {userInfo?.id !== dataCircle?.owner?.id && isJoined && (
                    <>
                      <hr />
                      <MenuItem onClick={openModalLeave}>
                        <div className="flex flex-row text-[#DD2525]">
                          <ArrowPathIcon className="w-5 h-5 text-[#DD2525] mr-2" />
                          {t('circleSetting.popUpCircle.option4')}
                        </div>
                      </MenuItem>
                    </>
                  )}
                </MenuList>
              </Menu>
            </div>
          </div>
        </div>
        {/* detail section */}
        <div className="flex justify-between w-[100%] md:pl-10 md:px-0 px-3 relative bottom-12 md:bottom-0 rounded-b-3xl border-b border-neutral-ultrasoft">
          <div className="flex flex-col">
            <h1 className="font-semibold text-3xl font-poppins">
              {dataCircle?.name}
            </h1>
            <div className="flex flex-col md:max-w-[360px] xl:max-w-[500px] py-5">
              <h1 className="text-[#262626] font-normal font-poppins text-base">
                {dataCircle?.description}
              </h1>
            </div>
            {/* avatar and members section */}
            <div className="flex justify-between md:max-w-[360px] xl:max-w-[500px] pb-4">
              <div className="flex justify-start">
                <img
                  alt="bg-avatar-sm"
                  src={dataCircle?.owner?.avatar}
                  className="md:h-6 md:w-6 w-5 h-5 rounded-full object-cover"
                />
                <h1 className="text-seeds-purple font-normal font-poppins text-xs md:text-base pl-2">
                  @{dataCircle?.owner?.seedsTag}
                </h1>
              </div>
              <div className="flex justify-center flex-col">
                <h1 className="text-neutral-soft text-xs font-normal font-poppins pl-2">
                  {`${dataCircle?.total_member as string} ${t(
                    'circleDetail.member'
                  )}`}
                </h1>
              </div>
            </div>
          </div>
          {/* notification button */}
          <div className="md:flex hidden h-fit gap-4">
            <div
              className={`relative ${
                dataCircle.type === 'free' ? '' : 'bottom-7'
              } `}
            >
              {dataCircle.type === 'free' ? (
                <></>
              ) : (
                <div className="flex justify-start mb-2">
                  <div className="flex justify-between w-full lg:px-8">
                    <div className="flex place-items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="10"
                        viewBox="0 0 17 10"
                        fill="none"
                      >
                        <path
                          d="M11.8385 5L8.50521 0L6.00521 5L0.171875 3.33333L3.50521 10H13.5052L16.8385 3.33333L11.8385 5Z"
                          fill="#FDBA22"
                        />
                      </svg>
                      <h1 className="font-poppins text-seeds-purple pl-2">
                        Premium
                      </h1>
                    </div>
                    <h1 className="font-poppins text-seeds-purple">
                      {userInfo?.preferredCurrency} {standartCurrency(dataCircle.premium_fee ?? 0)}
                    </h1>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                {isJoined ? (
                  <button className="bg-neutral-ultrasoft cursor-default w-[150px] lg:w-[260px] py-2 rounded-full font-poppins font-semibold text-xs text-neutral-soft">
                    {t('circleDetail.statusJoined')}
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      await handleJoin();
                      TrackerEvent({
                        event: `SW_circle_btn_join_circle`,
                        userData: userInfo,
                        circleData: dataCircle
                      });
                    }}
                    className="bg-seeds-button-green w-[150px] lg:w-[260px] py-2 rounded-full font-poppins font-semibold text-xs text-white"
                  >
                    {t('circleDetail.statusNotJoined')}
                  </button>
                )}
                <div className="flex flex-col justify-center">
                  <div className="flex">
                    <Image
                      alt="notification"
                      src={notification}
                      className="h-[24px] w-[24px] object-cover"
                    />
                    <Menu placement="left">
                      <MenuHandler>
                        <button type="button">
                          <Image
                            alt="menu_dot"
                            src={dot_menu}
                            className="h-[24px] w-[24px] object-cover"
                          />
                        </button>
                      </MenuHandler>
                      <MenuList>
                        {userInfo?.id === dataCircle?.owner?.id && (
                          <>
                            <MenuItem onClick={handleEdit}>
                              <div className="flex flex-row">
                                <PencilSquareIcon className="w-5 h-5 text-[#3AC4A0] mr-2" />
                                {t('circleSetting.popUpCircle.option1')}
                              </div>
                            </MenuItem>
                            <hr />
                            <MenuItem onClick={openModalDelete}>
                              <div className="flex flex-row text-[#DD2525]">
                                <TrashIcon className="w-5 h-5 text-[#DD2525] mr-2 " />
                                {t('circleSetting.popUpCircle.option2')}
                              </div>
                            </MenuItem>
                            <hr />
                          </>
                        )}
                        <MenuItem onClick={openModalReport}>
                          <div className="flex flex-row text-[#DD2525]">
                            <ExclamationCircleIcon className="w-5 h-5 text-[#DD2525] mr-2" />
                            {t('circleSetting.popUpCircle.option3')}
                          </div>
                        </MenuItem>
                        {userInfo?.id !== dataCircle?.owner?.id && isJoined && (
                          <>
                            <hr />
                            <MenuItem onClick={openModalLeave}>
                              <div className="flex flex-row text-[#DD2525]">
                                <ArrowPathIcon className="w-5 h-5 text-[#DD2525] mr-2" />
                                {t('circleSetting.popUpCircle.option4')}
                              </div>
                            </MenuItem>
                          </>
                        )}
                      </MenuList>
                    </Menu>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CirclePostSection1;
