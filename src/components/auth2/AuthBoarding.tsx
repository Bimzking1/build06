import withRedirect from '@/helpers/withRedirect';
import { Button, Typography } from '@material-tailwind/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  className: string;
}

const AuthBoarding: React.FC<Props> = ({ className }: Props) => {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    window.localStorage.removeItem('isGuest');
    window.localStorage.removeItem('isBannerOpen');
  }, []);

  return (
    <div className={`flex flex-col items-center gap-8 ${className}`}>
      <Button
        onClick={async () => {
          await withRedirect(router, router.query, '/auth/guest');
        }}
        className="font-semibold font-poppins text-base text-[#3AC4A0] bg-white border border-2 border-[#3AC4A0] rounded-full normal-case p-3.5 sm:px-20 sm:w-full w-full"
      >
        {t('authBoarding.guest')}
      </Button>
      <Typography className="text-center font-normal font-poppins md:text-lg sm:text-base text-sm text-[#262626]">
        {t(`authBoarding.term`)}
        <br />
        <Link href={'/term-condition'} className="text-[#3AC4A0]">
          {t(`authBoarding.term2`)}
        </Link>
      </Typography>
      <Button
        onClick={async () => {
          await withRedirect(router, router.query, '/auth/verification');
        }}
        className="font-semibold font-poppins text-base text-white bg-[#3AC4A0] rounded-full normal-case p-3.5 sm:px-20 sm:w-full w-full"
      >
        {t('authBoarding.login')}
      </Button>
    </div>
  );
};

export default AuthBoarding;
