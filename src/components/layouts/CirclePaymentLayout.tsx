import CardGradient from '@/components/ui/card/CardGradient';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
interface props {
  children: React.ReactNode;
}
const customGradient = (
  <>
    <span className="z-0 fixed bottom-10 -left-10 w-60 h-48 bg-seeds-green blur-[90px] rotate-45" />
    <span className="z-0 fixed bottom-0 left-0 w-24 h-24 bg-seeds-green blur-[90px]" />
    <span className="z-0 fixed -bottom-28 left-16 w-48 h-32 bg-seeds-purple-2 blur-[90px] rotate-45" />
    <span className="z-0 fixed top-64 -right-4 w-60 h-48 bg-seeds-green blur-[90px] rotate-45 rounded-full" />
    <span className="z-0 fixed bottom-36 right-0 w-32 h-32 bg-seeds-purple-2 blur-[90px] rotate-90 rounded-full" />
  </>
);

const CirclePaymentLayout: React.FC<props> = ({ children }) => {
  const width = useWindowInnerWidth();

  return (
    <PageGradient
      customGradient={customGradient}
      className="z-0 relative flex flex-col items-center"
    >
      <CardGradient
        defaultGradient={width !== undefined && width > 640}
        extraClasses={`w-[100%] sm:rounded-[18px] h-fit bg-white sm:p-6 py-6 mb-10`}
      >
        {children}
      </CardGradient>
    </PageGradient>
  );
};

export default CirclePaymentLayout;
