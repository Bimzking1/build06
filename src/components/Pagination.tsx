import { useEffect, useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  const [inputPage, setInputPage] = useState<any>(currentPage);

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputPage(e.target.value);
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
        <a
          key={i}
          href="#"
          className={`${
            i === currentPage ? 'text-white bg-[#5932EA]' : 'text-[#262626]'
          } rounded-md w-32 h-6 mx-2 inline-flex justify-center items-center text-xs`}
          onClick={() => {
            handlePageButtonClick(i);
          }}
        >
          {i}
        </a>
      );
    }

    return buttons;
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <a
        href="#"
        onClick={handlePreviousPage}
        className="w-full font-semibold rounded-lg mx-5 text-white bg-[#DED6FF] inline-flex justify-center items-center"
      >
        Previous
      </a>
      {generatePageButtons()}
      <a
        href="#"
        onClick={handleNextPage}
        className="w-full font-semibold rounded-lg mx-5 text-[#5932EA] inline-flex border bg-[#DED6FF] justify-center items-center"
      >
        Next
      </a>
      <div className="flex-none ml-4">
        <input
          onChange={handleInputChange}
          value={inputPage}
          type="text"
          className="rounded-xl border border-[#5932EA] block px-2 text-[#262626] text-sm h-[28px] w-16 placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9]"
        />
      </div>
    </div>
  );
};

export default Pagination;
