import aisec from '@/assets/landing-page/PLAY-WEB-AIESEC-USU-WEEK-2.png';
import telkom from '@/assets/landing-page/PLAY-WEB-HIMA-MBTI-TELKOM.png';
import johnny from '@/assets/landing-page/PLAY-WEB-JOHNNY-WIDODO.png';
import firda from '@/assets/landing-page/PLAY-WEB-MAIN-BARENG-FIRDA.png';
import connectCircle from '@/assets/landing-page/connectCircle.png';
import card1 from '@/assets/landing-page/s2-card-1.png';
import card2 from '@/assets/landing-page/s2-card-2.png';
import card3 from '@/assets/landing-page/s2-card-3.png';
import testi1 from '@/assets/landing-page/testi1.jpg';
import testi2 from '@/assets/landing-page/testi2.jpg';
import testi3 from '@/assets/landing-page/testi3.jpg';
import testi4 from '@/assets/landing-page/testi4.jpg';
import testi5 from '@/assets/landing-page/testi5.jpg';
import testi6 from '@/assets/landing-page/testi6.jpg';
import testi7 from '@/assets/landing-page/testi7.jpg';
import user2 from '@/assets/landing-page/user-sample-2.png';
import user1 from '@/assets/landing-page/user-sample.png';
import type {
  ICircleLandingPage,
  ICompetitionItem,
  IEventHighlightLandingPage,
  ILastNews
} from '../interfaces/components.interfaces';

export const latestNews: ILastNews[] = [
  {
    topic: 'Trends',
    title: ' Apple : New fitur from Iphone 13 pro',
    photo: card1,
    user: {
      photo: user1,
      name: 'Robert Hans'
    },
    createdAt: '12.00'
  },
  {
    topic: 'Crypto',
    title: ' Bitcoin : Good news for you! ',
    photo: card2,
    user: {
      photo: user2,
      name: 'Margaretha'
    },
    createdAt: '5.00'
  },
  {
    topic: 'US Stocks',
    title: ' Tesla : Something bigger is coming',
    photo: card3,
    user: {
      photo: user2,
      name: 'Margaretha'
    },
    createdAt: '5.00'
  }
];

export const competitionCardList: ICompetitionItem[] = [
  {
    photo: johnny,
    gift: 1750000,
    title: 'SEEDS X JOHNNY WIDODO',
    participant: {
      total: 5,
      max: 10
    },
    start: new Date('2023-08-25'),
    end: new Date('2023-08-28'),
    status: 'paid'
  },
  {
    photo: aisec,
    gift: 1000000,
    title: 'SEEDS X AIESEC USU WEEK 2',
    participant: {
      total: 5,
      max: 10
    },
    start: new Date('2023-08-16'),
    end: new Date('2023-08-28'),
    status: 'paid'
  },
  {
    photo: telkom,
    gift: 450000,
    title: 'SEEDS X EDUPRENEUR TELKOM',
    participant: {
      total: 5,
      max: 10
    },
    start: new Date('2023-08-17'),
    end: new Date('2023-08-17'),
    status: 'paid'
  },
  {
    photo: firda,
    gift: 500000,
    title: 'SEEDS MAIN BARENG FIRDA',
    participant: {
      total: 5,
      max: 10
    },
    start: new Date('2023-08-22'),
    end: new Date('2023-09-04'),
    status: 'paid'
  }
];

export const circleTrendingLandingPage: ICircleLandingPage[] = [
  {
    id: '1',
    image: connectCircle,
    banner:
      'https://seeds-bucket.s3.ap-southeast-1.amazonaws.com/seeds1667480950752GURUCUAN-banner.jpeg',
    name: 'Circle Name 1',
    totalMember: 20,
    totalRating: 10
  },
  {
    id: '2',
    image: connectCircle,
    banner:
      'https://seeds-bucket.s3.ap-southeast-1.amazonaws.com/seeds1667480950752GURUCUAN-banner.jpeg',
    name: 'Circle Name 2',
    totalMember: 20,
    totalRating: 10
  },
  {
    id: '3',
    image: connectCircle,
    banner:
      'https://seeds-bucket.s3.ap-southeast-1.amazonaws.com/seeds1667480950752GURUCUAN-banner.jpeg',
    name: 'Circle Name 3',
    totalMember: 20,
    totalRating: 10
  }
];

