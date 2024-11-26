import BattleList from '@/components/team-battle/BattleList';
import withAuth from '@/helpers/withAuth';
import { type CategoryBattleItem } from '@/utils/interfaces/team-battle.interface';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ArrowBackWhite from 'public/assets/team-battle/arrow-back.svg';
import CategoryAll from 'public/assets/team-battle/category-all.svg';
import CategoryCrypto from 'public/assets/team-battle/category-crypto.svg';
import CategoryIDStocks from 'public/assets/team-battle/category-id-stocks.svg';
import CategoryUSStocks from 'public/assets/team-battle/category-us-stocks.svg';
import HistoryBattle from 'public/assets/team-battle/history-battle.svg';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TeamBattle = (): React.ReactElement => {
  const categoryBattle: CategoryBattleItem[] = [
    { id: 1, image: CategoryAll, title: 'All Category', value: '' },
    { id: 2, image: CategoryIDStocks, title: 'ID Stock', value: 'ID_STOCK' },
    { id: 3, image: CategoryUSStocks, title: 'US Stock', value: 'US_STOCK' },
    { id: 4, image: CategoryCrypto, title: 'Crypto', value: 'CRYPTO' }
  ];

  const { t } = useTranslation();
  const router = useRouter();
  const [activeCategory, setActiveCategory] =
    useState<CategoryBattleItem | null>(categoryBattle[0]);
  const [show, setShow] = useState<boolean>(true);
  const [fetchTrigger, setFetchTrigger] = useState<boolean>(false);

  const handleCategoryChange = (direction: 'next' | 'previous'): void => {
    const index =
      activeCategory != null
        ? categoryBattle.findIndex(cat => cat.id === activeCategory.id)
        : -1;
    const newIndex =
      direction === 'next'
        ? (index + 1) % categoryBattle.length
        : (index - 1 + categoryBattle.length) % categoryBattle.length;
    setActiveCategory(categoryBattle[newIndex] ?? categoryBattle[0]);
  };

  return (
    <>
      <div
        className={`w-full h-full py-4 bg-cover px-2 ${
          show ? 'block' : 'hidden'
        }`}
      >
        <div className="flex justify-between items-center py-4 px-6">
          <Image
            className="cursor-pointer lg:w-[50px] lg:h-[50px] w-[24px] h-[24px] hover:opacity-80 transition duration-300"
            src={ArrowBackWhite}
            alt="back-button"
            onClick={async () => {
              await router.replace('/play');
            }}
          />
          <Typography className="lg:hidden text-white font-poppins text-xl font-semibold">
            Team Battle
          </Typography>
          <Typography className="lg:block hidden text-white font-poppins text-2xl font-normal">
            {t('teamBattle.chooseCategory')}
          </Typography>
          <Image
            className="cursor-pointer lg:w-[45px] lg:h-[45px] w-[30px] h-[30px] hover:opacity-80 transition duration-300"
            src={HistoryBattle}
            alt="history-battle"
            onClick={async () => {
              await router.push('/play/team-battle/history');
            }}
          />
        </div>
        <div className="flex flex-col justify-center items-center gap-4 lg:mt-4 mt-6">
          <Typography className="lg:hidden block text-white font-poppins text-2xl font-semibold">
            {t('teamBattle.chooseCategory')}
          </Typography>
          <div className="w-full flex lg:justify-center justify-start items-center lg:gap-[22px] lg:overflow-x-hidden overflow-x-auto no-scroll">
            {categoryBattle.map((item, index) => (
              <div
                key={index}
                className={`border-[2.8px] ${
                  activeCategory?.value === item?.value
                    ? 'border-[#5E44FF]'
                    : 'border-white'
                } rounded-2xl cursor-pointer lg:mx-2 mx-3 min-w-[99px] bg-white/20`}
                onClick={() => {
                  setActiveCategory(item);
                }}
              >
                <Image
                  src={item?.image}
                  alt={item.title}
                  className="lg:w-[97px] lg:h-[87px] w-[99px] h-[89px]"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center items-center gap-4 mx-auto">
            <div className="flex justify-center items-center gap-4 mt-4">
              {activeCategory !== null && (
                <div
                  className="cursor-pointer p-1 bg-white/50 backdrop-blur-sm rounded-lg hover:bg-white/70 duration-300"
                  onClick={() => {
                    handleCategoryChange('previous');
                  }}
                >
                  <ChevronLeftIcon
                    width={16}
                    height={24}
                    className="text-white"
                  />
                </div>
              )}
              <Image
                src={activeCategory?.image ?? CategoryAll}
                alt={activeCategory?.title ?? 'Selected Category'}
                className="lg:w-[240px] lg:h-[240px] w-[220px] h-[220px] "
              />
              {activeCategory !== null && (
                <div
                  className="cursor-pointer p-1 bg-white/50 backdrop-blur-sm rounded-lg hover:bg-white/70 duration-300"
                  onClick={() => {
                    handleCategoryChange('next');
                  }}
                >
                  <ChevronRightIcon
                    width={16}
                    height={24}
                    className="text-white"
                  />
                </div>
              )}
            </div>
            <div>
              <Typography className="text-white font-poppins text-[27px] font-semibold">
                {activeCategory?.title ?? 'All Category'}
              </Typography>
            </div>
          </div>
          <div className="mt-6">
            <Button
              disabled={activeCategory === null}
              className={`w-[345px] lg:h-[60px] h-[45px] rounded-full border-[2px] border-white text-sm font-semibold font-poppins ${
                activeCategory === null ? '#E9E9E9' : 'bg-[#2934B2]'
              }`}
              onClick={() => {
                setShow(!show);
                setFetchTrigger(true);
              }}
            >
              {t('teamBattle.next')}
            </Button>
          </div>
        </div>
      </div>
      <BattleList
        classname={show ? 'hidden' : 'block'}
        setShow={setShow}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categoryBattle={categoryBattle}
        fetchTrigger={fetchTrigger}
        setFetchTrigger={setFetchTrigger}
      />
    </>
  );
};

export default withAuth(TeamBattle);
