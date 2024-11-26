import { tournamentTop } from '@/repository/asset.repository';
import { Typography } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import type { Settings } from 'react-slick';
import Slider from 'react-slick';

interface tournamentInterface {
  id: string;
  play_id: string;
  name: string;
  banner: string;
  type: string;
}
export default function CardTournament(): React.ReactElement {
  const [tournament, setTournament] = useState<tournamentInterface[]>();
  const [isLoadingTournament, setIsLoadingTournament] = useState(false);

  const settings: Settings = {
    slidesToShow: 3,
    speed: 500,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  const fetchTopTournament = async (): Promise<void> => {
    try {
      setIsLoadingTournament(true);
      tournamentTop()
        .then(res => {
          setTournament(res.data);
          setIsLoadingTournament(false);
        })
        .catch(err => {
          console.log(err);
          setIsLoadingTournament(false);
        });
    } catch (error: any) {
      setIsLoadingTournament(false);
      console.error('Error fetching tournament data:', error.message);
    }
  };

  const handlePrevClick = (): void => {
    const prevArrowElement = document.querySelector(
      '.slick-arrow.slick-prev'
    ) as HTMLButtonElement;

    if (prevArrowElement !== null) {
      prevArrowElement.click();
    }
  };

  const handleNextClick = (): void => {
    const prevArrowElement = document.querySelector(
      '.slick-arrow.slick-next'
    ) as HTMLButtonElement;

    if (prevArrowElement !== null) {
      prevArrowElement.click();
    }
  };

  useEffect(() => {
    fetchTopTournament()
      .then()
      .catch(() => {});
  }, []);

  function isImageUrlValid(url: string): boolean {
    return (
      (url?.startsWith('http://') || url?.startsWith('https://')) &&
      !url?.startsWith(
        'https://seeds-bucket-new.s3.ap-southeast-3.amazonaws.com'
      )
    );
  }

  return (
    <>
      {tournament !== undefined && (
        <>
          <div className="my-5">
            {isLoadingTournament ? (
              <Typography className="w-full text-base font-semibold text-center">
                Loading....
              </Typography>
            ) : tournament.length !== 0 ? (
              <Slider {...settings}>
                {tournament.map((data, idx) => {
                  const defaultCircle = '/assets/default-circle.png';
                  const imageUrl = data?.banner ?? defaultCircle;
                  const isImageValid = isImageUrlValid(imageUrl);
                  return (
                    <div className="relative overflow-hidden mr-2" key={idx}>
                      <div className="rounded-lg shadow-md p-2">
                        <div className="flex items-center">
                          {isImageValid ? (
                            <img
                              src={`${data.banner}`}
                              alt={data.name}
                              className="w-full xl:h-full h-full object-fill rounded-[26px] mr-5"
                            />
                          ) : (
                            <img
                              src={defaultCircle}
                              alt={data.name}
                              className="w-full xl:h-full h-full object-fill rounded-[26px] mr-5"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            ) : (
              <p>Not found</p>
            )}
            <div className="flex justify-center mt-8">
              <div className="mt-5 pb-10 pagination">
                <div className="bg-white rounded-full cursor-pointer flex flex-row gap-3 p-2 shadow-lg">
                  <div className="p-2" onClick={handlePrevClick}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M12.5 15L7.5 10L12.5 5"
                        stroke="#7C7C7C"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div
                    className="rounded-full p-2 bg-gradient-to-r cursor-pointer from-[#9A76FE] to-[#4FE6AF]"
                    onClick={handleNextClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M7.5 15L12.5 10L7.5 5"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
