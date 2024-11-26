import {
  removeLocalStorage,
  setLocalStorage
} from '@/utils/common/localStorage';
import { isUndefindOrNull } from '@/utils/common/utils';

export const setTranslationToLocalStorage = async (
  language: 'EN' | 'ID'
): Promise<void> => {
  try {
    const translation = localStorage.getItem('translation');
    if (!isUndefindOrNull(translation)) {
      removeLocalStorage('translation');
    }
    setLocalStorage('translation', language);
  } catch (error) {
    console.log(error);
  }
};
