import type { Settings } from '@ant-design/react-slick';
import welcome from 'public/assets/story-boarding/bg-welcome-seeds.png';
import iconDoc from 'public/assets/story-boarding/doc.svg';
import en from 'public/assets/story-boarding/en.png';
import id from 'public/assets/story-boarding/id.png';
import welcome2 from 'public/assets/story-boarding/slide2.png';
import welcome3 from 'public/assets/story-boarding/slide3.png';
import welcome4 from 'public/assets/story-boarding/slide4.png';

const onboardingSlideAssets = (t: any): any => {
  return [
    {
      image: welcome,
      title: t('register.slide.title.1'),
      text: t('register.slide.text.1')
    },
    {
      image: welcome2,
      title: t('register.slide.title.2'),
      text: t('register.slide.text.2')
    },
    {
      image: welcome3,
      title: t('register.slide.title.3'),
      text: t('register.slide.text.3')
    },
    {
      image: welcome4,
      title: t('register.slide.title.4'),
      text: t('register.slide.text.4')
    }
  ];
};

const slideSettings: Settings = {
  dots: true,
  infinite: true,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true
};

const langOptions = [
  { id: 'en', label: 'EN', icon: en },
  { id: 'id', label: 'ID', icon: id }
];

const sliderSample: any = {
  bootstrap: [
    {
      id: 1,
      title: 'Photography',
      body: 'Bootstrap Carousel Example',
      imageUrl:
        'https://res.cloudinary.com/kizmelvin/image/upload/v1586799813/kizmelvin/persons_pigeon_nurkq2.jpg',
      docs: 'https://getbootstrap.com/docs/4.0/components/carousel/'
    },
    {
      id: 2,
      title: 'City Views',
      body: 'Bootstrap Carousel Example',
      imageUrl:
        'https://res.cloudinary.com/kizmelvin/image/upload/v1587785064/kizmelvin/michael-BcgEo2CNeYA-unsplash_cdaruk.jpg',
      docs: 'https://getbootstrap.com/docs/4.0/components/carousel/'
    },
    {
      id: 3,
      title: 'Wild Life',
      body: 'Bootstrap Carousel Example',
      imageUrl:
        'https://res.cloudinary.com/kizmelvin/image/upload/v1586799827/kizmelvin/brownlion_qm8hah.jpg',
      docs: 'https://getbootstrap.com/docs/4.0/components/carousel/'
    },
    {
      id: 4,
      title: 'Foods and Culture',
      body: 'Bootstrap Carousel Example',
      imageUrl:
        'https://res.cloudinary.com/kizmelvin/image/upload/v1587870308/kizmelvin/edvin-johansson-5AylXcpJn1I-unsplash_lbhgod.jpg',
      docs: 'https://getbootstrap.com/docs/4.0/components/carousel/'
    }
  ],
  elastic: [
    {
      id: 1,
      title: 'Photoshoots',
      imageUrl:
        'https://res.cloudinary.com/kizmelvin/image/upload/c_scale,w_622/v1645534321/kizmelvin/Carousel%20assets/luwadlin-bosman-J1oObe7WWjk-unsplash_f56oh3.jpg'
    },
    {
      id: 2,
      title: 'Adventure',
      imageUrl:
        'https://res.cloudinary.com/kizmelvin/image/upload/c_scale,w_622/v1645529949/kizmelvin/Carousel%20assets/ali-kazal-q9rpNOd1hcI-unsplash_fhaqzq.jpg'
    },
    {
      id: 3,
      title: 'Events',
      imageUrl:
        'https://res.cloudinary.com/kizmelvin/image/upload/c_scale,w_622/v1645530199/kizmelvin/Carousel%20assets/slim-emcee-jzdOX0XkXr8-unsplash_zocsdq.jpg'
    },
    {
      id: 4,
      title: 'Discovery',
      imageUrl:
        'https://res.cloudinary.com/kizmelvin/image/upload/c_scale,w_622/v1645530863/kizmelvin/Carousel%20assets/francisco-t-santos-YRcioOWh4mA-unsplash_1_yoowse.jpg'
    },
    {
      id: 5,
      title: 'Sports',
      imageUrl:
        'https://res.cloudinary.com/kizmelvin/image/upload/c_scale,w_622/v1645531100/kizmelvin/Carousel%20assets/markus-spiske-WUehAgqO5hE-unsplash_zi9wvh.jpg'
    }
  ],
  swiper: [
    {
      id: 1,
      title: 'Responsive Carousel Example',
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste quos mollitia sed quod consectetur at quam dolore praesentium neque eos assumenda iusto nam laborum laboriosam odio blanditiis possimus accusantium recusandae porro exercitationem itaque, illo unde deserunt! Tempore, nobis! Enim nobis porro dicta odit iure, pariatur veritatis velit nemo hic distinctio!',
      imageUrl:
        'https://res.cloudinary.com/kizmelvin/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1597364662/kizmelvin/ussama-azam-hlg-ltdCoI0-unsplash_ttfjib.jpg'
    },
    {
      id: 2,
      title: 'Responsive Carousel Example',
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste quos mollitia sed quod consectetur at quam dolore praesentium neque eos assumenda iusto nam laborum laboriosam odio blanditiis possimus accusantium recusandae porro exercitationem itaque, illo unde deserunt! Tempore, nobis! Enim nobis porro dicta odit iure, pariatur veritatis velit nemo hic distinctio!',
      imageUrl:
        'https://res.cloudinary.com/kizmelvin/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1645530199/kizmelvin/Carousel%20assets/slim-emcee-jzdOX0XkXr8-unsplash_zocsdq.jpg'
    },
    {
      id: 3,
      title: 'Responsive Carousel Example',
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste quos mollitia sed quod consectetur at quam dolore praesentium neque eos assumenda iusto nam laborum laboriosam odio blanditiis possimus accusantium recusandae porro exercitationem itaque, illo unde deserunt! Tempore, nobis! Enim nobis porro dicta odit iure, pariatur veritatis velit nemo hic distinctio!',
      imageUrl:
        'https://res.cloudinary.com/kizmelvin/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1645534321/kizmelvin/Carousel%20assets/luwadlin-bosman-J1oObe7WWjk-unsplash_f56oh3.jpg'
    }
  ]
};

export const passwordRequirements: string[] = [
  'forgot.createNewPassword.8',
  'forgot.createNewPassword.9',
  'forgot.createNewPassword.10',
  'forgot.createNewPassword.11'
];

const legal: any = {
  termsConditions: [
    {
      label: 'Terms & Conditions',
      icon: iconDoc,
      title:
        'TERMS OF USE/ KETENTUAN PEMILIK CIRCLE CIRCLE OWNER/PEMILIK CIRCLE',
      description: ''
    }
  ]
};

const _static = {
  onboardingSlideAssets,
  slideSettings,
  langOptions,
  sliderSample,
  legal
};
const index = {
  _static,
  langOptions,
  slideSettings,
  onboardingSlideAssets
};

export default index;
