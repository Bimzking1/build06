import { withRouter, type NextRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import InputPin from '@/components/InputPin';
import PageGradient from '@/components/ui/page-gradient/PageGradient';

interface ConfirmNewPinProps {
  router: NextRouter;
}

const ConfirmNewPinPage: React.FC<ConfirmNewPinProps> = ({ router }) => {
  const { t } = useTranslation();

  const cancelHandler = (): void => {
    router.back();
  };

  return (
    <PageGradient
      defaultGradient
      className="z-0 sm:relative absolute overflow-hidden flex flex-col items-center w-full bottom-0"
    >
      <InputPin
        onCancel={cancelHandler}
        action={router.query.action as string}
        title={t('inputPin.title.confirmNewPin')}
      />
    </PageGradient>
  );
};

export default withRouter(ConfirmNewPinPage);