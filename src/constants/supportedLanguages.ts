import type { AssetsInterface } from '@/constants/assets';
import { ID, US } from '@/constants/assets/flags';

interface LanguagesInterface {
  lang: string;
  flag: AssetsInterface;
}

const supportedLanguages: Record<string, LanguagesInterface> = {
  ID: {
    lang: 'id',
    flag: ID
  },
  EN: {
    lang: 'en',
    flag: US
  }
};

export default supportedLanguages;
