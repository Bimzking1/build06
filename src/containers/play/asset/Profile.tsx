import { getAssetProfile } from '@/repository/market.repository';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export interface ProfileData {
  id: string;
  company_name: string;
  company_about: string;
  company_sector: string;
  company_sub_sector: string;
  company_listing_date: string;
  ipo_price: number;
  ipo_share: number;
  ipo_amount: number;
  shareholder_date: string;
  shareholders: Array<[string, number, number]>;
  shareholder_histories: Array<[string, number, number]>;
  commissioner_date: string;
  commissioners: Commissioner[];
}

export interface Commissioner {
  key: string;
  value: string[];
}

const initialProfileData: ProfileData = {
  id: '',
  company_name: '',
  company_about: '',
  company_sector: '',
  company_sub_sector: '',
  company_listing_date: '',
  ipo_price: 0,
  ipo_share: 0,
  ipo_amount: 0,
  shareholder_date: '',
  shareholders: [],
  shareholder_histories: [],
  commissioner_date: '',
  commissioners: []
};

const Profile: React.FC = () => {
  const router = useRouter();
  const { assetId } = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<ProfileData>(initialProfileData);

  const fetchAssetProfile = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getAssetProfile(assetId as string);
      setData(response.data);
    } catch (error: any) {
      toast(error, { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const getTotal = (): { totalShare: number; totalPercentage: number } => {
    const shareholders = data?.shareholders;
    let totalShare = 0;
    let totalPercentage = 0;

    shareholders.forEach(shareholder => {
      totalShare += shareholder[1];
      totalPercentage += shareholder[2];
    });

    return { totalShare, totalPercentage };
  };

  const { totalShare, totalPercentage } = getTotal();
  useEffect(() => {
    void fetchAssetProfile();
  }, [assetId]);

  if (isLoading) {
    return <></>;
  }
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="py-4 flex flex-col gap-2 bg-[#F9FAFD] rounded-md p-4">
        <p className="font-bold text-[#424242] text-lg">Tentang Perusahaan</p>
        <p className="text-[#262626]">{data?.company_about}</p>
      </div>
      <div className="py-4 flex flex-col gap-2 bg-[#F9FAFD] rounded-md p-4">
        <p className="font-bold text-[#424242] text-lg">
          Shareholders Composition
        </p>
        <p className="text-[#262626]">
          ( Effective {moment(data?.shareholder_date).format('DD MMM YYYY')} )
        </p>
        <table className="table-fixed text-left">
          <thead>
            <tr>
              <th>Name of Shareholder</th>
              <th>Number of Shares</th>
            </tr>
          </thead>
          <tbody>
            {data?.shareholders.map((row, index) => (
              <tr key={index}>
                <td>{row[0]}</td>
                <td className="text-[#3AC4A0]">{row[1]}</td>
                <td className="text-[#3AC4A0]">{row[2]}%</td>
              </tr>
            ))}
            <tr className="border-t-2 border-[#D2D2D2]">
              <td>Total</td>
              <td className="text-[#3AC4A0]">{totalShare}</td>
              <td className="text-[#3AC4A0]">{totalPercentage}%</td>
            </tr>
          </tbody>
        </table>
        <p className="text-[#262626]">(P) = Pengendali</p>
        <table className="table-fixed text-left">
          <thead>
            <tr className="border-b-2 border-[#D2D2D2]">
              <th>Jumlah Pemegang Saham</th>
            </tr>
          </thead>
          <tbody>
            {data?.shareholder_histories.map((row, index) => (
              <tr key={index}>
                <td>{row[0]}</td>
                <td className="text-[#3AC4A0]">({row[1]})</td>
                <td
                  className={
                    row[2]?.toString().includes('-')
                      ? 'text-[#C46C3A]'
                      : 'text-[#3AC4A0]'
                  }
                >
                  ({row[2]?.toString().includes('-') ? row[2] : `+${row[2]}`})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="py-4 flex flex-col gap-2 bg-[#F9FAFD] rounded-md p-4">
        <p className="font-bold text-[#424242] text-lg">
          Board of Commissioners
        </p>
        <p className="text-[#262626]">
          ( Effective {moment(data?.commissioner_date).format('DD MMM YYYY')} )
        </p>
        <table>
          {data?.commissioners.map((commissioner, index) =>
            commissioner.value.map((value, valueIndex) => (
              <tr key={`${index}-${valueIndex}`}>
                <td>{valueIndex === 0 ? commissioner.key : ''}</td>
                <td className="text-[#3AC4A0]">:</td>
                <td className="text-[#3AC4A0]">{value}</td>
              </tr>
            ))
          )}
        </table>
        <p className="text-[#262626]">(I) = Independen</p>
      </div>
    </div>
  );
};

export default Profile;
