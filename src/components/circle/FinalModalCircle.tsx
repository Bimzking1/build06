import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface props {
  handleOpen: any;
  title: string;
  subtitle: string;
  button: string;
  imageUrl: string;
  error: boolean;
  redirect?: string;
}

const FinalModalCircle: React.FC<props> = ({
  handleOpen,
  title,
  subtitle,
  button,
  imageUrl,
  error,
  redirect = '/connect'
}) => {
  const router = useRouter();

  return (
    <Dialog
      open={true}
      handler={handleOpen}
      className="max-w-full w-[90%] md:w-[50%] lg:w-[40%]"
    >
      <DialogHeader className="flex justify-between items-center p-2">
        <p></p>
        <XMarkIcon
          className="cursor-pointer"
          onClick={() => {
            void router.push(redirect);
          }}
          width={30}
          height={30}
        />
      </DialogHeader>

      <DialogBody>
        <div className="flex flex-col text-center items-center justify-center md:mx-18">
          <Image
            alt=""
            src={imageUrl}
            height={0}
            width={0}
            className="mt-10 h-1/2 w-1/2"
          />

          <Typography className="text-base font-semibold mb-1 mt-5 md:lg lg:text-xl text-black">
            {title}
          </Typography>
          <Typography className="text-sm font-normal mb-7 leading-7 md:leading-5 md:text-base lg:text-lg text-[#7C7C7C]">
            {subtitle}
          </Typography>

          <Button
            className="text-xs font-semibold w-[70%] mb-5 rounded-full lg:text-base"
            style={{ backgroundColor: error ? '#DA2D1F' : '#3AC4A0' }}
            onClick={() => {
              void router.push(redirect);
            }}
          >
            {button}
          </Button>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default FinalModalCircle;
