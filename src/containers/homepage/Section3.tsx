import { getUserInfo } from '@/repository/profile.repository';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface UserData {
  name: string;
  seedsTag: string;
  email: string;
  pin: string;
  avatar: string;
  bio: string;
  birthDate: string;
  phone: string;
  _pin: string;
  refCode: string;
}

const Section3 = (): React.ReactElement => {
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await getUserInfo();
        setUserInfo(response);
      } catch (error) {
        console.log(error);
      }
    };

    void fetchData();
  }, []);

  function copyValueWithUrl(valueToCopy: string): boolean {
    const textToCopy = `${valueToCopy}`;

    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      const copied = document.execCommand('copy');
      if (copied) {
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 3000);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Error copying text: ', err);
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }

  return (
    <div className="w-full h-auto cursor-default">
      {open && (
        <div
          id="myToast"
          className="fixed right-10 z-50 bottom-10 px-5 py-4 border-r-8 border-blue-500 bg-white drop-shadow-lg"
        >
          <p className="text-sm">
            <span className="mr-2 inline-block px-3 py-1 rounded-full bg-blue-500 text-white font-extrabold">
              i
            </span>
            Referral Code copied to Clipboard
          </p>
        </div>
      )}
      <h1 className="text-3xl font-semibold text-[#262626]">
        {t('homepage.section2.text4')}
      </h1>
      <div className="mt-4 flex">
        <div className="flex justify-between border w-full border-gray-300 px-4 py-2 rounded-md">
          <input
            type="text"
            value={userInfo?.refCode}
            placeholder="Enter your referral code"
            className="w-full bg-white"
            disabled
          />
          <div className="flex">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => {
                copyValueWithUrl(userInfo?.refCode ?? '');
              }}
            >
              <g clipPath="url(#clip0_1957_35948)">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9.16602 8.34049C8.70578 8.34049 8.33268 8.71359 8.33268 9.17383V16.6738C8.33268 17.1341 8.70578 17.5072 9.16602 17.5072H16.666C17.1263 17.5072 17.4993 17.1341 17.4993 16.6738V9.17383C17.4993 8.71359 17.1263 8.34049 16.666 8.34049H9.16602ZM6.66602 9.17383C6.66602 7.79312 7.7853 6.67383 9.16602 6.67383H16.666C18.0467 6.67383 19.166 7.79312 19.166 9.17383V16.6738C19.166 18.0545 18.0467 19.1738 16.666 19.1738H9.16602C7.7853 19.1738 6.66602 18.0545 6.66602 16.6738V9.17383Z"
                  fill="#27A590"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.33398 2.50651C3.11297 2.50651 2.90101 2.59431 2.74473 2.75059C2.58845 2.90687 2.50065 3.11883 2.50065 3.33984V10.8398C2.50065 11.0609 2.58845 11.2728 2.74473 11.4291C2.90101 11.5854 3.11297 11.6732 3.33398 11.6732H4.16732C4.62755 11.6732 5.00065 12.0463 5.00065 12.5065C5.00065 12.9667 4.62755 13.3398 4.16732 13.3398H3.33398C2.67094 13.3398 2.03506 13.0765 1.56622 12.6076C1.09738 12.1388 0.833984 11.5029 0.833984 10.8398V3.33984C0.833984 2.6768 1.09738 2.04092 1.56622 1.57208C2.03506 1.10324 2.67094 0.839844 3.33398 0.839844H10.834C11.497 0.839844 12.1329 1.10324 12.6018 1.57208C13.0706 2.04092 13.334 2.6768 13.334 3.33984V4.17318C13.334 4.63341 12.9609 5.00651 12.5007 5.00651C12.0404 5.00651 11.6673 4.63341 11.6673 4.17318V3.33984C11.6673 3.11883 11.5795 2.90687 11.4232 2.75059C11.267 2.59431 11.055 2.50651 10.834 2.50651H3.33398Z"
                  fill="#27A590"
                />
              </g>
              <defs>
                <clipPath id="clip0_1957_35948">
                  <rect
                    width="20"
                    height="20"
                    fill="white"
                    transform="translate(0 0.00683594)"
                  />
                </clipPath>
              </defs>
            </svg>
            <h1 className="text-sm font-semibold text-[#27A590] ms-2">Copy</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section3;
