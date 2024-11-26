import common from '@/utils/common';
import type { ILanguage } from '@/utils/interfaces/components.interfaces';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Dropdown from './Dropdown';

export default function LanguageSwitcher(): React.ReactElement {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: ILanguage): void => {
    void i18n.changeLanguage(lng.id);
  };

  return <Dropdown options={common.langOptions} onClick={changeLanguage} />;
}
