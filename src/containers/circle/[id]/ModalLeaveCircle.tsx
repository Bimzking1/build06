import FinalModalCircle from '@/components/circle/FinalModalCircle';
import { errorCircle, successCircleSetting } from '@/constants/assets/icons';
import { leaveCircle } from '@/repository/circle.repository';
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

const ModalLeaveCircle: React.FC<props> = ({ open, handleOpen, circleId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [responseApi, setResponseApi] = useState('');
  const { t } = useTranslation();

  const handleSubmit = async (): Promise<void> => {
    try {
      setIsLoading(true);
      leaveCircle(circleId)
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
          title="Successfully leaving the Circle"
          subtitle="Please join other interesting circles"
          imageUrl={successCircleSetting.src}
          handleOpen={handleSubmit}
          error={false}
        />
      ) : responseApi === 'failed' ? (
        <FinalModalCircle
          button="Try Again"
          title="Failed to leave the circle"
          subtitle="The owner cannot leave the circle"
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
        <DialogHeader className="flex justify-between items-center p-2">
          <p></p>
          <XMarkIcon
            className="cursor-pointer"
            onClick={handleOpen}
            width={30}
            height={30}
          />
        </DialogHeader>

        <DialogBody className="p-4">
          <Typography className="text-base font-semibold text-black text-center">
            {t('circleSetting.leaveCircle.title')}
          </Typography>
          <Typography className="text-sm font-normal text-center mt-2 mx-3 lg:mx-10">
            {t('circleSetting.leaveCircle.subtitle')}
          </Typography>
        </DialogBody>

        <DialogFooter className="flex flex-row sm:flex-row justify-center p-4">
          <Button
            onClick={handleOpen}
            color="purple"
            variant="outlined"
            className="rounded-full text-sm font-semibold mr-3"
          >
            {t('circleSetting.leaveCircle.button1')}
          </Button>

          <Button
            onClick={handleSubmit}
            className="rounded-full text-sm font-semibold bg-[#DD2525]"
          >
            {isLoading
              ? 'Loading...'
              : `${t('circleSetting.leaveCircle.button2')}`}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default ModalLeaveCircle;
