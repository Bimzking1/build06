import { linkSSO } from '@/repository/auth.repository';
import { getUserProviders } from '@/repository/profile.repository';
import { fetchUserData } from '@/store/redux/features/user';
import { useAppDispatch, useAppSelector } from '@/store/redux/store';
import { Button, Typography } from '@material-tailwind/react';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import FormModalPassword from './FormModalPassword';

interface IAssociatedAccountButton {
  image: any;
  alternative: string;
  text: string;
  imageClassName: string;
  provider: string;
  handleOpen: () => void;
  openPassword: boolean;
  handleOpenPassword: () => void;
}

const AssociatedAccountButton: React.FC<IAssociatedAccountButton> = ({
  image,
  alternative,
  text,
  imageClassName,
  provider,
  handleOpen,
  openPassword,

  handleOpenPassword
}: IAssociatedAccountButton) => {
  const { data } = useSession();
  const { dataUser } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const [providerList, setProviderList] = useState<string[]>([]);

  const handleLoginSSO = async (): Promise<void> => {
    try {
      if (data !== null) {
        await linkSSO({
          identifier: data.accessToken,
          provider: data.provider
        });
        const providers = await getUserProviders();
        setProviderList(providers.data);
        await dispatch(fetchUserData());
      }
    } catch (error: any) {
      toast(error.response.data.message, { type: 'error' });
    }
  };

  useEffect(() => {
    handleLoginSSO()
      .then()
      .catch(() => {});
  }, [data]);
  return (
    <>
      <FormModalPassword
        open={openPassword}
        handleOpen={handleOpenPassword}
        provider={provider}
        setProviderList={setProviderList}
      />
      <Button
        onClick={async () => {
          if (dataUser.phoneNumber !== '' && dataUser.isPasswordExists) {
            if (providerList?.includes(provider)) {
              handleOpenPassword();
            } else {
              await signIn(provider);
            }
          } else {
            handleOpen();
          }
        }}
        className="flex gap-2 p-3 w-full items-center bg-transparent shadow-none hover:shadow-none border border-[#E9E9E9]"
      >
        <Image src={image} alt={alternative} className={`${imageClassName}`} />
        <div className="flex flex-col gap-1 w-full text-left">
          <Typography className="capitalize font-poppins font-semibold text-sm text-[#262626]">
            {text}
          </Typography>
          <Typography className="capitalize font-poppins font-light text-xs text-[#7C7C7C]">
            {providerList?.includes(provider) ? 'Linked' : 'Not Linked'}
          </Typography>
        </div>
        <Typography
          className={`capitalize font-poppins font-semibold text-sm ${
            providerList?.includes(provider)
              ? 'text-[#DD2525]'
              : 'text-[#4FE6AF]'
          }`}
        >
          {providerList?.includes(provider) ? 'Unlink' : 'Link'}
        </Typography>
      </Button>
    </>
  );
};

export default AssociatedAccountButton;
