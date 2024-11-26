import React, { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import LanguageContext from './language-context';

interface LanguageProps {
  children: ReactNode;
}

const LanguageProvider: React.FC<LanguageProps> = ({ children }) => {
  const { i18n } = useTranslation();

  const [language, setLanguage] = useState(i18n.language.toUpperCase());

  const languageHandler = (lang: 'EN' | 'ID'): void => {
    setLanguage(lang);
  };

  useEffect(() => {
    if (i18n.language !== language.toLocaleLowerCase()) {
      void i18n.changeLanguage(language.toLowerCase());
    }
  }, [i18n, language]);

  const languageContext = {
    language,
    languageHandler
  };

  return (
    <LanguageContext.Provider value={languageContext}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
