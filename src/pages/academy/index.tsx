import ArtPagination from '@/components/ArtPagination';
import CategoryCourseCard from '@/components/academy/CategoryCourseCard';
import LanguageSelector from '@/components/academy/LanguageSelector';
import NoDataList from '@/components/academy/NoDataList';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import { getAllCategory } from '@/repository/academy.repository';
import { getUserInfo } from '@/repository/profile.repository';
import {
  type CategoryAcademyI,
  type ListParamsI,
  type MetaDataI
} from '@/utils/interfaces/academy.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Typography } from '@material-tailwind/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const Academy: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const { t } = useTranslation();
  const searchRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<CategoryAcademyI[]>([]);
  const [categoryParams, setCategoryParams] = useState<ListParamsI>({
    page: 1,
    limit: 9,
    search: '',
    status: ''
  });
  const [metaData, setMetaData] = useState<MetaDataI>({
    total: 0,
    currentPage: 0,
    limit: 0,
    totalPage: 0
  });
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const dataInfo = await getUserInfo();
        setUserInfo(dataInfo);
      } catch (error) {
        toast(`Error fetching data user: ${error as string}`);
      }
    };
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchCategoryList = async (): Promise<void> => {
      try {
        setLoading(true);
        const res = await getAllCategory(categoryParams);
        setCategoryList(res.data);
        setMetaData(res.metadata);
      } catch (error) {
        toast(`ERROR fetch list quiz ${error as string}`);
      } finally {
        setLoading(false);
      }
    };
    void fetchCategoryList();
  }, [categoryParams]);

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    const keyword = searchRef.current?.value.trim();
    if (event.key === 'Enter' && keyword !== undefined) {
      event.preventDefault();
      setCategoryParams({
        ...categoryParams,
        page: 1,
        limit: 9,
        search: keyword
      });
    }
  };

  return (
    <PageGradient defaultGradient className="w-full">
      <div className="w-full h-auto py-6 px-4 my-4 bg-gradient-to-r from-[#3AC4A0] from-50% to-[#9CFFE5] font-poppins xl:rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1 flex justify-center">
            <Typography className="text-center text-lg font-semibold text-white font-poppins">
              Seeds Academy
            </Typography>
          </div>
          <LanguageSelector />
        </div>
        <div className="flex flex-col justify-start mb-3">
          <Typography className="text-white font-semibold text-xl">
            {t('academy.greeting')} {userInfo?.name}!
          </Typography>
          <Typography className="text-white text-base">
            {t('academy.courseTitle')}
          </Typography>
        </div>
        <div>
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#BDBDBD] w-5 h-5" />
            <input
              ref={searchRef}
              id="search"
              type="text"
              onKeyDown={handleSearch}
              name="search"
              placeholder={t('academy.courseSearchPlaceholder') ?? ''}
              className="block w-full text-[#262626] text-sm h-10 leading-4 placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9] p-2 pl-10 rounded-xl border border-[#BDBDBD]"
            />
          </div>
        </div>
      </div>
      <div className="w-full h-auto py-6 px-6 font-poppins bg-white shadow-lg xl:rounded-xl">
        <div className="mb-2">
          <Typography className="font-semibold text-xl">
            {t('academy.categoryTitle')}
          </Typography>
        </div>
        {categoryList.length === 0 && !loading && (
          <NoDataList
            title="academy.noCategoriesTitle"
            description="academy.noCategoriesDescription"
          />
        )}
        {loading ? (
          <div className="flex items-center justify-center my-4">
            <div className="animate-spinner w-14 h-14 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 grid-cols-2 gap-6 lg:gap-x-8 gap-y-4">
            {categoryList.map((item, index) => (
              <Link key={index} href={`/academy/${item.id}`}>
                <CategoryCourseCard data={item} />
              </Link>
            ))}
          </div>
        )}
        <ArtPagination
          currentPage={categoryParams.page}
          totalPages={metaData.totalPage}
          onPageChange={page => {
            setCategoryParams({ ...categoryParams, page });
          }}
        />
      </div>
    </PageGradient>
  );
};

export default withAuth(Academy);
