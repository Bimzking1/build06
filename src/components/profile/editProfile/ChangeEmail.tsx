import ChangeEmailEdit from '@/assets/my-profile/editProfile/ChangeEmailEdit.svg';
import CloseEditProfile from '@/assets/my-profile/editProfile/CloseEditProfile.svg';
import FailedEmail from '@/assets/my-profile/editProfile/FailedEmail.svg';
import VerifyEmail from '@/assets/my-profile/editProfile/VerifyEmail.svg';
import { checkEmail } from '@/repository/auth.repository';
import { editUserInfo } from '@/repository/profile.repository';
import {
  Button,
  Card,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowBackwardIcon } from 'public/assets/vector';
import { useState } from 'react';

interface Form {
  form: any;
  setForm: any;
  select: any;
}

const ChangeEmail: React.FC<Form> = ({ form, setForm, select }: Form) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const handleOpen = (): void => {
    setOpen(!open);
  };
  const handleError = (): void => {
    setError(!error);
  };
  const changeData = (e: any): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await checkEmail(form.email);
      handleOpen();
      const updatedForm: any = { ...form };
      await editUserInfo(updatedForm);
    } catch (error: any) {
      handleError();
      console.error(error.response.data.message);
    }
  };
  return (
    <div className={`${select === 1 ? 'flex' : 'hidden'} justify-center`}>
      <Card className="flex items-center w-[947px] h-[721px] py-5">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-between items-center w-[600px] h-full p-4"
        >
          <Link
            href="/my-profile/edit-profile"
            className="absolute left-8 cursor-pointer"
          >
            <Image src={ArrowBackwardIcon} alt="arrow-backward-icon" />
          </Link>

          <div className="flex flex-col items-center gap-8 w-full">
            <Typography className="font-poppins font-semibold text-[#262626] text-base text-center">
              Change Email Address <br />
              <span className="font-poppins font-normal text-sm text-[#7C7C7C] text-center">
                All information from Seeds will be moved to your new email
                address.
              </span>
            </Typography>
            <Image src={ChangeEmailEdit} alt="ChangeEmailEdit" />
            <Input
              label="Your New Email"
              name="email"
              value={form.email}
              onChange={changeData}
              variant="static"
              labelProps={{
                className:
                  '!text-base !text-[#262626] !font-semibold !font-poppins'
              }}
              className="!text-[#7C7C7C] !text-base !font-poppins !font-normal"
              required
            />
          </div>
          <Button
            className="capitalize w-full rounded-full font-poppins font-semibold text-sm bg-[#3AC4A0]"
            type="submit"
          >
            Change
          </Button>
        </form>
      </Card>
      <Dialog
        open={open}
        handler={handleOpen}
        size="xs"
        className="flex flex-col items-center gap-6 py-6 px-4"
      >
        <DialogHeader className="self-end cursor-pointer p-0">
          <Image
            src={CloseEditProfile}
            alt="CloseEditProfile"
            onClick={handleOpen}
          />
        </DialogHeader>
        <DialogBody className="flex flex-col items-center gap-4 p-0">
          <Image src={VerifyEmail} alt="VerifyEmail" />
          <Typography className="font-poppins font-bold text-sm text-[#262626]">
            Verify Your Email
          </Typography>
          <Typography className="font-poppins font-normal text-sm text-[#7C7C7C]">
            Please check your email
          </Typography>
        </DialogBody>
        <DialogFooter className="p-0 w-full">
          <Button
            onClick={handleOpen}
            className="font-poppins font-semibold text-sm capitalize bg-[#3AC4A0] rounded-full w-full"
          >
            Check Email
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog
        open={error}
        handler={handleError}
        size="xs"
        className="flex flex-col items-center gap-6 py-6 px-4"
      >
        <DialogHeader className="self-end cursor-pointer p-0">
          <Image
            src={CloseEditProfile}
            alt="CloseEditProfile"
            onClick={handleError}
          />
        </DialogHeader>
        <DialogBody className="flex flex-col items-center gap-4 p-0">
          <Image src={FailedEmail} alt="FailedEmail" />
          <Typography className="font-poppins font-bold text-sm text-[#262626] text-center">
            Change Email Failed
          </Typography>
          <Typography className="font-poppins font-normal text-sm text-[#7C7C7C] text-center">
            Requested email already exists or there was an issue changing your
            email.
          </Typography>
        </DialogBody>
        <DialogFooter className="p-0 w-full">
          <Button
            onClick={handleError}
            className="font-poppins font-semibold text-sm capitalize bg-[#DD2525] rounded-full w-full"
          >
            Try again
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ChangeEmail;
