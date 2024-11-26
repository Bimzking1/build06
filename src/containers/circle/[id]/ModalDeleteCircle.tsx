import FinalModalCircle from '@/components/circle/FinalModalCircle';
import { errorCircle, successCircleSetting } from '@/constants/assets/icons';
import { deleteCircle } from '@/repository/circle.repository';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography
} from '@material-tailwind/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface props {
  open: any;
  handleOpen: any;
  circleId: string;
}

const ModalDeleteCircle: React.FC<props> = ({ open, handleOpen, circleId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [responseApi, setResponseApi] = useState('');
  const { t } = useTranslation();

  const handleSubmit = async (): Promise<void> => {
    try {
      setIsLoading(true);
      deleteCircle(circleId)
        .then(res => {
          setResponseApi('success');
          setIsLoading(false);
        })
        .catch(err => {
          setIsLoading(false);
          setResponseApi('failed');
          console.log(err);
        });
    } catch (error: any) {
      setIsLoading(false);
      console.error('Error fetching circle data:', error.message);
    }
  };

  return (
    <>
      {responseApi === 'success' ? (
        <FinalModalCircle
          button="Done"
          title="Circle has been deleted"
          subtitle="Please join other interesting circles"
          imageUrl={successCircleSetting.src}
          handleOpen={handleSubmit}
          error={false}
        />
      ) : responseApi === 'failed' ? (
        <FinalModalCircle
          button="Try Again"
          title="Failed to delete the circle"
          subtitle="Please make sure that you are a circle owner."
          imageUrl={errorCircle.src}
          handleOpen={handleSubmit}
          error={true}
        />
      ) : null}

      <Dialog
        open={open}
        handler={handleOpen}
        className="max-w-full w-[90%] md:w-[50%] lg:w-[40%]"
      >
        <DialogHeader className="flex justify-between items-center p-2 sm:p-4">
          <p></p>
          <XMarkIcon
            className="cursor-pointer"
            onClick={handleOpen}
            width={30}
            height={30}
          />
        </DialogHeader>

        <DialogBody className="p-4 sm:p-8">
          <Typography className="text-base font-semibold text-black text-center">
            {t('circleSetting.deleteCircle.popUpDelete.title')}
          </Typography>
          <Typography className="text-sm font-normal text-center mt-2 mx-3 lg:mx-10">
            {t('circleSetting.deleteCircle.popUpDelete.subtitle1')}
          </Typography>
          <Typography className="text-sm font-normal text-center mx-3 lg:mx-10">
            {t('circleSetting.deleteCircle.popUpDelete.subtitle2')}
          </Typography>
        </DialogBody>

        <DialogFooter className="flex flex-row sm:flex-row justify-center p-4 sm:p-8">
          <Button
            onClick={handleOpen}
            color="purple"
            variant="outlined"
            className="rounded-full text-sm font-semibold mr-3"
          >
            {t('circleSetting.deleteCircle.popUpDelete.button1')}
          </Button>

          <Button
            onClick={handleSubmit}
            className="rounded-full text-sm font-semibold bg-[#DD2525]"
          >
            {isLoading
              ? 'Loading...'
              : `${t('circleSetting.deleteCircle.popUpDelete.button2')}`}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default ModalDeleteCircle;
