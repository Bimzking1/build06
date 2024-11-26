import { withRouter, type NextRouter } from 'next/router';

import InputPin from '@/components/InputPin';
import PageGradient from '@/components/ui/page-gradient/PageGradient';

interface InputSeedsPinProps {
  router: NextRouter;
}

const InputSeedsPinPage: React.FC<InputSeedsPinProps> = ({ router }) => {
  const cancelHandler = (): void => {
    router.back();
  };

  // todo: jangan lupa wrap PageGradient dengan context yang menyimpan API onContinue.
  return (
    <PageGradient
      defaultGradient
      className="sm:relative absolute overflow-hidden flex flex-col items-center w-full bottom-0"
    >
      <InputPin
        onCancel={cancelHandler}
        action={router.query.action as string}
      />
    </PageGradient>
  );
};

export default withRouter(InputSeedsPinPage);
