import { createContext } from 'react';

const LanguageContext = createContext({
  language: 'EN',
  languageHandler: (lang: 'EN' | 'ID'): void => {}
});

export default LanguageContext;
