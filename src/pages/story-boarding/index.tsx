import Container from '@/components/Container';
import ReactSlick from '@/components/ReactSlick';
import common from '@/utils/common';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Login(): React.ReactElement {
  const { t } = useTranslation();
  const data = common._static.onboardingSlideAssets(t);
  return (
    <div>
      <Container>
        <div className=" lg:px-24 w-full">
          <ReactSlick data={data} />
        </div>
        <div>
          <div className="w-full flex justify-center mt-16">
            <Link className="w-full flex justify-center" href="/">
              <div className="lg:w-1/2 w-3/4 text-center bg-seeds-purple cursor-pointer rounded-full text-white py-2 text-md font-medium tracking-wider">
                {t('button.BTN_GUEST')}
              </div>
            </Link>
          </div>
          <div className="mt-8 text-sm text-center">
            <span className="font-normal">{t('authPage.agreement')}</span>
            <div className="cursor-pointer">
              <div className="flex text-center items-center justify-center">
                <span className="text-seeds-button-green ml-1 font-medium">
                  <Link href="/term-condition">{t('authPage.tnC')}</Link>
                </span>
                <span className="font-sm ml-1">Seeds</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center mt-8">
          <Link href="auth/login">
            <div className="px-10 lg:px-16 py-2 cursor-pointer mr-3 bg-opacity-0 text-center bg-white rounded-full border-seeds-button-green border text-seeds-button-green text-md font-medium tracking-wider">
              {t('button.BTN_LOGIN')}
            </div>
          </Link>
          <Link href="auth/register">
            <div className="px-10 lg:px-16 py-2 cursor-pointer ml-3 text-center bg-seeds-button-green rounded-full text-white text-md font-medium tracking-wider">
              {t('button.BTN_REGISTER')}
            </div>
          </Link>
        </div>
      </Container>
    </div>
  );
}
