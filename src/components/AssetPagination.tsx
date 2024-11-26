import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  colorGoTo?: string;
}

const AssetPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  colorGoTo
}) => {
  const [inputPage, setInputPage] = useState(currentPage);

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputPage(parseInt(e.target.value, 10));
  };

  const handlePageChange = (): void => {
    if (inputPage >= 1 && inputPage <= totalPages) {
      onPageChange(inputPage);
    } else {
      setInputPage(currentPage);
    }
  };

  const handlePreviousPage = (): void => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = (): void => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageButtonClick = (page: number): void => {
    onPageChange(page);
  };

  const generatePageButtons = (): React.ReactNode => {
    const buttons = [];
    const maxButtons = 7;
    const halfMaxButtons = Math.floor(maxButtons / 2);
    let start: number = Math.max(1, currentPage - halfMaxButtons);
    const end: number = Math.min(start + maxButtons - 1, totalPages);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      buttons.push(
        <div
          key={i}
          className={`${
            i.toString() === currentPage.toString()
              ? 'text-white bg-[#3AC4A0]'
              : 'text-[#262626]'
          } rounded-full w-6 h-6 mx-2 inline-flex justify-center items-center text-xs cursor-pointer`}
          onClick={() => {
            handlePageButtonClick(i);
          }}
        >
          {i}
        </div>
      );
    }

    return buttons;
  };

  return (
    <>
      <div className="hidden lg:grid grid-cols-10 gap-4 mt-4">
        <div className="col-span-2" />
        <div className="col-span-6 pt-[1px]">
          <div className="flex justify-center items-center">
            <div
              onClick={handlePreviousPage}
              className="w-6 h-6 mx-2 text-[#262626] inline-flex justify-center items-center cursor-pointer"
            >
              <ChevronLeftIcon className="h-4 w-4 text-[#262626]" />
            </div>
            {generatePageButtons()}
            <div
              onClick={handleNextPage}
              className="w-6 h-6 mx-2 text-[#262626] inline-flex justify-center items-center cursor-pointer"
            >
              <ChevronRightIcon className="h-4 w-4 text-[#262626]" />
            </div>
          </div>
        </div>
        <div className="col-span-2 me-12" id="#">
          <div className="flex justify-center items-center gap-4">
            <div className="flex-none">
              <div
                className={`text-xs h-[23px] leading-[23px] block text-[${
                  colorGoTo ?? '#BDBDBD'
                }]`}
              >
                Go to page
              </div>
            </div>
            <div className="flex-1">
              <input
                onChange={handleInputChange}
                value={inputPage}
                type="text"
                className="rounded-full w-12 border border-[#3AC4A0] block  px-2 text-[#262626] text-sm h-[23px] placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9]"
              />
            </div>
            <div className="flex-1">
              <button
                type="button"
                onClick={handlePageChange}
                className="inline-flex items-center px-4 h-[23px] border border-transparent text-xs font-semibold rounded-full text-white bg-[#3AC4A0] cursor-pointer"
              >
                Go
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:hidden grid grid-cols-1">
        <div className="col-span-1 pt-[1px]">
          <div className="flex justify-center items-center">
            <div
              onClick={handlePreviousPage}
              className="w-6 h-6 mx-2 text-[#262626] inline-flex justify-center items-center cursor-pointer"
            >
              <ChevronLeftIcon className="h-4 w-4 text-[#262626]" />
            </div>
            {generatePageButtons()}
            <div
              onClick={handleNextPage}
              className="w-6 h-6 mx-2 text-[#262626] inline-flex justify-center items-center cursor-pointer"
            >
              <ChevronRightIcon className="h-4 w-4 text-[#262626]" />
            </div>
          </div>
          <div className="flex justify-center pt-2">
            <div className="flex justify-center items-center gap-4">
              <div className="flex-none">
                <div
                  className={`text-xs h-[23px] leading-[23px] block text-[${
                    colorGoTo ?? '#BDBDBD'
                  }]`}
                >
                  Go to page
                </div>
              </div>
              <div className="flex-1">
                <input
                  onChange={handleInputChange}
                  value={inputPage}
                  type="text"
                  className="rounded-full w-12 border border-[#3AC4A0] block  px-2 text-[#262626] text-sm h-[23px] placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9]"
                />
              </div>
              <div className="flex-1">
                <button
                  type="button"
                  onClick={handlePageChange}
                  className="inline-flex items-center px-4 h-[23px] border border-transparent text-xs font-semibold rounded-full text-white bg-[#3AC4A0] cursor-pointer"
                >
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssetPagination;
