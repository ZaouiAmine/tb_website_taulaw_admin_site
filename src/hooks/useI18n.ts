import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';

export const useI18n = () => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Explicitly set cookie as backup
    Cookies.set('i18nextLng', lng, { 
      expires: 365, 
      sameSite: 'strict',
      path: '/'
    });
  };

  const isRTL = i18n.language === 'ar';
  
  return {
    t,
    i18n,
    changeLanguage,
    isRTL,
    currentLanguage: i18n.language,
  };
};
