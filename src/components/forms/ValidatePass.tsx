import ChangePassEdit from '@/assets/my-profile/editProfile/ChangePassEdit.svg';
import Eye from '@/assets/my-profile/editProfile/Eye.svg';
import EyeSlash from '@/assets/my-profile/editProfile/EyeSlash.svg';
import { Button, Card, Input, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
interface VariablePass {
  className: any;
  setForm: any;
  form: any;
  setSelect: any;
}

const ValidatePass: React.FC<VariablePass> = ({
  className,
  setForm,
  form,
  setSelect
}: VariablePass) => {
  const [open, setOpen] = useState(false);
  const changeData = (e: any): void => {
    const updatedForm = { ...form, [e.target.name]: e.target.value };
    setForm(updatedForm);
  };
  return (
    <div className={`${className as string} justify-center`}>
      <Card className="flex items-center w-[947px] h-[721px] py-5">
        <div className="flex flex-col justify-between items-center w-[600px] h-full p-4">
          <div className="flex flex-col items-center gap-8 w-full">
            <Typography className="font-poppins font-semibold text-[#262626] text-base text-center">
              Input Password <br />
              <span className="font-poppins font-normal text-sm text-[#7C7C7C] text-center">
                Please input your password
              </span>
            </Typography>
            <Image src={ChangePassEdit} alt="ChangePassEdit" />
            <div className="relative w-full">
              <Input
                label="Password"
                name="password"
                value={form.password}
                onChange={changeData}
                placeholder="Please input your password"
                variant="static"
                type={open ? 'text' : 'password'}
                labelProps={{
                  className:
                    '!text-base !text-[#262626] !font-semibold !font-poppins'
                }}
                className="!text-[#262626] !text-base !font-poppins !font-normal"
              />
              <Image
                src={open ? Eye : EyeSlash}
                alt="EyePassword"
                className="absolute right-0 bottom-[9px]"
                onClick={() => {
                  setOpen(!open);
                }}
              />
            </div>
            <Link
              href="/auth/forgot-password"
              className="font-poppins font-semibold text-xs text-[#3AC4A0] self-end"
            >
              Forgot Password?
            </Link>
          </div>
          <Button
            className="capitalize w-full rounded-full font-poppins font-semibold text-sm bg-[#3AC4A0] disabled:text-[#7C7C7C] disabled:bg-[#BDBDBD]"
            onClick={() => {
              setSelect(1);
            }}
            disabled={form.password === ''}
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ValidatePass;
