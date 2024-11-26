import { getSeedsCoinTransactions } from '@/repository/seedscoin.repository';
// import Image from 'next/image';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import seedscoinlogo from '../../../assets/seedscoinlogo.svg';

interface DataCoin {
  id: string;
  name: string;
  amount: 0;
  direction: string;
  started_at: string;
  expired_at: string;
  created_at: string;
  updated_at: string;
}

// interface LeaderData {
//   name: string;
//   avatar_url: string;
//   seeds_tag: string;
//   verified: true;
//   asset: number;
//   gain: number;
//   rank: number;
//   medal: string;
//   prize: number;
//   return: number;
// }
const dataDummy = [
  {
    name: 'Bonus Referral',
    price: 1000,
    date: '09/10/2019, 19:05:50 WIB'
  },
  {
    name: 'Bonus Referral',
    price: 1000,
    date: '09/10/2019, 19:05:50 WIB'
  },
  {
    name: 'Bonus Referral',
    price: 1000,
    date: '09/10/2019, 19:05:50 WIB'
  },
  {
    name: 'Bonus Referral',
    price: 1000,
    date: '09/10/2019, 19:05:50 WIB'
  },
  {
    name: 'Bonus Referral',
    price: 1000,
    date: '09/10/2019, 19:05:50 WIB'
  },
  {
    name: 'Bonus Referral',
    price: 1000,
    date: '09/10/2019, 19:05:50 WIB'
  }
];

const AllHistory = (): React.ReactElement => {
  const [coinData, setCoinData] = useState<DataCoin | null>(null);

  useEffect(() => {
    const fetchPlaySimulation = async (): Promise<void> => {
      try {
        const res = await getSeedsCoinTransactions('ALL', 1, 9);
        setCoinData(res.history);
        console.log(coinData);
      } catch (error) {
        console.error('Error fetching play simulation:', error);
      }
    };

    void fetchPlaySimulation();
  }, []);

  return (
    <>
      <div className="w-full h-auto cursor-default">
        {dataDummy.map((data, index) => (
          <div key={index} className={`w-full p-3 mb-2 bg-#F9F9F9 rounded-2xl`}>
            <div className="flex justify-between">
              <div className="flex w-full items-center">
                <Image
                  src={seedscoinlogo}
                  alt={data.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <div className="flex">
                    <h2 className="font-semibold text-sm font-poppins text-[#262626]">
                      {data.name}
                    </h2>
                  </div>
                  <p className="text-[#66C425] text-xs font-poppins">
                    IDR {data.price}
                  </p>
                </div>
              </div>
              <div className="text-end">
                <p className="text-[10px] font-poppins text-[#7C7C7C]">
                  {data.date}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AllHistory;
