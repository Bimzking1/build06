import { Ethereum } from '@/constants/assets/icons';
import NoDataModal from '@/containers/circle/create-circle/modalNoData';
import { Switch } from '@headlessui/react';
import Image from 'next/image';
import { useState } from 'react';
import DoughnutChart from '../DoughnutChart';

const PieModal = ({ closePieModal }: any): any => {
  const [cardCount, setCardCount] = useState<number[]>([0, 0, 0, 0]);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [isOn, setIsOn] = useState<boolean>(false);
  // const [isDataIncomplete, setIsDataIncomplete] = useState<boolean>(false);
  // const [showAssetsLists, setShowAssetsLists] = useState<boolean>(false);
  // const [amount, setAmount] = useState<number>(0);
  const isDataIncomplete = false;
  const showAssetsLists = false;
  const amount = 0;

  const handleSliderChange = (value: number): any => {
    setSliderValue(value);
  };

  const chartData: any = {
    labels: [
      'Aset1',
      'Aset2',
      'Aset3',
      'Aset4',
      'Aset5',
      'Aset6',
      'Aset7',
      'Aset8',
      'Aset9',
      'Aset10'
    ], // Adjust the labels array to match the length of the data array
    datasets: [
      {
        label: '',
        data: [50],
        backgroundColor: [
          'grey',
          'red',
          'blue',
          'yellow',
          'green',
          'purple',
          'orange',
          'pink',
          'brown',
          'black'
        ] // Adjust the backgroundColor array to match the length of the data array
      }
    ]
  };

  const addCard: any = () => {
    setCardCount([...cardCount, 0]);
  };

  const calendar: any = (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.3802 3.33203H4.71354C3.79307 3.33203 3.04688 4.07822 3.04688 4.9987V16.6654C3.04688 17.5858 3.79307 18.332 4.71354 18.332H16.3802C17.3007 18.332 18.0469 17.5858 18.0469 16.6654V4.9987C18.0469 4.07822 17.3007 3.33203 16.3802 3.33203Z"
        stroke="#262626"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.8828 1.66797V5.0013"
        stroke="#262626"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.21094 1.66797V5.0013"
        stroke="#262626"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.04688 8.33203H18.0469"
        stroke="#262626"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div>
      {/* Latar belakang semi-transparan */}
      <div className="fixed top-0 left-0 w-full h-full bg-gray-800 opacity-50 z-40"></div>

      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
        {isDataIncomplete ? (
          <NoDataModal closePieModal={closePieModal} />
        ) : showAssetsLists ? (
          <div className="bg-white rounded-lg p-6 shadow-md relative overflow-y-auto max-h-screen">
            <div>
              <p className="text-lg font-bold">Selected Asset</p>
              <p className="mt-2 text-gray-600">
                Lorem ipsum dolor sit amet, consectetur
              </p>
            </div>

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

            <div className="flex items-center py-2">
              {calendar}
              <p className="mt-2 ml-2 text-sm text-gray-600">
                Choose interesting assets and make a
                <br />
                watchlist.
              </p>
            </div>

            <div className="flex gap-2">
              <Image
                src={Ethereum.src}
                alt={Ethereum.alt}
                width={30}
                height={30}
              />
              <Image
                src={Ethereum.src}
                alt={Ethereum.alt}
                width={30}
                height={30}
              />
              <Image
                src={Ethereum.src}
                alt={Ethereum.alt}
                width={30}
                height={30}
              />
            </div>

            <div className="flex gap-2 items-center mt-2 text-sm">
              <button className="text-white font-poppins bg-seeds-button-green px-4 py-2 rounded-md">
                Overview
              </button>
              <button className="text-white font-poppins bg-seeds-button-green px-4 py-2 rounded-md">
                Stocks
              </button>
              <button className="text-white font-poppins bg-seeds-button-green px-4 py-2 rounded-md">
                Cryptos
              </button>
            </div>

            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 p-2 rounded-md mt-2 w-full"
            />
            <div>
              {cardCount.map((_, index: number) => (
                <div key={index} className="bg-gray-100 p-2 rounded-md mt-2">
                  <div className="flex justify-between">
                    <div className="flex">
                      <Image
                        src={Ethereum.src}
                        alt={Ethereum.alt}
                        width={30}
                        height={30}
                      />
                      <div className="ml-2">
                        <div className="flex">
                          <h1 className="font-bold mr-1">ETH /</h1>
                          <p>BIDR</p>
                        </div>
                        <p className="text-sm text-gray-400">Etherium</p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex justify-end">
                        <p className="font-bold text-sm">
                          {`Rp ${'3.575.000'}`}
                        </p>
                      </div>
                      <div className="flex justify-center">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 13 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.27826 9.66141C1.16316 9.66141 1.02886 9.62306 0.932943 9.5272C0.741102 9.33547 0.741102 9.02871 0.932943 8.85615L4.53954 5.25171C4.73138 5.05998 5.03833 5.05998 5.21098 5.25171L7.26366 7.30317L11.4841 3.0852C11.676 2.89347 11.9829 2.89347 12.1556 3.0852C12.3474 3.27693 12.3474 3.58369 12.1556 3.75624L7.58981 8.31932C7.39797 8.51105 7.09102 8.51105 6.91837 8.31932L4.86566 6.26785L1.60438 9.5272C1.52765 9.62306 1.41255 9.66141 1.27826 9.66141Z"
                            fill="#7555DA"
                          />
                          <path
                            d="M11.826 6.78764C11.5574 6.78764 11.3464 6.57675 11.3464 6.30833V3.91175H8.94835C8.67977 3.91175 8.46875 3.70086 8.46875 3.43244C8.46875 3.16402 8.67977 2.95312 8.94835 2.95312H11.826C12.0945 2.95312 12.3056 3.16402 12.3056 3.43244V6.30833C12.3056 6.57675 12.0945 6.78764 11.826 6.78764Z"
                            fill="#7555DA"
                          />
                        </svg>
                        <p className="text-sm ml-1 text-seeds-button-green">
                          {'(47%)'}
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      id="checkbox1"
                      name="checkbox1"
                      className="mx-auto"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button className="text-white font-poppins bg-seeds-button-green p-2 rounded-full mt-2 w-full">
              Save
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 shadow-md relative overflow-y-auto max-h-screen">
            <div>
              <h1 className="font-bold text-xl">Title</h1>
              <p className="text-sm text-gray-600">
                Lorem ipsum dolor sit amet, consectetur
              </p>
            </div>
            {/* Tombol close */}
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

            <div className="flex items-center border-b border-gray-400 py-2">
              {calendar}
              <input
                type="text"
                className="ml-2 border-none outline-none"
                placeholder="Create your title Pie"
              />
            </div>

            <div className="w-[180px] h-[180px] mx-auto my-auto">
              <DoughnutChart data={chartData} centerText="+43%" />
            </div>
            <div>
              <h1 className="font-semibold text-md">Amount</h1>
              <p className="text-sm text-gray-600">
                Lorem ipsum dolor sit amet, consectetur
              </p>
            </div>
            <div className="flex items-center border-b border-gray-400 py-2">
              {calendar}
              <h1 className="font-bold text-sm items-start">IDR</h1>
              <input
                type="number"
                className="ml-2 border-none outline-none text-xl font-bold"
                value={amount}
              />
            </div>

            {amount !== 0 ? (
              <div className="mt-2 p-2 border border-red-500 bg-red-50 rounded-lg max-w-[300px] flex items-center">
                <div className="flex items-center">
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_2153_31773)">
                      <path
                        d="M14.5469 6.45313C14.5469 6.82865 14.5469 7.20052 14.5469 7.57604C14.5104 7.58698 14.5214 7.61979 14.5177 7.64531C14.4995 7.91875 14.4557 8.18854 14.3974 8.45469C14.0292 10.1208 13.1724 11.488 11.8271 12.5417C10.8755 13.2854 9.8 13.7448 8.60417 13.9271C8.43281 13.9526 8.25781 13.9453 8.0901 14.0036C7.70729 14.0036 7.32448 14.0036 6.94167 14.0036C6.825 13.9563 6.6974 13.9599 6.57708 13.9417C5.2026 13.7375 3.98125 13.1943 2.93854 12.2755C1.66979 11.149 0.893229 9.74531 0.623437 8.06458C0.597917 7.90052 0.605208 7.73281 0.546875 7.57604C0.546875 7.19323 0.546875 6.81042 0.546875 6.4276C0.576042 6.42031 0.572396 6.39479 0.572396 6.37292C0.594271 6.05573 0.645312 5.74219 0.718229 5.43229C1.36719 2.63229 3.64948 0.517708 6.48594 0.0765625C6.63906 0.0510417 6.79948 0.0619792 6.94531 0C7.32812 0 7.71094 0 8.09375 0C8.10469 0.0364583 8.1375 0.0255208 8.15937 0.0255208C8.39635 0.0364583 8.62969 0.0729167 8.86302 0.116667C10.3651 0.415625 11.6448 1.11927 12.6839 2.24219C13.6536 3.28854 14.2479 4.52083 14.4703 5.93542C14.4958 6.11042 14.4885 6.28542 14.5469 6.45313ZM7.55417 1.03906C4.27656 1.02813 1.59323 3.71146 1.58594 6.99635C1.58229 10.274 4.2401 12.95 7.53229 12.9573C10.8318 12.9609 13.4969 10.3214 13.5005 7.01094C13.5115 3.71146 10.8646 1.06094 7.55417 1.03906Z"
                        fill="#DD2525"
                      />
                      <path
                        d="M8.06615 5.447C8.06615 6.00845 8.06979 6.56627 8.0625 7.12772C8.0625 7.24439 8.08073 7.2845 8.21198 7.2845C8.97396 7.2772 9.73229 7.28085 10.4943 7.28085C10.7568 7.28085 10.9828 7.47773 11.012 7.73293C11.0448 7.98814 10.8917 8.22147 10.6437 8.30168C10.5818 8.32356 10.5198 8.31991 10.4542 8.31991C9.49896 8.31991 8.5401 8.31991 7.5849 8.31991C7.22396 8.31991 7.02344 8.1121 7.02344 7.75116C7.02344 6.41314 7.02344 5.07147 7.02344 3.73345C7.02344 3.46731 7.20573 3.24491 7.45 3.20845C7.72708 3.1647 7.975 3.32147 8.04792 3.58762C8.0625 3.63866 8.0625 3.697 8.0625 3.74804C8.06615 4.31679 8.06615 4.88189 8.06615 5.447Z"
                        fill="#DD2525"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2153_31773">
                        <rect
                          width="20"
                          height="20"
                          fill="white"
                          transform="translate(0.546875)"
                        />
                      </clipPath>
                    </defs>
                  </svg>

                  <p className="text-xs line-clamp-3">
                    This is only a demo account. You do not have to pay to use
                    this feature, and you will not get any profit from the
                    created Pie.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="flex items-center py-2 justify-between">
              <h1 className="font-bold">Assets</h1>
              <button
                onClick={addCard}
                className="flex justify-center p-2 text-sm items-center rounded-full text-white font-poppins h-fit bg-seeds-button-green"
              >
                Add Assets +
              </button>
            </div>

            {cardCount.map((_, index: number) => (
              <div key={index} className="bg-gray-100 p-2 rounded-md mt-2">
                <div className="flex justify-between">
                  <div className="flex">
                    <Image
                      src={Ethereum.src}
                      alt={Ethereum.alt}
                      width={30}
                      height={30}
                    />
                    <div className="ml-2">
                      <div className="flex">
                        <h1 className="font-bold mr-1">ETH /</h1>
                        <p>BIDR</p>
                      </div>
                      <p className="text-sm text-gray-400">Etherium</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 13 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.27826 9.66141C1.16316 9.66141 1.02886 9.62306 0.932943 9.5272C0.741102 9.33547 0.741102 9.02871 0.932943 8.85615L4.53954 5.25171C4.73138 5.05998 5.03833 5.05998 5.21098 5.25171L7.26366 7.30317L11.4841 3.0852C11.676 2.89347 11.9829 2.89347 12.1556 3.0852C12.3474 3.27693 12.3474 3.58369 12.1556 3.75624L7.58981 8.31932C7.39797 8.51105 7.09102 8.51105 6.91837 8.31932L4.86566 6.26785L1.60438 9.5272C1.52765 9.62306 1.41255 9.66141 1.27826 9.66141Z"
                          fill="#7555DA"
                        />
                        <path
                          d="M11.826 6.78764C11.5574 6.78764 11.3464 6.57675 11.3464 6.30833V3.91175H8.94835C8.67977 3.91175 8.46875 3.70086 8.46875 3.43244C8.46875 3.16402 8.67977 2.95312 8.94835 2.95312H11.826C12.0945 2.95312 12.3056 3.16402 12.3056 3.43244V6.30833C12.3056 6.57675 12.0945 6.78764 11.826 6.78764Z"
                          fill="#7555DA"
                        />
                      </svg>
                      <p className="text-sm ml-1 text-purple-300">
                        {'Rp 0.4 (47%)'}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-white inline-block rounded-full border-gray-300 border px-4 py-1">
                        <p className="font-bold text-gray-500 text-sm">20%</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-2">
                  <input
                    type="range"
                    id="slider"
                    className="w-full h-4 rounded-full appearance-none"
                    min="0"
                    max="100"
                    value={sliderValue}
                    style={{
                      background: `linear-gradient(to right, #3AC4A0 0%, #3AC4A0 ${sliderValue}%, #ccc ${sliderValue}%, #ccc 100%)`
                    }}
                    onChange={e => handleSliderChange(Number(e.target.value))}
                  />
                </div>

                <div className="flex justify-end">
                  <Switch
                    checked={isOn}
                    onChange={setIsOn}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-seeds-green focus:ring-offset-2 ${
                      isOn ? 'bg-seeds-green' : 'bg-gray-200'
                    }`}
                  >
                    {/* <span className="sr-only">Use setting</span> */}
                    <span
                      className={`
                      ${isOn ? 'translate-x-5' : 'translate-x-0'}
                      pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                    `}
                    >
                      <span
                        className={`
                        ${
                          isOn
                            ? 'opacity-0 duration-100 ease-out'
                            : 'opacity-100 duration-200 ease-in'
                        }
                        absolute inset-0 flex h-full w-full items-center justify-center transition-opacity
                      `}
                        aria-hidden="true"
                      >
                        <svg
                          className="h-3 w-3 text-gray-400"
                          fill="none"
                          viewBox="0 0 12 12"
                        >
                          <path
                            d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span
                        className={`
                        ${
                          isOn
                            ? 'opacity-100 duration-200 ease-in'
                            : 'opacity-0 duration-100 ease-out'
                        }
                        absolute inset-0 flex h-full w-full items-center justify-center transition-opacity
                      `}
                        aria-hidden="true"
                      >
                        <svg
                          width="9"
                          height="10"
                          viewBox="0 0 9 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.51832 9.50031H1.77889C1.10278 9.50031 0.546875 8.94536 0.546875 8.27042V5.40568C0.546875 4.73073 1.10278 4.17578 1.77889 4.17578H7.51832C8.19443 4.17578 8.75034 4.73073 8.75034 5.40568V8.27042C8.73531 8.94536 8.19443 9.50031 7.51832 9.50031ZM1.77889 5.00071C1.55352 5.00071 1.37323 5.18069 1.37323 5.40568V8.27042C1.37323 8.4954 1.55352 8.67539 1.77889 8.67539H7.51832C7.74369 8.67539 7.92398 8.4954 7.92398 8.27042V5.40568C7.92398 5.18069 7.74369 5.00071 7.51832 5.00071H1.77889Z"
                            fill="white"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M4.67619 1.31953C4.2113 1.31953 3.76545 1.49221 3.43672 1.7996C3.10799 2.10698 2.92331 2.52388 2.92331 2.95858V4.59764C2.92331 4.82394 2.72712 5.0074 2.48509 5.0074C2.24307 5.0074 2.04688 4.82394 2.04688 4.59764V2.95858C2.04688 2.30653 2.32389 1.68118 2.81698 1.2201C3.31008 0.759028 3.97885 0.5 4.67619 0.5C5.37353 0.5 6.04231 0.759028 6.5354 1.2201C7.02849 1.68118 7.30551 2.30653 7.30551 2.95858V4.59764C7.30551 4.82394 7.10931 5.0074 6.86729 5.0074C6.62527 5.0074 6.42907 4.82394 6.42907 4.59764V2.95858C6.42907 2.52388 6.24439 2.10698 5.91566 1.7996C5.58693 1.49221 5.14108 1.31953 4.67619 1.31953Z"
                            fill="white"
                          />
                        </svg>
                      </span>
                    </span>
                  </Switch>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PieModal;
