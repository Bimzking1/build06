import ArtPagination from '@/components/ArtPagination';
import CourseCard from '@/components/academy/CourseCard';
import LanguageSelector from '@/components/academy/LanguageSelector';
import NoDataList from '@/components/academy/NoDataList';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import {
  getCategoryDetail,
  getClassListByCategoryId
} from '@/repository/academy.repository';
import LanguageContext from '@/store/language/language-context';
import {
  type CategoryAcademyI,
  type DetailClassI,
  type ListParamsI,
  type MetaDataI
} from '@/utils/interfaces/academy.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowBackwardIcon } from 'public/assets/vector';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const CategoryById: React.FC = () => {
  const languageCtx = useContext(LanguageContext);
  const { t } = useTranslation();
  const router = useRouter();
  const { categoryId } = router.query;
  const [categoryDetail, setCategoryDetail] = useState<CategoryAcademyI>();
  const [classList, setClassList] = useState<DetailClassI[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [classLevelActiveTab, setClassLevelActiveTab] = useState<string>('');
  const [classParams, setClassParams] = useState<ListParamsI>({
    page: 1,
    limit: 9,
    search: '',
    status: '',
    level: ''
  });
  const [metaData, setMetaData] = useState<MetaDataI>({
    total: 0,
    currentPage: 0,
    limit: 0,
    totalPage: 0
  });

  const fetchData = async (): Promise<void> => {
    if (categoryId !== undefined) {
      try {
        setLoading(true);
        const categoryDetailRes = await getCategoryDetail(categoryId as string);
        const initialLevel = categoryDetailRes.level[0];
        const classList = await getClassListByCategoryId(
          categoryId as string,
          classParams
        );
        setCategoryDetail(categoryDetailRes);
        setClassList(classList.data);
        setMetaData(classList.metadata);
        setClassLevelActiveTab(initialLevel);
        setClassParams(params => ({ ...params, level: initialLevel }));
      } catch (error) {
        toast(`ERROR fetch data ${error as string}`);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    void fetchData();
  }, [categoryId]);

  const fetchClassList = async (): Promise<void> => {
    if (categoryId !== undefined && classParams.level !== '') {
      try {
        setLoading(true);
        const classList = await getClassListByCategoryId(
          categoryId as string,
          classParams
        );
        setClassList(classList.data);
        setMetaData(classList.metadata);
      } catch (error) {
        toast(`ERROR fetch class list ${error as string}`);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    void fetchClassList();
  }, [categoryId, classParams]);

  const handleLevelChange = (selectedLevel: string): void => {
    setClassParams({
      ...classParams,
      level: selectedLevel
    });
    setClassLevelActiveTab(selectedLevel);
  };

  const aboutText =
    languageCtx.language === 'EN'
      ? categoryDetail?.about.en ?? ''
      : categoryDetail?.about.id ?? '';

  const truncatedAbout = aboutText?.split(' ').slice(0, 50).join(' ');

  const handleShowMore = (): void => {
    setShowFullAbout(!showFullAbout);
  };

  return (
    <PageGradient defaultGradient className="w-full">
      <div className="w-full h-auto py-4 px-4 mb-4 bg-white font-poppins lg:rounded-xl shadow-md">
        <div className="flex justify-between items-center">
          <Image
            src={ArrowBackwardIcon}
            alt="arrow-backward-icon"
            onClick={async () => {
              await router.push('/academy');
            }}
            className="cursor-pointer"
          />
          <Typography className="text-center text-lg font-semibold text-black font-poppins">
            {categoryDetail?.title}
          </Typography>
          <LanguageSelector />
        </div>
      </div>
      <div className="w-full h-auto py-6 px-6 font-poppins bg-white shadow-lg lg:rounded-xl">
        <div className="flex flex-col gap-4 mb-4">
          <Typography className="font-semibold text-lg">
            {t('academy.categoryDetailTitle')}
          </Typography>
          <Typography className=" text-justify text-sm lg:text-base text-[#262626]">
            {showFullAbout ? aboutText : truncatedAbout}
            {aboutText !== '' && aboutText.split(' ').length > 50 && (
              <>
                {' '}
                <button
                  onClick={handleShowMore}
                  className="text-[#3AC4A0] font-semibold underline focus:outline-none"
                >
                  {showFullAbout
                    ? t('academy.categoryDetailShowLess')
                    : t('academy.categoryDetailMoreDetail')}
                </button>
              </>
            )}
          </Typography>
        </div>
        <div className="flex flex-col gap-4">
          <Typography className="font-semibold text-lg">Level</Typography>
          <div className="flex gap-2 mb-4">
            {categoryDetail?.level.map(item => (
              <button
                key={item}
                onClick={() => {
                  handleLevelChange(item);
                }}
                className={`px-4 py-1 font-poppins rounded-full text-sm text-nowrap ${
                  item === classLevelActiveTab
                    ? 'bg-[#3AC4A0] text-white'
                    : 'bg-[#DCFCE4] text-seeds-button-green'
                }`}
              >
                <Typography className="text-xs">{item}</Typography>
              </button>
            ))}
          </div>
        </div>
        {classList.length === 0 && !loading && (
          <NoDataList
            title="academy.noClassesTitle"
            description="academy.noClassesDescription"
          />
        )}
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="my-4">
              <div className="animate-spinner w-14 h-14 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {classList.map(item => (
              <div
                key={item.id}
                className={`py-4 px-3 flex justify-between items-center rounded-2xl relative overflow-hidden ${
                  item?.is_owned
                    ? item.post_test_score !== 0
                      ? 'bg-[#D8F9A8]'
                      : 'bg-[#FFEBEB]'
                    : 'bg-[#DCFCE4]'
                }`}
              >
                <CourseCard item={item} />
              </div>
            ))}
          </div>
        )}
        <ArtPagination
          currentPage={classParams.page}
          totalPages={metaData.totalPage}
          onPageChange={page => {
            setClassParams({ ...classParams, page });
          }}
        />
      </div>
    </PageGradient>
  );
};

export default withAuth(CategoryById);
