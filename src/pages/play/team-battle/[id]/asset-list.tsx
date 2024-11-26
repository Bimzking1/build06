/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use-client';

import IconFilter from '@/assets/play/tournament/iconFilter.svg';
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
// import { useTranslation } from 'react-i18next';
import PlayAssetsList from '@/containers/team-battle/asset';
import { getBattleArena } from '@/repository/team-battle.repository';
import { type ArenaBattleI } from '@/utils/interfaces/team-battle.interface';
import {
  AssetFilter,
  SortingFilter
} from '@/utils/interfaces/tournament.interface';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface FilterAsset {
  id: number;
  title: string;
  status: AssetFilter;
}

interface FilterSorting {
  id: number;
  title: string;
  status: SortingFilter;
}

const AssetListBattle = (): React.ReactElement => {
  // const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const [activeNavbar, setActiveNavbar] = useState('All');
  const [assetActiveTab, setAssetActiveTab] = useState('');
  const [detailTournament, setDetailTournament] = useState<ArenaBattleI>();
  const [searchTerm, setSearchTerm] = useState('');
  const [assetActiveSort, setAssetActiveSort] = useState(
    SortingFilter.ASCENDING
  );
  const [showFilter, setShowFilter] = useState(false);

  const handleTabChange = (tab: string): void => {
    setActiveNavbar(tab);
  };

  const handleShowFilters = (): void => {
    setShowFilter(!showFilter);
  };

  const filterAsset: FilterAsset[] = [
    {
      id: 0,
      title: 'ID STOCK',
      status: AssetFilter.ID_STOCK
    },
    {
      id: 1,
      title: 'US STOCK',
      status: AssetFilter.US_STOCK
    },
    {
      id: 2,
      title: 'CRYPTO',
      status: AssetFilter.CRYPTO
    },
    {
      id: 3,
      title: 'COMMODITIES',
      status: AssetFilter.COMMODITIES
    }
  ];

  const filterSorting: FilterSorting[] = [
    {
      id: 0,
      title: 'A-Z',
      status: SortingFilter.ASCENDING
    },
    {
      id: 1,
      title: 'Z-A',
      status: SortingFilter.DESCENDING
    },
    {
      id: 2,
      title: 'Top Gainer %',
      status: SortingFilter.TOP_GAINER_PERCENTAGE
    },
    {
      id: 3,
      title: 'Top Loser',
      status: SortingFilter.TOP_GAINER_VALUE
    },
    {
      id: 4,
      title: 'Top Loser %',
      status: SortingFilter.TOP_LOSER_PERCENTAGE
    },
    {
      id: 5,
      title: 'Top Loser',
      status: SortingFilter.TOP_LOSER_VALUE
    }
  ];
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value); // Update the search term state
  };

  const handleGetDetailArena = async (): Promise<void> => {
    try {
      const resp: ArenaBattleI = await getBattleArena(id as string);
      setDetailTournament(resp);
      setAssetActiveTab(resp?.category);
    } catch (error: any) {
      toast(error.messasge, { type: 'error' });
    }
  };

  useEffect(() => {
    if (id !== undefined) {
      void handleGetDetailArena();
    }
  }, [id]);

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center rounded-xl font-poppins p-5 bg-white">
        <div className="flex justify-start w-full">
          <Typography className="text-xl font-semibold">Asset List</Typography>
        </div>
        <div className="w-full flex gap-2 mt-4">
          <input
            id="search"
            type="text"
            name="search"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            readOnly={false}
            disabled={false}
            className="block w-full text-[#262626] h-11 leading-4 placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9] p-3 pl-8 rounded-xl border border-[#BDBDBD]"
          />
          <Image
            onClick={() => {
              handleShowFilters();
            }}
            alt=""
            src={IconFilter}
            className="w-[30px] cursor-pointer"
          />
        </div>

        <div className="w-full mt-4">
          {/* Sorting Section */}
          {showFilter && (
            <div className="w-full flex items-center justify-center mt-4 duration-500">
              <div className="flex flex-row items-center gap-3 max-w-full overflow-x-auto no-scroll">
                {filterSorting.map(item => (
                  <button
                    className={`w-full flex gap-2 border px-4 py-2 font-poppins rounded-lg text-sm text-nowrap ${
                      item.status === assetActiveSort
                        ? 'border-seeds-button-green bg-seeds-button-green text-white'
                        : 'border-seeds-button-green bg-white text-seeds-button-green'
                    }`}
                    key={item.id}
                    onClick={() => {
                      setAssetActiveSort(item.status);
                    }}
                  >
                    <div>{item.title}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filter Section */}
          <div className="w-full flex items-start justify-start mt-4">
            <div className="flex flex-row items-center gap-3 max-w-full overflow-x-auto no-scroll">
              {filterAsset.map(item => (
                <>
                  {detailTournament?.category?.includes(item?.status) && (
                    <button
                      className={`w-full flex gap-2 border px-4 py-2 font-poppins rounded-lg text-sm text-nowrap ${
                        item.status === assetActiveTab
                          ? 'border-seeds-button-green bg-seeds-button-green text-white'
                          : 'border-seeds-button-green bg-white text-seeds-button-green'
                      }`}
                      key={item?.id}
                      onClick={() => {
                        setAssetActiveTab(item?.status);
                        setActiveNavbar('All');
                      }}
                    >
                      <div>{item?.title}</div>
                    </button>
                  )}
                </>
              ))}
            </div>
          </div>

          <Tabs value={activeNavbar}>
            <TabsHeader
              className="w-full text-center justify-center mx-auto  rounded-none bg-transparent p-0"
              indicatorProps={{
                className: 'shadow-none rounded-none bg-transparent'
              }}
            >
              <Tab
                value="All"
                onClick={() => {
                  handleTabChange('All');
                }}
                className={`text-center text-xl z-0 bg-transparent mt-3 xl:mt-5 ${
                  activeNavbar === 'All'
                    ? 'text-[#4FE6AF] bg-gradient-to-t z-0 from-[#e5fcf3] to-white linier font-semibold border-b-4 border-b-[#4FE6AF]'
                    : 'text-[#7C7C7C] text-xl font-normal border-b-2 border-b-[#BDBDBD]'
                }`}
              >
                All
              </Tab>
              {assetActiveTab === 'ID_STOCK' && (
                <>
                  <Tab
                    value="LQ45"
                    onClick={() => {
                      handleTabChange('LQ45');
                    }}
                    className={`text-center text-xl z-0 bg-transparent mt-3 xl:mt-5 ${
                      activeNavbar === 'LQ45'
                        ? 'text-[#4FE6AF] bg-gradient-to-t from-[#e5fcf3] to-white linier font-semibold border-b-4 border-b-[#4FE6AF]'
                        : 'text-[#7C7C7C] text-xl font-normal border-b-2 border-b-[#BDBDBD]'
                    }`}
                  >
                    LQ45
                  </Tab>
                  <Tab
                    value="ISSI"
                    onClick={() => {
                      handleTabChange('ISSI');
                    }}
                    className={`text-center text-xl z-0 bg-transparent mt-3 xl:mt-5 ${
                      activeNavbar === 'ISSI'
                        ? 'text-[#4FE6AF] bg-gradient-to-t from-[#e5fcf3] to-white linier font-semibold border-b-4 border-b-[#4FE6AF]'
                        : 'text-[#7C7C7C] text-xl font-normal border-b-2 border-b-[#BDBDBD]'
                    }`}
                  >
                    ISSI
                  </Tab>
                  <Tab
                    value="IDX30"
                    onClick={() => {
                      handleTabChange('IDX30');
                    }}
                    className={`text-center text-xl z-0 bg-transparent mt-3 xl:mt-5 ${
                      activeNavbar === 'IDX30'
                        ? 'text-[#4FE6AF] bg-gradient-to-t from-[#e5fcf3] to-white linier font-semibold border-b-4 border-b-[#4FE6AF]'
                        : 'text-[#7C7C7C] text-xl font-normal border-b-2 border-b-[#BDBDBD]'
                    }`}
                  >
                    IDX30
                  </Tab>
                </>
              )}
              {assetActiveTab === 'US_STOCK' && (
                <>
                  <Tab
                    value="SP500"
                    onClick={() => {
                      handleTabChange('SP500');
                    }}
                    className={`text-center text-xl z-0 bg-transparent mt-3 xl:mt-5 ${
                      activeNavbar === 'SP500'
                        ? 'text-[#4FE6AF] bg-gradient-to-t from-[#e5fcf3] to-white linier font-semibold border-b-4 border-b-[#4FE6AF]'
                        : 'text-[#7C7C7C] text-xl font-normal border-b-2 border-b-[#BDBDBD]'
                    }`}
                  >
                    SP500
                  </Tab>
                  <Tab
                    value="NASDAQ100"
                    onClick={() => {
                      handleTabChange('NASDAQ100');
                    }}
                    className={`text-center text-xl z-0 bg-transparent mt-3 xl:mt-5 ${
                      activeNavbar === 'NASDAQ100'
                        ? 'text-[#4FE6AF] bg-gradient-to-t from-[#e5fcf3] to-white linier font-semibold border-b-4 border-b-[#4FE6AF]'
                        : 'text-[#7C7C7C] text-xl font-normal border-b-2 border-b-[#BDBDBD]'
                    }`}
                  >
                    NASDAQ100
                  </Tab>
                  <Tab
                    value="DJ30"
                    onClick={() => {
                      handleTabChange('DJ30');
                    }}
                    className={`text-center text-xl z-0 bg-transparent mt-3 xl:mt-5 ${
                      activeNavbar === 'DJ30'
                        ? 'text-[#4FE6AF] bg-gradient-to-t from-[#e5fcf3] to-white linier font-semibold border-b-4 border-b-[#4FE6AF]'
                        : 'text-[#7C7C7C] text-xl font-normal border-b-2 border-b-[#BDBDBD]'
                    }`}
                  >
                    DJ30
                  </Tab>
                  <Tab
                    value="RUSSELL2000"
                    onClick={() => {
                      handleTabChange('RUSSELL2000');
                    }}
                    className={`text-center text-xl z-0 bg-transparent mt-3 xl:mt-5 ${
                      activeNavbar === 'RUSSELL2000'
                        ? 'text-[#4FE6AF] bg-gradient-to-t from-[#e5fcf3] to-white linier font-semibold border-b-4 border-b-[#4FE6AF]'
                        : 'text-[#7C7C7C] text-xl font-normal border-b-2 border-b-[#BDBDBD]'
                    }`}
                  >
                    RUSSELL2000
                  </Tab>
                </>
              )}
            </TabsHeader>

            <TabsBody className="w-full">
              <TabPanel value="All">
                <PlayAssetsList
                  assetType={assetActiveTab}
                  searchValue={searchTerm}
                  subType={'ALL'}
                  sortBy={assetActiveSort}
                />
              </TabPanel>
              {assetActiveTab === 'ID_STOCK' && (
                <>
                  <TabPanel value="LQ45">
                    <PlayAssetsList
                      assetType={assetActiveTab}
                      searchValue={searchTerm}
                      subType={'LQ45'}
                      sortBy={assetActiveSort}
                    />
                  </TabPanel>
                  <TabPanel value="ISSI">
                    <PlayAssetsList
                      assetType={assetActiveTab}
                      searchValue={searchTerm}
                      subType={'ISSI'}
                      sortBy={assetActiveSort}
                    />
                  </TabPanel>
                  <TabPanel value="IDX30">
                    <PlayAssetsList
                      assetType={assetActiveTab}
                      searchValue={searchTerm}
                      subType={'IDX30'}
                      sortBy={assetActiveSort}
                    />
                  </TabPanel>
                </>
              )}
              {assetActiveTab === 'US_STOCK' && (
                <>
                  <TabPanel value="SP500">
                    <PlayAssetsList
                      assetType={assetActiveTab}
                      searchValue={searchTerm}
                      subType={'SP500'}
                      sortBy={assetActiveSort}
                    />
                  </TabPanel>
                  <TabPanel value="NASDAQ100">
                    <PlayAssetsList
                      assetType={assetActiveTab}
                      searchValue={searchTerm}
                      subType={'NASDAQ100'}
                      sortBy={assetActiveSort}
                    />
                  </TabPanel>
                  <TabPanel value="DJ30">
                    <PlayAssetsList
                      assetType={assetActiveTab}
                      searchValue={searchTerm}
                      subType={'DJ30'}
                      sortBy={assetActiveSort}
                    />
                  </TabPanel>
                  <TabPanel value="RUSSELL2000">
                    <PlayAssetsList
                      assetType={assetActiveTab}
                      searchValue={searchTerm}
                      subType={'RUSSELL2000'}
                      sortBy={assetActiveSort}
                    />
                  </TabPanel>
                </>
              )}
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AssetListBattle;
