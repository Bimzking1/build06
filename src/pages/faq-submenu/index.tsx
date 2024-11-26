import LegalSubmenu from '@/assets/legal.png';
import SubmenuButton from '@/components/ui/button/SubmenuButton';
import CardGradient from '@/components/ui/card/CardGradient';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import Image from 'next/image';
import router from 'next/router';
import {
  ArrowLeftBlack,
  ArrowRightCollapseIcon,
  CircleMembership,
  Disclosure,
  FileTextIcon,
  PrivacyPolicy,
  Refund,
  SosmedGuide
} from 'public/assets/vector';
import type { ReactNode } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FaqSubmenuProps {
  children: ReactNode;
}

const FaqSubmenu: React.FC<FaqSubmenuProps> = ({ children }) => {
  const width = useWindowInnerWidth();
  const { t } = useTranslation();

  const submenuClasses = `sm:w-[95%] w-full h-12 ${
    width !== undefined && width < 370 ? 'h-9' : ''
  } px-4 py-4`;

  const menus = useMemo(
    () => [
      {
        label: t('legal.title1'),
        altStartAdornment: 'terms-condition',
        startAdornment: FileTextIcon,
        onClick: async (): Promise<void> => {
          try {
            await router.push('/faq-submenu/terms-condition');
          } catch (err) {
            console.error(err);
          }
        },
        extraClasses: submenuClasses
      },
      {
        label: t('legal.title2'),
        altStartAdornment: 'disclosure',
        startAdornment: Disclosure,
        onClick: async (): Promise<void> => {
          try {
            await router.push('/faq-submenu/disclosure');
          } catch (error) {
            console.error('Error navigating to FAQ:', error);
          }
        },
        extraClasses: submenuClasses
      },
      {
        label: t('legal.title3'),
        altStartAdornment: 'privacy-policy',
        startAdornment: PrivacyPolicy,
        onClick: async (): Promise<void> => {
          try {
            await router.push('/faq-submenu/privacy-policy');
          } catch (error) {
            console.error('Error navigating to FAQ:', error);
          }
        },
        extraClasses: submenuClasses
      },
      {
        label: t('legal.title4'),
        altStartAdornment: 'refund-policy',
        startAdornment: Refund,
        onClick: async (): Promise<void> => {
          try {
            await router.push('/faq-submenu/refund-policy');
          } catch (error) {
            console.error('Error navigating to FAQ:', error);
          }
        },
        extraClasses: submenuClasses
      },
      {
        label: t('legal.title5'),
        altStartAdornment: 'social-media-guide',
        startAdornment: SosmedGuide,
        onClick: async (): Promise<void> => {
          try {
            await router.push('/faq-submenu/social-media-guide');
          } catch (error) {
            console.error('Error navigating to FAQ:', error);
          }
        },
        extraClasses: submenuClasses
      },
      {
        label: t('legal.title6'),
        altStartAdornment: 'circle-membership',
        startAdornment: CircleMembership,
        onClick: async (): Promise<void> => {
          try {
            await router.push('/faq-submenu/circle-membership');
          } catch (error) {
            console.error('Error navigating to FAQ:', error);
          }
        },
        extraClasses: submenuClasses
      }
    ],
    [submenuClasses]
  );

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const currentRoute =
    typeof window !== 'undefined' ? window.location.pathname : '';

  // Function to check if the menu is active
  const isMenuActive = useCallback(
    (label: string): boolean => {
      const menuRoute = `/faq-submenu/${label.toLowerCase().replace(' ', '-')}`;
      return currentRoute === menuRoute;
    },
    [currentRoute]
  );

  useEffect(() => {
    // Update the active menu after component is mounted
    const handleRouteChange = (): void => {
      const currentMenu = menus.find(menu =>
        isMenuActive(menu.altStartAdornment)
      );
      setActiveMenu(currentMenu?.altStartAdornment ?? null);

      if (
        currentRoute === '/faq-submenu' &&
        width !== undefined &&
        width >= 640
      ) {
        router.push('/faq-submenu/terms-condition').catch(error => {
          console.error('Error navigating:', error);
        });
      }
    };

    handleRouteChange(); // Initial check
    // Add event listener for future route changes
    router.events.on('routeChangeComplete', handleRouteChange);

    // Remove event listener on cleanup
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [isMenuActive, menus, currentRoute, width]);

  return (
    <PageGradient
      defaultGradient
      className="flex flex-col sm:flex-row gap-0 sm:gap-4"
    >
      <div
        className={`flex w-full sm:w-2/5
        ${
          currentRoute === '/faq-submenu'
            ? ''
            : width !== undefined && width < 640
            ? 'hidden'
            : ''
        }
        `}
      >
        <PageGradient
          defaultGradient
          className={`sm:relative sm:pb-20 overflow-hidden flex flex-col items-center w-full bottom-0   ${
            width !== undefined && width < 640 ? '' : 'absolute'
          }`}
        >
          <CardGradient
            defaultGradient
            className={`relative overflow-hidden flex flex-col items-center py-4 w-full sm:rounded-[18px] sm:min-h-[36rem] ${
              width !== undefined && width < 370
                ? 'w-[38rem]'
                : width !== undefined && width < 400
                ? 'w-[45rem]'
                : width !== undefined && width < 415
                ? 'w-[48rem]'
                : ''
            } bg-white`}
          >
            <div className="flex justify-start mx-2 md:mx-8 items-center mb-5 w-full">
              {/* -----Arrow Left----- */}
              <div className="ml-2 z-10">
                <button
                  onClick={() => {
                    if (width !== undefined && width < 640) {
                      router.back();
                      router.back();
                    } else {
                      router.back();
                    }
                  }}
                >
                  <Image
                    src={ArrowLeftBlack.src}
                    alt={ArrowLeftBlack.alt}
                    width={30}
                    height={30}
                    className="transition cursor-pointer ease-in-out hover:scale-150"
                  />
                </button>
              </div>
              {/* -----Title Centered----- */}
              <div className="flex-grow text-center mr-10">
                <h6 className="text-lg font-poppins font-semibold">Legal</h6>
              </div>
            </div>

            {/* -----Header----- */}
            <div className="z-10 lg:w-1/2 md:w-2/3 sm:w-[80%] w-full h-52 sm:px-0 px-6 mb-4">
              <div
                className={`flex flex-col justify-center items-center overflow-hidden  rounded-full ${
                  width !== undefined && width < 370 ? 'py-4' : ''
                } w-full h-full`}
              >
                {/* -----Image Container----- */}
                <div
                  className={`overflow-hidden mb-3 ${
                    width !== undefined && width <= 370
                      ? 'h-100 w-100'
                      : 'h-205 w-205'
                  }`}
                >
                  <Image
                    alt="avatar"
                    src={LegalSubmenu}
                    className="w-30 h-30 object-center object-cover"
                  />
                </div>
              </div>
            </div>

            {/* -----Submenus----- */}
            <div className="z-10 flex flex-col items-center w-full min-h-96 max-h-screen sm:px-0 px-6">
              {menus.map(menu => (
                <SubmenuButton
                  key={menu.label}
                  onClick={menu.onClick}
                  startAdornment={menu.startAdornment}
                  endAdornment={ArrowRightCollapseIcon}
                  label={menu.label}
                  altStartAdornment={menu.altStartAdornment}
                  extraClasses={`${menu.extraClasses}`}
                  style={{
                    color:
                      activeMenu === menu.altStartAdornment ? '#3AC4A0' : ''
                  }}
                />
              ))}
            </div>
          </CardGradient>
        </PageGradient>
      </div>
      <div className="flex w-full mx-auto sm:w-3/5">
        <div
          className={`z-0 sm:relative overflow-hidden flex flex-col items-center w-full bottom-0 h-auto`}
        >
          <div
            className={`z-1 relative overflow-hidden flex flex-col justify-center items-center sm:rounded-md w-full h-auto`}
          >
            {children}
          </div>
        </div>
      </div>
    </PageGradient>
  );
};

export default FaqSubmenu;
