import noData from '@/assets/circle-page/noData.png';
import Image from 'next/image';

const NoDataModal = ({ closePieModal }: any): any => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md relative overflow-y-auto max-h-screen text-center">
      <button
        className="absolute top-5 right-5 text-gray-600 hover:text-gray-800 text-md"
        onClick={closePieModal}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M25.25 3.2175L22.7825 0.75L13 10.5325L3.2175 0.75L0.75 3.2175L10.5325 13L0.75 22.7825L3.2175 25.25L13 15.4675L22.7825 25.25L25.25 22.7825L15.4675 13L25.25 3.2175Z"
            fill="#323232"
          />
        </svg>
      </button>
      <Image
        src={noData}
        alt="No Data"
        width={200}
        height={200}
        className="mx-auto"
      />
      <p className="text-lg font-bold mt-4">Please complete your data</p>
      <p className="mt-2 text-gray-600">
        Complete your personal data in 45 seconds and
        <br />
        you can start investing
      </p>
      <button className="text-white font-poppins bg-seeds-button-green p-2 rounded-full mt-2 w-full">
        Next
      </button>
    </div>
  );
};

export default NoDataModal;
