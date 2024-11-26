/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Router from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useOnLeavePageConfirmation = (unsavedChanges: boolean) => {
  const { t } = useTranslation();

  useEffect(() => {
    // For reloading.
    window.onbeforeunload = () => {
      if (unsavedChanges) {
        return 'You have unsaved changes. Do you really want to leave?';
      }
    };

    // For changing in-app route.
    if (unsavedChanges) {
      const routeChangeStart = () => {
        const ok = confirm(t('quiz.wantLeave') ?? 'Are you sure want to quit?');
        if (!ok) {
          Router.events.emit('routeChangeError');
        }
      };

      Router.events.on('routeChangeStart', routeChangeStart);
      return () => {
        Router.events.off('routeChangeStart', routeChangeStart);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unsavedChanges]);
};
