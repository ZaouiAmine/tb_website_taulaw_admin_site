import { useI18n } from '@/hooks/useI18n';
import PageHeading from './PageHeading';

interface PageWrapperProps {
  heading?: string;
  path?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export default function PageWrapper({ 
  heading, 
  path = '', 
  children, 
  className = '',
  actions
}: PageWrapperProps) {
  const { isRTL } = useI18n();

  return (
    <div className={`${isRTL ? 'rtl' : 'ltr'} ${className}`}>
      {heading && (
        <PageHeading 
          heading={heading} 
          path={path}
        >
          {actions}
        </PageHeading>
      )}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
