import { SuccessPinImage } from '@/constants/assets/icons';
import {
  Button,
  Dialog,
  DialogBody,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const ModalSuccess = (): JSX.Element => {
  const router = useRouter();

  const handleOpen = (): void => {};

  return (
    <Dialog
      open={true}
      handler={handleOpen}
      className="max-w-full w-[90%] md:w-[50%] lg:w-[40%] bg-[#3AC4A0] rounded-lg"
    >
      <DialogBody className="p-4 sm:p-8">
        <div className="flex flex-col text-center items-center justify-center md:mx-18">
          <Typography className="text-xl font-semibold text-white text-center mx-12 md:mx-24 lg:mx-36">
            You have successfully create your PIN
          </Typography>
          <Typography className="text-sm font-normal text-white text-center mx-12 md:mx-24 lg:mx-36">
            {`Don't forget your PIN, OK?`}
          </Typography>
          <Image
            alt=""
            src={SuccessPinImage.src}
            height={0}
            width={0}
            className="mt-10 h-1/2 w-1/2"
          />
          <Button
            className="text-xs mt-4 font-semibold w-[70%] mb-5 bg-[#7555DA] rounded-full lg:text-base"
            onClick={() => {
              void router.push('/user-setting');
            }}
          >
            OK
          </Button>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default ModalSuccess;
