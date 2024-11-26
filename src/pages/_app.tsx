'use client';
import BattleLayout from '@/components/layouts/BattleLayout';
import Header from '@/components/layouts/Header';
import LoginLayout from '@/components/layouts/LoginLayout';
import ErrorBEProvider from '@/store/error-be/ErrorBEProvider';
import LanguageProvider from '@/store/language/LanguageProvider';
import LoadingProvider from '@/store/loading/LoadingProvider';
import { persistor, store } from '@/store/redux/store';
import SuccessProvider from '@/store/success/SuccessProvider';
import '@/styles/globals.css';
import '@/utils/common/i18n';
import { ThemeProvider } from '@material-tailwind/react';
import { TrackingHeadScript } from '@phntms/next-gtm';
import type { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: JSX.Element) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const pathsWithoutHeader = [
  '',
  'auth',
  'story-boarding',
  'term-condition',
  'social'
];

function App({
  Component,
  pageProps,
  router
}: AppPropsWithLayout): JSX.Element {
  const GA_TRACKING_ID =
    process.env.NEXT_PUBLIC_GA_TRACKING_ID ?? 'GTM-MZMFZB8D';
  const getLayout = Component.getLayout ?? (page => page);

  const path = useRouter().pathname.split('/')[1];

  const renderHeader =
    !pathsWithoutHeader.includes(path) && !path.includes('_error');

  const loginLayouts =
    router.pathname.startsWith('/homepage') ||
    router.pathname.startsWith('/social') ||
    router.pathname.startsWith('/connect') ||
    router.pathname.startsWith('/play') ||
    router.pathname.startsWith('/academy') ||
    router.pathname.startsWith('/user-setting') ||
    router.pathname.startsWith('/my-profile') ||
    router.pathname.startsWith('/chat') ||
    router.pathname.startsWith('/faq') ||
    router.pathname.startsWith('/withdrawal') ||
    router.pathname.startsWith('/microsite-quiz');
  const baseUrl =
    process.env.NEXT_PUBLIC_DOMAIN ?? 'https://user-dev-gcp.seeds.finance';
  if (loginLayouts) {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <TrackingHeadScript id={GA_TRACKING_ID} isGTM={true} />
          <iframe
            src={`${baseUrl}/assets/quiz/sound/silent.mp3`}
            allow="autoplay"
            id="audio"
            style={{ display: 'none' }}
          ></iframe>
          <LanguageProvider>
            <LoadingProvider>
              <ErrorBEProvider>
                <SessionProvider session={pageProps.session}>
                  {router.pathname.startsWith('/microsite-quiz') ? (
                    <>
                      {getLayout(<Component {...pageProps} />)}
                      <ToastContainer />
                    </>
                  ) : router.pathname.startsWith('/play/team-battle') ? (
                    <BattleLayout>
                      {getLayout(<Component {...pageProps} />)}
                      <ToastContainer />
                    </BattleLayout>
                  ) : (
                    <LoginLayout>
                      {getLayout(<Component {...pageProps} />)}
                      <ToastContainer />
                    </LoginLayout>
                  )}
                </SessionProvider>
              </ErrorBEProvider>
            </LoadingProvider>
          </LanguageProvider>
        </PersistGate>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TrackingHeadScript id={GA_TRACKING_ID} isGTM={true} />
        <LanguageProvider>
          <LoadingProvider>
            <ErrorBEProvider>
              <SuccessProvider>
                <SessionProvider session={pageProps.session}>
                  {renderHeader && <Header className={`-mt-20`} />}
                  <ThemeProvider>
                    {getLayout(<Component {...pageProps} />)}
                    <ToastContainer />
                  </ThemeProvider>
                </SessionProvider>
              </SuccessProvider>
            </ErrorBEProvider>
          </LoadingProvider>
        </LanguageProvider>
        <ToastContainer />
      </PersistGate>
    </Provider>
  );
}

export default appWithTranslation(App);
