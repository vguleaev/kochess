import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'aws-amplify/auth';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LogOut, Monitor, Globe } from 'lucide-react';
import { useTheme } from '@/contexts/theme-provider';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, loadUser } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const handleSignOut = async () => {
    try {
      await signOut();
      await loadUser();
      navigate({ to: '/sign-in' });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (name: string, email: string) => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return name[0].toUpperCase();
    }
    return email[0].toUpperCase();
  };

  const initials = user ? getInitials(user.name, user.email) : 'U';

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-xl font-semibold text-center mb-6">{t('profile.title')}</h1>

      <Card className="shadow-none bg-gradient-to-br from-primary/25 via-background to-background">
        <div className="flex flex-col items-center justify-center p-8 py-10 text-center relative">
          <div className="h-24 w-24 rounded-full bg-[#fdc700] flex items-center justify-center text-4xl font-bold text-white mb-4">
            {initials}
          </div>
          <div className="space-y-1 relative z-10">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">{user?.name || t('profile.noName')}</h2>
            <p className="text-muted-foreground font-medium">{user?.email || t('profile.noEmail')}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 shadow-none">
        <h3 className="font-semibold text-lg">{t('profile.settings')}</h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="px-2 bg-muted rounded-full">
              <Monitor className="h-4 w-4 text-foreground" />
            </div>
            <span className="font-medium">{t('profile.darkTheme')}</span>
          </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={(checked: boolean) => setTheme(checked ? 'dark' : 'light')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="px-2 bg-muted rounded-full">
              <Globe className="h-4 w-4 text-foreground" />
            </div>
            <span className="font-medium">{t('profile.language')}</span>
          </div>
          <Select value={i18n.language} onValueChange={changeLanguage}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t('profile.language')} />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="en">{t('profile.languages.en')}</SelectItem>
              <SelectItem value="ru">{t('profile.languages.ru')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Button variant="destructive" className="w-full h-12 text-base gap-2" onClick={handleSignOut}>
        <LogOut className="h-5 w-5" />
        {t('profile.logout')}
      </Button>
    </div>
  );
}