export const eventHighlightLandingPage: IEventHighlightLandingPage[] = [
  {
    id: '1',
    name: 'Andhika Septigraha',
    title: 'Edupreneur Telkom',
    image: testi1,
    comment:
      'Halo nama saya Andhika Septigraha, saya panitia Edupreneur 2023 dan mau mengucapkan terima kasih kepada aplikasi Seeds. Dan alhamdulliah dari aplikasi tersebut saya mendapatkan juara 1, sekali lagi saya ingin mengucapkan terima kasih. Bagi teman-teman yang belum download aplikasi Seeds, silahkan download dan tinggal dimainkan saja, karena itu mudah sekali'
  },
  {
    id: '2',
    name: 'Amiyeri',
    title: 'Edupreneur Telkom',
    image: testi2,
    comment:
      'Halo kenalin namaku Amiyel, disini aku mau berterima kasih kepada aplikasi Seeds karena sudah memberikan aku kesempatan untuk belajar trading sekaligus mempraktekan secara langsung….. Dan juga terima kasih karena sudah memberikan aku kesempatan untuk menang. Aku tahu aplikasi Seeds ini karena ada teman aku yang kasih tahu, lalu dari situ aku mulai cari tahu tuh gimana sih sistemnya karena kan di aplikasi Seeds ini tuh ada banyak fitur-fitur tenang belajar trading yang pastinya bisa banget dipelajarin. Oh iya di aplikasi Seeds ini tuh ga cuman belajar trading dan mempraktikannya secara langsung lho…. Masih banyak lagi keuntungan yang bisa didapat, salah satunya dapat uang tunai kalau kalian berkesempatan menang di Play Arena nanti. Jadi tunggu apalagi, langsung aja kunjungi situs web aplikasi Seeds dan daftar sekarang juga! Terima kasih!'
  },
  {
    id: '3',
    name: 'Ariandra Akbar',
    title: 'Edupreneur Telkom',
    image: testi3,
    comment:
      'Mau berterima kasih kepada aplikasi Seeds….. Aplikasinya keren banget dan alhamdulliahnya kemarin aku juara 3…. Sekali lagi terima kasih, buat yang belum download, silahkan download dan langsung mainin aja ya'
  },
  {
    id: '4',
    name: 'Syalwa',
    title: 'Juara 1 SPECIAL ARENA TOURNAMENT Seeds x JOHNNY WIDODO',
    image: testi4,
    comment:
      "Hi, I'm Syalwa Regina, I’m the winner of Seeds Trading Competition. I was genuinely shocked when I unexpectedly won this tournament because I have no trading experience. There is a feature named “Connect” that allows me to interact with people who are more experienced in trading. It certainly helped me to win this competition and also gained some knowledge about investment and trading. For those who want to learn how to trade, download the app right away, play the virtual trading arena and become a champion like me!"
  },
  {
    id: '5',
    name: 'Fitria',
    title: 'Juara 2 SPECIAL ARENA TOURNAMENT Seeds x JOHNNY WIDODO',
    image: testi5,
    comment:
      "To be honest, I wasn't expecting to win because I knew nothing about trading. However, this is a whole package because there is a Connect Feature where  I can discuss with people who are experts in their fields, especially trading. As a result, it expands my understanding of trading, allowing me to apply what I’ve learned in the virtual trading game. Thank you so much Seeds!"
  },
  {
    id: '6',
    name: 'Alvin',
    title: 'Juara 3 SPECIAL ARENA TOURNAMENT Seeds x JOHNNY WIDODO',
    image: testi6,
    comment:
      'Seeds is a social investing platform that allows beginner investors like me to experience the real investing journey through gamification and ofc no risk at all! Overall, it’s a great app! I can learn and have fun at the same time! 😆'
  },
  {
    id: '7',
    name: 'Mahes',
    title: 'Juara 1 Seeds Special Tournament Independence Day',
    image: testi7,
    comment:
      'This virtual trading tournament could be a simulation for me to practice before diving into live trading!'
  }
];
