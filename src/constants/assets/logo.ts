import type { AssetsInterface } from '.';

export const SeedsLogo: AssetsInterface = {
  src: '/assets/images/SeedsTypo.png',
  alt: 'seeds-logo-typograph'
};

export const FacebookBrand: AssetsInterface = {
  src: '/assets/images/facebook.svg',
  alt: 'facebook'
};

export const GoogleBrand: AssetsInterface = {
  src: '/assets/images/google.svg',
  alt: 'google'
};

export const AppleBrand: AssetsInterface = {
  src: '/assets/images/apple.svg',
  alt: 'apple'
};

const Logo: Record<string, AssetsInterface> = {
  SeedsLogo,
  FacebookBrand,
  GoogleBrand,
  AppleBrand
};

export default Logo;
