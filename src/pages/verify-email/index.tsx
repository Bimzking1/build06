// verify-email.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface VerifyEmailResponse {
  status?: boolean;
  message?: string;
}

const VerifyEmailPage = (): JSX.Element => {
  const urlService = `${
    process.env.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance'
  }`;
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const token = router.query.token;

      if (token !== '') {
        const apiUrl = `${urlService}/email/v1/verify`;
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: token
          })
        };

        try {
          const response = await fetch(apiUrl, requestOptions);
          const data: VerifyEmailResponse = await response.json();

          console.log(data);

          if (data.status === true) {
            setVerificationStatus('success');
          } else if (data.message !== undefined) {
            setVerificationStatus(data.message);
          }
        } catch (error) {
          setVerificationStatus('Error');
        }
      }
    };

    void fetchData().catch(console.error);
  }, [router.query.token]);

  return (
    <div className="relative bg-[#3AC4A0] h-screen">
      <img
        className="absolute inset-0 w-full h-full object-cover"
        src="/assets/verify-bg.png"
        alt=""
      />
      <div className="flex flex-col items-center justify-center font-poppins gap-6 bg-white w-[50vw] rounded-[32px] h-[70vh] mx-auto mt-20 absolute inset-0">
        <section className="text-xl font-semibold text-[#262626]">
          {verificationStatus === null && <p>Verifying...</p>}
          {verificationStatus === 'success' && (
            <p>Email verification successful!</p>
          )}
          {verificationStatus === 'invalid token' && <p>Invalid Token.</p>}
          {verificationStatus === 'this token has expired' && (
            <p>Oops. Your link has expired! </p>
          )}
          {verificationStatus === 'unable to update email verification' && (
            <p>Your email has been verified! </p>
          )}
        </section>
        {verificationStatus === null && (
          <section className="w-14 h-14">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
              <linearGradient id="a12">
                <stop offset="0" stopColor="#3AC4A0" stopOpacity="0"></stop>
                <stop offset="1" stopColor="#3AC4A0"></stop>
              </linearGradient>
              <circle
                fill="none"
                stroke="url(#a12)"
                strokeWidth="19"
                strokeLinecap="round"
                strokeDasharray="0 44 0 44 0 44 0 44 0 360"
                cx="100"
                cy="100"
                r="70"
                transform-origin="center"
              >
                <animateTransform
                  type="rotate"
                  attributeName="transform"
                  calcMode="discrete"
                  dur="2"
                  values="360;324;288;252;216;180;144;108;72;36"
                  repeatCount="indefinite"
                ></animateTransform>
              </circle>
            </svg>
          </section>
        )}
        {verificationStatus === 'success' && (
          <img className="w-64 h-64" src="/assets/verif-success.png" alt="" />
        )}
        {verificationStatus !== 'success' && (
          <img className="w-64 h-64" src="/assets/verif-failed.png" alt="" />
        )}
        <section className="text-base font-normal text-[#7C7C7C]">
          {verificationStatus === 'success' && (
            <p>Yay, your email has been successfully verified.</p>
          )}
          {verificationStatus !== 'success' && (
            <p>No need for further action.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
