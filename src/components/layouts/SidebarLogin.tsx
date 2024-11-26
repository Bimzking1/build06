import TrackerEvent from '@/helpers/GTM';
import { isGuest } from '@/helpers/guest';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { getUserInfo } from '@/repository/profile.repository';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import connect from 'public/assets/social/connect.svg';
import homepage from 'public/assets/social/discover.svg';
import play from 'public/assets/social/play.svg';
import setting from 'public/assets/social/setting.svg';
import social from 'public/assets/social/social.svg';
import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import ModalLogout from '../popup/ModalLogout';
import Logo from '../ui/vector/Logo';

const SidebarLogin: React.FC = () => {
  const menu = isGuest()
    ? [
        { title: 'Social', url: '/social', image: social },
        { title: 'Homepage', url: '/homepage', image: homepage },
        { title: 'Connect', url: '/connect', image: connect },
        { title: 'Play', url: '/play', image: play }
      ]
    : [
        { title: 'Social', url: '/social', image: social },
        { title: 'Homepage', url: '/homepage', image: homepage },
        { title: 'Connect', url: '/connect', image: connect },
        { title: 'Play', url: '/play', image: play },
        { title: 'Setting', url: '/user-setting', image: setting }
        // { title: 'Notification', url: '/setting', image: notification },
        // { title: 'Chat', url: '/setting', image: chat }
        // { title: 'Profile', url : '/setting', image: setting},
      ];

  // const { t } = useTranslation();
  const [accessToken, setAccessToken] = useState('');
  const width = useWindowInnerWidth();
  const router = useRouter();
  const [isLogoutModal, setIsLogoutModal] = useState<boolean>(false);
  const [showLogoutButton, setShowLogoutButton] = useState(false);
  const [userInfo, setUserInfo] = useState<any>([]);
  const isLinkActive = (href: string): string => {
    return router.asPath.startsWith(href) ? 'active' : '';
  };

  useEffect(() => {
    if (!isGuest()) {
      setAccessToken(localStorage.getItem('accessToken') ?? '');
      const fetchData = async (): Promise<void> => {
        try {
          const dataInfo = await getUserInfo();
          setShowLogoutButton(true);
          setUserInfo(dataInfo);
        } catch (error: any) {
          if (error.response.status !== 401) {
            toast(error.message, { type: 'error' });
          }
        }
      };

      fetchData()
        .then()
        .catch(() => {});
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 h-full bg-white bg-opacity-50">
      {isLogoutModal && (
        <ModalLogout
          onClose={() => {
            setIsLogoutModal(prev => !prev);
          }}
          userInfo={userInfo}
        />
      )}

      <Link href={`/homepage`} className="mb-[30px] px-[60px]">
        <Logo
          width={width !== undefined && width <= 640 ? '62.22' : undefined}
          height={width !== undefined && width <= 640 ? '23.58' : undefined}
        />
      </Link>
      <ul className="flex flex-col items-start w-full social-sidebar-list flex-grow">
        {menu.map((data, idx) => (
          <Link
            onClick={() => {
              TrackerEvent({
                event: `SW_${data.title.toLowerCase()}_page`,
                userData: userInfo
              });
            }}
            className={isLinkActive(data.url)}
            href={data.url}
            key={idx}
          >
            <Image width={20} height={20} src={data.image} alt="" />
            <h1>{data.title}</h1>
          </Link>
        ))}
      </ul>
      {isGuest() ? (
        <Link href="/" className="flex mx-auto">
          <button className="flex bg-red-500 text-white font-semibold rounded-2xl py-2 px-11 w-full">
            Logout
          </button>
        </Link>
      ) : (
        showLogoutButton && (
          <div className={`${accessToken !== '' ? 'flex' : 'hidden'} mx-auto`}>
            <button
              className={`${
                accessToken !== '' ? 'flex' : 'hidden'
              } bg-red-500 text-white font-semibold rounded-2xl py-2 px-11 w-full`}
              onClick={() => {
                setIsLogoutModal(true);
              }}
            >
              Logout
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default SidebarLogin;
