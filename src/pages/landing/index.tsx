// import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import Section1 from '@/containers/landing-page/Section1';
import Section10 from '@/containers/landing-page/Section10';
import Section11 from '@/containers/landing-page/Section11';
import Section12 from '@/containers/landing-page/Section12';
import Section2 from '@/containers/landing-page/Section2';
import Section3 from '@/containers/landing-page/Section3';
import Section4 from '@/containers/landing-page/Section4';
import Section5 from '@/containers/landing-page/Section5';
import Section6 from '@/containers/landing-page/Section6';
import Section7 from '@/containers/landing-page/Section7';
import Section8 from '@/containers/landing-page/Section8';
import Section9 from '@/containers/landing-page/Section9';

import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

export default function Landing(): React.ReactElement {
  // const { t } = useTranslation();
  const customGradient = (
    <>
      <span className="-z-10 absolute bottom-10 -left-10 w-60 h-48 bg-seeds-green-2 blur-[90px] rotate-45" />
      <span className="-z-10 absolute bottom-0 left-0 w-24 h-24 bg-seeds-green-2 blur-[90px]" />
      <span className="-z-10 absolute -bottom-28 left-16 w-48 h-32 bg-seeds-purple-2 blur-[90px] rotate-45" />
      <span className="-z-10 absolute top-64 -right-4 w-60 h-48 bg-seeds-green-2 blur-[90px] rotate-45 rounded-full" />
      <span className="-z-10 absolute bottom-36 right-0 w-32 h-32 bg-seeds-purple-2 blur-[90px] rotate-90 rounded-full" />
    </>
  );

  // return (
  //   <AuthLayout>
  //     <>
  //       <LanguageSwitcher />
  //       {t('greeting', { name: 'Seeds!' })}
  //     </>
  //   </AuthLayout>
  // );

  return (
    <>
      {/* <Header /> */}
      <PageGradient
        customGradient={customGradient}
        className="absolute overflow-hidden w-full"
      >
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
        <Section5 />
        <Section6 />
        <Section7 />
        <Section8 />
        <Section9 />
        <Section10 />
        <Section11 />
        <Section12 />
        <Footer />
      </PageGradient>
    </>
  );
}
