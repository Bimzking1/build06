import { isGuest } from '@/helpers/guest';
import { setTranslationToLocalStorage } from '@/helpers/translation';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { getUserInfo } from '@/repository/profile.repository';
import LanguageContext from '@/store/language/language-context';
import { useAppSelector } from '@/store/redux/store';
import { getLocalStorage } from '@/utils/common/localStorage';
import { Bars4Icon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ID from 'public/assets/social/flag/ID.png';
import US from 'public/assets/social/flag/US.png';
import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ModalLogout from '../popup/ModalLogout';
import ChatIconWhite from '../svgs/chatIconWhite';
import NotificationIconWhite from '../svgs/notificationIconWhite';
import Logo from '../ui/vector/Logo';
import SidebarLoginResponsive from './SidebarLoginResponsive';

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

const HeaderBattle: React.FC = () => {
  const accessToken =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const { dataUser } = useAppSelector(state => state.user);
  const width = useWindowInnerWidth();
  const router = useRouter();
  const [openSidebarResponsive, setOpenSidebarResponsive] =
    useState<boolean>(false);
  const languageCtx = useContext(LanguageContext);
  const [isLogoutModal, setIsLogoutModal] = useState<boolean>(false);

  const handleOpenModal = (): void => {
    setOpenSidebarResponsive(!openSidebarResponsive);
  };

  const handleGetUserInfo = async (): Promise<void> => {
    try {
      const response = await getUserInfo();
      setUserInfo(response);
    } catch (error: any) {
      if (error.response.status !== 401) {
        toast.error('Error fetching user data');
      }
    }
  };

  const handleOpenLogout = (): void => {
    handleOpenModal();
    setIsLogoutModal(true);
  };

  const getLastTranslation = useCallback(async (): Promise<void> => {
    try {
      if (typeof window !== 'undefined') {
        const translation = getLocalStorage('translation', 'EN');
        languageCtx.languageHandler(translation as 'EN' | 'ID');
      }
    } catch {
      toast.error('Error in translation');
    }
  }, []);

  useEffect(() => {
    void getLastTranslation();
    if (!isGuest()) {
      void handleGetUserInfo();
    }
  }, []);

  return (
    <div>
      {openSidebarResponsive ? (
        <SidebarLoginResponsive
          handleOpen={handleOpenModal}
          open={openSidebarResponsive}
          handleLogout={handleOpenLogout}
        />
      ) : null}

      {isLogoutModal && (
        <ModalLogout
          onClose={() => {
            setIsLogoutModal(prev => !prev);
          }}
          userInfo={userInfo}
        />
      )}

      {width !== undefined ? (
        width < 768 ? (
          <div className="flex flex-row justify-between">
            <Link href={`/homepage`} className="items-start">
              <Logo
                width={
                  width !== undefined && width <= 640 ? '62.22' : undefined
                }
                height={
                  width !== undefined && width <= 640 ? '23.58' : undefined
                }
              />
            </Link>
            <Bars4Icon
              width={30}
              height={30}
              className="items-center"
              onClick={handleOpenModal}
            />
          </div>
        ) : (
          <section className="flex flex-row items-center justify-end gap-5">
            <section className="flex flex-row gap-2 rounded-full backdrop-blur-[10px] py-2 px-4">
              <button
                className={`transition-all duration-300 flex sm:justify-evenly sm:pl-0 pl-2.5 items-center sm:w-[5.5rem] w-[3.375rem] h-7 sm:h-11 rounded-full bg-gray-100 bg-opacity-50 ${
                  width !== undefined && width <= 375 ? 'space-x-1' : ''
                } ${
                  languageCtx.language === 'ID'
                    ? 'border border-seeds-purple'
                    : ''
                }`}
                onClick={async () => {
                  languageCtx.languageHandler('ID');
                  await setTranslationToLocalStorage('ID');
                }}
              >
                <span
                  className={`font-poppins sm:text-lg mr-2 lg:mr-0 text-sm ${
                    languageCtx.language === 'ID'
                      ? 'sm:font-semibold text-seeds-purple'
                      : 'text-black'
                  }`}
                >
                  ID
                </span>

                <Image
                  src={ID}
                  alt="ID-flag"
                  className="w-[30px] h-[20px] self-center"
                />
              </button>
            </section>
            <section className="border-r h-4 border-black my-3"></section>
            <section className="flex flex-row gap-2 rounded-full backdrop-blur-[10px] py-2 px-4">
              <button
                className={`transition-all duration-300 flex sm:justify-evenly pl-2.5 items-center sm:w-[6.5rem] w-[3.375rem] h-7 sm:h-11 rounded-full bg-gray-100 bg-opacity-50  ${
                  width !== undefined && width <= 375 ? 'space-x-1' : ''
                } ${
                  languageCtx.language === 'EN'
                    ? 'border border-seeds-purple'
                    : ''
                }`}
                onClick={async () => {
                  languageCtx.languageHandler('EN');
                  await setTranslationToLocalStorage('EN');
                }}
              >
                <span
                  className={`font-poppins lg:mr-1 mr-1 sm:text-lg text-sm ${
                    languageCtx.language === 'EN'
                      ? 'sm:font-semibold text-seeds-purple'
                      : 'text-black'
                  }`}
                >
                  EN
                </span>
                <Image
                  src={US}
                  alt="US-flag"
                  className="w-[30px] h-[20px] self-center"
                />
              </button>
            </section>
            {!isGuest() && (
              <>
                <section>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      router.push('/social/notification').catch(err => {
                        toast(err, { type: 'error' });
                      });
                    }}
                  >
                    <NotificationIconWhite />
                  </div>
                </section>
                <section>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      router.push('/chat').catch(err => {
                        toast(err);
                      });
                    }}
                  >
                    <ChatIconWhite />
                  </div>
                </section>
                {accessToken !== null && userInfo !== null ? (
                  <Link href="/my-profile">
                    <Image
                      alt="image"
                      width={17}
                      height={17}
                      className="rounded-full w-10 bg-white"
                      src={dataUser.avatar}
                    />
                  </Link>
                ) : (
                  <></>
                )}
              </>
            )}
          </section>
        )
      ) : null}
    </div>
  );
};

export default HeaderBattle;
