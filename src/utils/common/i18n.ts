import i18n from 'i18next';
import en from 'public/locales/en';
import id from 'public/locales/id';
import { initReactI18next } from 'react-i18next';

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    lng: 'en',
    fallbackLng: 'en',
    debug: true,

    resources: {
      en: {
        translation: en
      },
      id: {
        translation: id
      }
    },

    interpolation: {
      escapeValue: false
    }
  })
  .catch(err => {
    console.log(err);
  })
  .finally(() => {
    console.log('loaded i18n');
  });

export default i18n;
