// Translation utility to help with quick page translation
import { useTranslation } from 'react-i18next';

// Helper hook for page translations
export const usePageTranslation = (pageKey: string) => {
  const { t, i18n } = useTranslation();
  
  return {
    t: (key: string) => t(`pages.${pageKey}.${key}`),
    common: (key: string) => t(`common.${key}`),
    form: (key: string) => t(`forms.${key}`),
    nav: (key: string) => t(`navigation.${key}`),
    isRTL: i18n.language === 'ar',
    currentLanguage: i18n.language,
  };
};

// Common translations for repeated use
export const COMMON_TRANSLATIONS = {
  save: 'common.save',
  cancel: 'common.cancel',
  edit: 'common.edit',
  delete: 'common.delete',
  add: 'common.add',
  view: 'common.view',
  actions: 'common.actions',
} as const;
