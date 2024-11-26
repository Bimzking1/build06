import { assetTop } from '@/repository/asset.repository';
import { Avatar, Card, Typography } from '@material-tailwind/react';
import { useEffect, useState } from 'react';

interface dataInterface {
  id: string;
  quote: string;
  currency: string;
  image: string;
  name: string;
  price: number;
  regularPercentage: number;
}

const initialFilterAsset = {
  limit: 5,
  page: 1,
  assetType: 'crypto'
};

export default function CardAsset(): React.ReactElement {
  const [asset, setAsset] = useState<dataInterface[]>();
  const [isLoadingAsset, setIsLoadingAsset] = useState(false);
  const [filterAsset, setFilterAsset] = useState(initialFilterAsset);

  const fetchTopAsset = async (params: any): Promise<void> => {
    try {
      setIsLoadingAsset(true);
      assetTop(params)
        .then(res => {
          setAsset(res.result);
          setIsLoadingAsset(false);
        })
        .catch(err => {
          console.log(err);
          setIsLoadingAsset(false);
        });
    } catch (error: any) {
      setIsLoadingAsset(false);
      console.error('Error fetching asset data:', error.message);
    }
  };

  useEffect(() => {
    fetchTopAsset(filterAsset)
      .then()
      .catch(() => {});
  }, []);

  return (
    <>
      {asset !== undefined && (
        <>
          <div className="flex flex-row items-center justify-center my-10">
            <div className="whitespace-nowrap rounded-lg text-sm mr-2 md:mr-4 shadow-lg">
              {filterAsset.assetType === 'crypto' ? (
                <button
                  className="text-white p-3 rounded-lg text-xs md:text-base font-semibold bg-gradient-to-r from-[#7555DA] to-[#4FE6AF]"
                  onClick={() => {
                    setFilterAsset({
                      ...filterAsset,
                      assetType: 'crypto'
                    });
                    void fetchTopAsset({
                      ...filterAsset,
                      assetType: 'crypto'
                    });
                  }}
                  name="assetType"
                  value="crypto"
                >
                  Crypto
                </button>
              ) : (
                <button
                  className="text-[#7C7C7C] p-3 rounded-lg text-xs md:text-base font-semibold bg-white"
                  onClick={() => {
                    setFilterAsset({
                      ...filterAsset,
                      assetType: 'crypto'
                    });
                    void fetchTopAsset({
                      ...filterAsset,
                      assetType: 'crypto'
                    });
                  }}
                  name="assetType"
                  value="crypto"
                >
                  Crypto
                </button>
              )}
            </div>
            <div className="whitespace-nowrap rounded-lg text-sm mr-2 md:mr-4 shadow-lg">
              {filterAsset.assetType === 'id_stock' ? (
                <button
                  className="text-white p-3 rounded-lg text-xs md:text-base font-semibold bg-gradient-to-r from-[#7555DA] to-[#4FE6AF]"
                  onClick={() => {
                    setFilterAsset({
                      ...filterAsset,
                      assetType: 'id_stock'
                    });
                    void fetchTopAsset({
                      ...filterAsset,
                      assetType: 'id_stock'
                    });
                  }}
                  name="assetType"
                  value="id_stock"
                >
                  ID Stocks
                </button>
              ) : (
                <button
                  className="text-[#7C7C7C] p-3 rounded-lg text-xs md:text-base font-semibold bg-white"
                  onClick={() => {
                    setFilterAsset({
                      ...filterAsset,
                      assetType: 'id_stock'
                    });
                    void fetchTopAsset({
                      ...filterAsset,
                      assetType: 'id_stock'
                    });
                  }}
                  name="assetType"
                  value="id_stock"
                >
                  ID Stocks
                </button>
              )}
            </div>
            <div className="whitespace-nowrap rounded-lg text-sm mr-2 md:mr-4 shadow-lg">
              {filterAsset.assetType === 'us_stock' ? (
                <button
                  className="text-white p-3 rounded-lg text-xs md:text-base font-semibold bg-gradient-to-r from-[#7555DA] to-[#4FE6AF]"
                  onClick={() => {
                    setFilterAsset({
                      ...filterAsset,
                      assetType: 'us_stock'
                    });
                    void fetchTopAsset({
                      ...filterAsset,
                      assetType: 'us_stock'
                    });
                  }}
                  name="assetType"
                  value="us_stock"
                >
                  US Stocks
                </button>
              ) : (
                <button
                  className="text-[#7C7C7C] p-3 rounded-lg text-xs md:text-base font-semibold bg-white"
                  onClick={() => {
                    setFilterAsset({
                      ...filterAsset,
                      assetType: 'us_stock'
                    });
                    void fetchTopAsset({
                      ...filterAsset,
                      assetType: 'us_stock'
                    });
                  }}
                  name="assetType"
                  value="us_stock"
                >
                  US Stocks
                </button>
              )}
            </div>
            <div className="whitespace-nowrap rounded-lg text-sm mr-2 md:mr-4 shadow-lg">
              {filterAsset.assetType === 'commodities' ? (
                <button
                  className="text-white p-3 rounded-lg text-xs md:text-base font-semibold bg-gradient-to-r from-[#7555DA] to-[#4FE6AF]"
                  onClick={() => {
                    setFilterAsset({
                      ...filterAsset,
                      assetType: 'commodities'
                    });
                    void fetchTopAsset({
                      ...filterAsset,
                      assetType: 'commodities'
                    });
                  }}
                  name="assetType"
                  value="commodities"
                >
                  Commodities
                </button>
              ) : (
                <button
                  className="text-[#7C7C7C] p-3 rounded-lg text-xs md:text-base font-semibold bg-white"
                  onClick={() => {
                    setFilterAsset({
                      ...filterAsset,
                      assetType: 'commodities'
                    });
                    void fetchTopAsset({
                      ...filterAsset,
                      assetType: 'commodities'
                    });
                  }}
                  name="assetType"
                  value="commodities"
                >
                  Commodities
                </button>
              )}
            </div>
          </div>
          <Card className="flex flex-row rounded-lg p-4 bg-[#FFFFFF]/50 text-[#262626] mb-5 h-[60px]">
            <Typography className="w-1/3 text-sm md:text-base font-semibold text-start">
              Asset Name
            </Typography>
            <Typography className="w-1/3 text-sm md:text-base font-semibold text-center">
              Last Price
            </Typography>
            <Typography className="w-1/3 text-sm md:text-base font-semibold text-end">
              24h Change
            </Typography>
          </Card>
          {isLoadingAsset ? (
            <Typography className="w-full text-base font-semibold text-center">
              Loading....
            </Typography>
          ) : asset.length !== 0 ? (
            asset.map((data, idx) => (
              <Card
                className="flex flex-row bg-[#FFFFFF]/50 border shadow-none border-[#D3D3D3] backdrop-blur rounded-xl mb-7 p-4 h-[80px] items-center"
                key={idx}
              >
                <div className="flex flex-row justify-start items-center w-1/3">
                  <Avatar
                    size="md"
                    variant="circular"
                    src={data.image}
                    className="mr-4"
                    alt="ngehe"
                  />
                  <Typography className="text-xs font-normal text-start md:font-semibold md:text-lg">
                    {data.name}
                  </Typography>
                </div>
                <Typography className="w-1/3 text-xs font-normal text-center md:text-lg">
                  {data.price}
                </Typography>
                <div className=" w-1/3 text-end whitespace-nowrap text-sm">
                  <span className="bg-[#27A590] text-xs text-white p-3 rounded-lg font-normal md:text-base md:font-semibold">
                    {data.regularPercentage}
                  </span>
                </div>
              </Card>
            ))
          ) : (
            <Typography className="w-full text-base font-semibold text-center">
              Not Found
            </Typography>
          )}
        </>
      )}
    </>
  );
}
