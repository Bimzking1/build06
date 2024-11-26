import forkoma from '@/assets/event-highlight/image-20230828-074549.png';
import Footer from '@/components/layouts/Footer';
import Section2Card from '@/containers/landing/Section2Card';
import { eventHighlightLandingPage } from '@/utils/_static/dummy';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import type { Settings } from 'react-slick';
import Slider from 'react-slick';

export default function EventHighlight(): React.ReactElement {
  const { t } = useTranslation();

  const settings: Settings = {
    centerMode: true,
    slidesToShow: 4,
    speed: 500,
    slidesToScroll: 1,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          dots: true,
          slidesToShow: 3
        }
      },
      {
        breakpoint: 768,
        settings: {
          dots: true,
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          dots: true,
          slidesToShow: 1
        }
      }
    ]
  };

  // const carouselSettings: Settings = {
  //   centerMode: true,
  //   slidesToShow: 2,
  //   speed: 500,
  //   slidesToScroll: 1,
  //   dots: true,
  //   responsive: [
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         dots: true,
  //         slidesToShow: 2
  //       }
  //     },
  //     {
  //       breakpoint: 768,
  //       settings: {
  //         dots: true,
  //         slidesToShow: 1
  //       }
  //     },
  //     {
  //       breakpoint: 480,
  //       settings: {
  //         dots: true,
  //         slidesToShow: 1
  //       }
  //     }
  //   ]
  // };

  return (
    <div
      className="absolute overflow-hidden w-full"
      style={{
        backgroundImage: `url(/assets/Event-Highlight.png)`,
        backgroundSize: 'cover'
      }}
    >
      <div className="flex flex-col justify-start items-center">
        {/* Title */}
        <div className="mx-5 md:mx-20 lg:mx-20 text-center mb-4">
          <div className="text-3xl lg:text-4xl font-bold tracking-wide mb-2 text-purple-600">
            Peningkatan Literasi Mahasiswa
          </div>
          <div className="text-base lg:text-lg text-gray-500">
            SEEDS X FORKOMA UI
          </div>
        </div>
        {/* Carousel */}
        <div
          className="w-1/2 my-2 mx-3 md:mx-20 lg:mx-6 rounded-md"
          style={{
            backgroundImage: `url(/assets/BG-Event.png)`,
            backgroundSize: 'cover'
          }}
        >
          <Image alt="FORKOMA UI" src={forkoma} />
          {/* <Slider {...carouselSettings}>
            {eventHighlightLandingPage.map((data, key) => (
            ))}
          </Slider> */}
        </div>
      </div>

      {/* Content */}
      <div className="m-5 md:mx-20 lg:mx-20">
        <div className="opacity-70 text-sm font-semibold tracking-wide mb-2 text-purple-600 md:text-3xl lg:text-[32px] text-left">
          Peningkatan Literasi Mahasiswa
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 text-purple-600"
            >
              <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
              <path
                fillRule="evenodd"
                d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-bold ml-2">Event date:</span>
            <span className="ml-1">3 Agustus 2023</span>
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 text-red-500"
            >
              <path
                fillRule="evenodd"
                d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-bold ml-2">Location:</span>
            <span className="ml-1">Jakarta, Indonesia</span>
          </div>
        </div>

        <div className="text-base text-gray-500 mt-2">
          Melalui kolaborasi ini, Seeds Finance akan menyelenggarakan berbagai
          konten yang mengedukasi dan memanfaatkan sosial media agar semakin
          mudah diakses oleh para mahasiswa Universitas Indonesia dimanapun
          mereka berada. Para mahasiswa Universitas Indonesia akan bisa terus
          mendapatkan wawasan tentang pengelolaan anggaran yang efektif,
          mengelola utang, memahami opsi investasi, dan membangun pondasi
          keuangan yang kuat.
        </div>

        <div className="text-base text-gray-500 mt-2">
          Seeds Finance dan FORKOMA Universitas Indonesia berkomitmen untuk
          menanamkan nilai perencanaan keuangan jangka panjang dan mendorong
          kebiasaan keuangan yang bertanggung jawab di kalangan generasi muda.
          Dengan menggabungkan keahlian antara Seeds Finance dan FORKOMA
          Universitas Indonesia, kolaborasi ini bertujuan untuk mencerdaskan
          generasi muda kalangan milenial dan Gen Z dalam membuat keputusan
          keuangan yang terinformasi dan semakin matang.
        </div>
      </div>
      {/* Text */}
      <div className="mt-10 mx-5 md:mx-20 lg:mx-20">
        <div className="opacity-70 text-sm font-semibold tracking-wide mb-2 text-purple-600 md:text-3xl lg:text-[32px]">
          {t('landing.section2.text5')}
        </div>
        <div className="opacity-70 text-lg text-neutral-400 md:text-xl lg:text-[24px]">
          {t('landing.section2.text6')}
        </div>
      </div>
      {/* Slider */}
      <div className="w-full h-full mb-16 mt-10 mx-3 md:mx-20 lg:mx-6">
        <Slider {...settings}>
          {eventHighlightLandingPage.map((data, key) => (
            <Section2Card key={key} data={data} />
          ))}
        </Slider>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
