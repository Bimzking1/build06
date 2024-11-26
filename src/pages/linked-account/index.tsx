'use client';
import ConfirmPinPopUp from '@/components/popup/ConfirmPinPopUp';
import DeleteAccountPopUp from '@/components/popup/DeleteAccount';
import DeleteAccountReasonPopUp from '@/components/popup/DeleteAccountReason';
import RemoveLinkedAccountPopUp from '@/components/popup/RemoveAccount';
import CardGradient from '@/components/ui/card/CardGradient';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import {
  AppleBrand,
  FacebookBrand,
  GoogleBrand
} from '@/constants/assets/logo';
import withAuth from '@/helpers/withAuth';
import { getUserProviders } from '@/repository/user.repository';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const LinkedAccount: React.FC = () => {
  // const { data: session }: any = useSession();

  const [removeGoogleModalShown, setRemoveGoogleModalShown] =
    useState<boolean>(false);
  const [removeAppleModalShown, setRemoveAppleModalShown] =
    useState<boolean>(false);
  const [removeFacebookModalShown, setRemoveFacebookModalShown] =
    useState<boolean>(false);
  const [deleteModalShown, setDeleteModalShown] = useState<boolean>(false);
  const [, setLinkProvider] = useState<string>('');
  const [deleteReasonModalShown, setDeleteReasonModalShown] =
    useState<boolean>(false);
  const [userProviders, setUserProviders] = useState<string[]>([]);
  const [confirmPinModalShown, setConfirmPinModalShown] = useState(false);

  const continueHandler = (pin: string): void => {
    // localStorage.setItem('pin', pin),
  };

  useEffect(() => {
    const fetchUserProviders = async (): Promise<void> => {
      try {
        const userProviders: any = await getUserProviders();
        setUserProviders(userProviders.data);
      } catch (error: any) {
        console.error('Error fetching user providers:', error.message);
      }
    };
    fetchUserProviders()
      .then()
      .catch(() => {});
  }, []);

  // const handleLoginProvider = (provider: string): void => {
  //   signIn(provider)
  //     .then(result => {
  //       if (result?.error != null) {
  //         console.error(result.error);
  //       } else if (provider !== '') {
  //         localStorage.setItem('provider', provider);
  //       }
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // };

  // useEffect(() => {
  //   const handleLinkedAccount = async (): Promise<void> => {
  //     if (session?.access_token) {
  //       const response = await linkAccount(session.access_token);
  //       console.log(response);
  //     }
  //   };
  //   handleLinkedAccount()
  //     .then()
  //     .catch(() => {});
  // }, [session?.access_token]);

  // console.log(session)g

  return (
    <PageGradient defaultGradient className="w-full">
      {confirmPinModalShown && (
        <ConfirmPinPopUp
          continueHandler={continueHandler}
          onClose={() => {
            setConfirmPinModalShown(prev => !prev);
          }}
          title="Please enter your PIN to Continue"
        />
      )}
      {deleteModalShown && (
        <DeleteAccountPopUp
          onClose={() => {
            setDeleteModalShown(prev => !prev);
          }}
        />
      )}
      {deleteReasonModalShown && (
        <DeleteAccountReasonPopUp
          onClose={() => {
            setDeleteReasonModalShown(prev => !prev);
          }}
        />
      )}
      <div className="flex justify-center items-center">
        <CardGradient
          defaultGradient
          className="relative overflow-hidden w-full sm:w-[90%] sm:rounded-[18px] sm:h-[36rem] h-[44rem] bg-white mt-20"
        >
          <div className="flex flex-col justify-center items-center">
            <Typography className="text-xl font-bold text-black mt-5">
              Linked Account
            </Typography>
            <div className="md:w-1/2 px-4 md:px-0 flex flex-col gap-5 mt-10">
              <Typography>Accounts</Typography>
              <div className="flex flex-col gap-5">
                <div className="flex gap-2 justify-between outline-gray-300 rounded-xl  outline hover:shadow-xl transition ease-in-out hover:scale-105 bg-white z-10 p-2">
                  <div className="flex gap-2">
                    <Image
                      src={GoogleBrand.src}
                      alt={GoogleBrand.alt}
                      width={20}
                      height={20}
                      className="w-auto h-auto aspect-square"
                    />
                    <div className="">
                      <Typography className="text-black  text-lg font-bold">
                        Google Account
                      </Typography>
                      <Typography className="text-gray-500">
                        {userProviders?.find(el => el === 'google') !==
                        undefined
                          ? 'Linked'
                          : "You haven't linked this account"}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center ">
                    {userProviders?.find(el => el === 'google') !==
                    undefined ? (
                      <>
                        <Typography
                          variant="h2"
                          className="font-bold hover:text-lg cursor-pointer text-red-600"
                          onClick={() => {
                            setRemoveGoogleModalShown(prev => !prev);
                          }}
                        >
                          Remove
                        </Typography>
                        {removeGoogleModalShown && (
                          <RemoveLinkedAccountPopUp
                            onClose={() => {
                              setRemoveGoogleModalShown(prev => !prev);
                            }}
                            provider={'Google'}
                          />
                        )}
                      </>
                    ) : (
                      <Typography
                        variant="h2"
                        className="font-bold hover:text-lg cursor-pointer text-seeds-button-green"
                        onClick={() => {
                          setConfirmPinModalShown(prev => !prev);
                          setLinkProvider('google');
                          localStorage.setItem('provider', 'google');
                        }}
                      >
                        Add
                      </Typography>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 justify-between outline-gray-300 rounded-xl hover:shadow-xl transition ease-in-out hover:scale-105 outline bg-white z-10 p-2">
                  <div className="flex gap-2">
                    <Image
                      src={AppleBrand.src}
                      alt={AppleBrand.alt}
                      width={20}
                      height={20}
                      className="w-auto h-auto aspect-square"
                    />
                    <div>
                      <Typography className="text-black text-lg font-bold">
                        Apple Account
                      </Typography>
                      <Typography className="text-gray-500">
                        {userProviders?.find(el => el === 'apple') !== undefined
                          ? 'Linked'
                          : "You haven't linked this account"}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center ">
                    {userProviders?.find(el => el === 'apple') !== undefined ? (
                      <>
                        <Typography
                          variant="h2"
                          className="font-bold hover:text-lg cursor-pointer text-red-600"
                          onClick={() => {
                            setRemoveAppleModalShown(prev => !prev);
                          }}
                        >
                          Remove
                        </Typography>
                        {removeAppleModalShown && (
                          <RemoveLinkedAccountPopUp
                            onClose={() => {
                              setRemoveAppleModalShown(prev => !prev);
                            }}
                            provider={'Apple'}
                          />
                        )}
                      </>
                    ) : (
                      <Typography
                        variant="h2"
                        className="font-bold hover:text-lg cursor-pointer text-seeds-button-green"
                        onClick={() => {
                          setConfirmPinModalShown(prev => !prev);
                        }}
                      >
                        Add
                      </Typography>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 justify-between outline-gray-300 rounded-xl hover:shadow-xl transition ease-in-out hover:scale-105 outline bg-white z-10 p-2">
                  <div className="flex gap-2">
                    <Image
                      src={FacebookBrand.src}
                      alt={FacebookBrand.alt}
                      width={20}
                      height={20}
                      className="w-auto h-auto aspect-square"
                    />
                    <div>
                      <Typography className="text-black text-lg font-bold">
                        Facebook Account
                      </Typography>
                      <Typography className="text-gray-500">
                        {userProviders?.find(el => el === 'facebook') !==
                        undefined
                          ? 'Linked'
                          : "You haven't linked this account"}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center ">
                    {userProviders?.find(el => el === 'facebook') !==
                    undefined ? (
                      <>
                        <Typography
                          variant="h2"
                          className="font-bold hover:text-lg cursor-pointer text-red-600"
                          onClick={() => {
                            setRemoveFacebookModalShown(prev => !prev);
                          }}
                        >
                          Remove
                        </Typography>
                        {removeFacebookModalShown && (
                          <RemoveLinkedAccountPopUp
                            onClose={() => {
                              setRemoveFacebookModalShown(prev => !prev);
                            }}
                            provider={'Facebook'}
                          />
                        )}
                      </>
                    ) : (
                      <Typography
                        variant="h2"
                        className="font-bold hover:text-lg cursor-pointer text-seeds-button-green"
                        onClick={() => {
                          setConfirmPinModalShown(prev => !prev);
                        }}
                      >
                        Add
                      </Typography>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 justify-between outline-gray-300 rounded-xl hover:shadow-xl transition ease-in-out hover:scale-105 outline bg-white z-10 p-2">
                  <div className="flex gap-2">
                    <div>
                      <Typography className="">
                        DELETE ACCOUNT POP UP
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center ">
                    <Typography
                      variant="h2"
                      className="font-bold cursor-pointer text-[#3AC4A0]"
                      onClick={() => {
                        setDeleteModalShown(prev => !prev);
                      }}
                    >
                      show
                    </Typography>
                  </div>
                </div>
                <div className="flex gap-2 justify-between outline-gray-300 rounded-xl hover:shadow-xl transition ease-in-out hover:scale-105 outline bg-white z-10 p-2">
                  <div className="flex gap-2">
                    <div>
                      <Typography className="">
                        DELETE REASON ACCOUNT POP UP
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center ">
                    <Typography
                      variant="h2"
                      className="font-bold cursor-pointer text-[#3AC4A0]"
                      onClick={() => {
                        setDeleteReasonModalShown(prev => !prev);
                      }}
                    >
                      show
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardGradient>
      </div>
    </PageGradient>
  );
};

export default withAuth(LinkedAccount);
