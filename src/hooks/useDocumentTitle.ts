import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const routeTitleMap: Record<string, string> = {
  '/': 'navigation.dashboard',
  '/lawyer-requests': 'navigation.lawyerRequests',
  '/admin/banners': 'navigation.adsManagement',
  '/lawyer-packages': 'navigation.lawyerPackages',
  '/transactions': 'navigation.transactions',
  '/dropdown-management/case-phase': 'navigation.casePhase',
  '/dropdown-management/case-category': 'navigation.caseCategory',
  '/dropdown-management/case-chamber': 'navigation.caseChamber',
  '/dropdown-management/specialization': 'navigation.specialization',
  '/admin/states': 'navigation.states',
};

const specificPageTitleMap: Record<string, string> = {
  '/dropdown-management/case-phase/add-case-phase': 'pages.casePhase.addTitle',
  '/dropdown-management/case-phase/edit-case-phase': 'pages.casePhase.editTitle',
  '/dropdown-management/case-category/add-case-category': 'pages.caseCategory.addTitle',
  '/dropdown-management/case-category/edit-case-category': 'pages.caseCategory.editTitle',
  '/dropdown-management/case-chamber/add-case-chamber': 'pages.caseChamber.addTitle',
  '/dropdown-management/case-chamber/edit-case-chamber': 'pages.caseChamber.editTitle',
  '/dropdown-management/specialization/add-specialization': 'pages.specialization.addTitle',
  '/dropdown-management/specialization/edit-specialization': 'pages.specialization.editTitle',
  '/admin/states/add-state': 'pages.states.addTitle',
  '/admin/states/edit-state': 'pages.states.editTitle',
  '/admin/banners/add': 'pages.banners.addTitle',
  '/admin/banners/edit': 'pages.banners.editTitle',
};

export const useDocumentTitle = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    
    let titleKey = specificPageTitleMap[pathname];
    
    if (!titleKey) {
      titleKey = routeTitleMap[pathname];
    }
    
    if (!titleKey) {
      const pathSegments = pathname.split('/').filter(Boolean);
      for (let i = pathSegments.length; i > 0; i--) {
        const testPath = '/' + pathSegments.slice(0, i).join('/');
        if (routeTitleMap[testPath]) {
          titleKey = routeTitleMap[testPath];
          break;
        }
      }
    }
    
    if (!titleKey) {
      titleKey = 'navigation.dashboard';
    }
    
    const title = t(titleKey);
    document.title = title;
    
    const htmlElement = document.documentElement;
    htmlElement.lang = t('dir') === 'rtl' ? 'ar' : t('dir') === 'ltr' ? 'en' : 'fr';
    
  }, [location.pathname, t]);
};
