import { Link, useLocation } from '@tanstack/react-router';
import { Home, Utensils, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export const TabBar = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background pb-safe pt-2 px-6 h-16 md:hidden">
      <div className="flex justify-between items-center h-full">
        <Link
          to="/"
          className={cn(
            'flex flex-col items-center justify-center gap-1 w-16 transition-colors',
            isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          )}>
          <Home className="h-6 w-6" />
          <span className="text-[10px] font-medium">{t('navigation.home')}</span>
        </Link>

        <Link
          to="/nutrition"
          className={cn(
            'flex flex-col items-center justify-center gap-1 w-16 transition-colors',
            isActive('/nutrition') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          )}>
          <Utensils className="h-6 w-6" />
          <span className="text-[10px] font-medium">{t('navigation.nutrition')}</span>
        </Link>

        <Link
          to="/profile"
          className={cn(
            'flex flex-col items-center justify-center gap-1 w-16 transition-colors',
            isActive('/profile') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          )}>
          <User className="h-6 w-6" />
          <span className="text-[10px] font-medium">{t('navigation.profile')}</span>
        </Link>
      </div>
    </div>
  );
};
