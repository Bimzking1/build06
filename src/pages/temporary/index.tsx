import PageGradient from '@/components/ui/page-gradient/PageGradient';
import Footer from '@/containers/landing/Section6';
import Section1 from '@/containers/temporary/Section1';

export default function Home(): React.ReactElement {
  return (
    <>
      <PageGradient className="absolute overflow-hidden w-full">
        <Section1 />
        <Footer />
      </PageGradient>
    </>
  );
}
