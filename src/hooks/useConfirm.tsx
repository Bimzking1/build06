/* eslint-disable @typescript-eslint/explicit-function-return-type */
import QuizButton from '@/components/quiz/button.component';
import Modal from '@/components/ui/modal/Modal';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SeedyConfused from '../assets/play/quiz/seedy-confused.png';

const useConfirm = () => {
  const { t } = useTranslation();
  const [promise, setPromise] = useState<any>(null);

  const confirm = async () => {
    await new Promise((resolve, reject) => {
      setPromise({ resolve });
    });
  };
  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };
  // You could replace the Dialog with your library's version
  const ConfirmationDialog = () =>
    promise !== null ? (
      <Modal
        onClose={handleCancel}
        modalClasses="z-30 animate-slide-down fixed top-[35%] lg:left-[30%] mt-[-12.35rem] w-full lg:w-[40%] h-fit p-4 text-center rounded-3xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white"
      >
        <div className="w-full flex flex-col gap-6 justify-center items-center">
          <Image
            src={SeedyConfused}
            alt={'Confirm quit quiz'}
            width={200}
            height={200}
            className="object-contain w-80"
          />
          <div className="font-poppins text-center">
            <div className="text-lg text-neutral-medium font-semibold">
              {t('quiz.wantLeave')}
            </div>
            <div className="text-base text-neutral-soft mt-2">
              {t('quiz.dontGiveUp')}
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-3 w-full">
            <QuizButton
              title={t('quiz.cancel')}
              background="#FE4B60"
              darkBackground="#ED0F29"
              onClick={handleConfirm}
            />
            <QuizButton
              title={t('quiz.continue')}
              background="#67EB00"
              darkBackground="#4EC307"
              onClick={handleCancel}
            />
          </div>
        </div>
      </Modal>
    ) : // <Dialog open={promise !== null} fullWidth>
    //   <DialogTitle>{title}</DialogTitle>
    //   <DialogContent>
    //     <DialogContentText>{message}</DialogContentText>
    //   </DialogContent>
    //   <DialogActions>
    //     <Button onClick={handleConfirm}>Yes</Button>
    //     <Button onClick={handleCancel}>Cancel</Button>
    //   </DialogActions>
    // </Dialog>
    null;
  return [ConfirmationDialog, confirm];
};

export default useConfirm;
