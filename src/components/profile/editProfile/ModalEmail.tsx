import CloseEditProfile from '@/assets/my-profile/editProfile/CloseEditProfile.svg';
import EmailEditProfile from '@/assets/my-profile/editProfile/EmailEditProfile.svg';

import {
  Button,
  Dialog,
  DialogBody,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';

interface ModalEmail {
  open: boolean;
  handleOpen: any;
  email: string;
}

const ModalEmailEdit: React.FC<ModalEmail> = ({
  open,
  handleOpen,
  email
}: ModalEmail) => {
  const newEmail = `${email.slice(0, 2)}**${email.split('@')[0].slice(-1)}@${
    email.split('@')[1]
  }`;
  return (
    <Dialog size="xs" open={open} handler={handleOpen} className="px-4 py-6">
      <DialogBody className="flex flex-col items-center p-0 gap-6">
        <Image
          src={CloseEditProfile}
          alt="CloseEditProfile"
          className="self-end cursor-pointer"
          onClick={handleOpen}
        />
        <Image src={EmailEditProfile} alt="EmailEditProfile" />
        <Typography className="font-poppins font-semibold text-[#262626] text-base text-center">
          Your Email : {newEmail} <br />
          <span className="font-poppins font-normal text-sm text-[#7C7C7C]">
            We&apos;ll give you some information through email.
          </span>
        </Typography>
        <Link href={`edit-profile/change-email`}>
          <Button
            onClick={handleOpen}
            className="capitalize rounded-full w-full font-poppins font-semibold text-sm bg-[#3AC4A0]"
          >
            Change Email
          </Button>
        </Link>
      </DialogBody>
    </Dialog>
  );
};

export default ModalEmailEdit;
