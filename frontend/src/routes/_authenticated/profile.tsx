import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'aws-amplify/auth';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useTheme } from '@/contexts/theme-provider';
import { useTranslation } from 'react-i18next';

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
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="max-w-md mx-auto space-y-8">
        <div className="flex items-center justify-center relative">
          <h1 className="text-xl font-semibold">{t('profile.title')}</h1>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-3xl font-medium text-muted-foreground overflow-hidden relative">
            <div className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center text-primary">
              {initials}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="font-medium">{t('profile.name')}</span>
              <div className="flex items-center text-muted-foreground">
                <span className="mr-2">{user?.name || t('profile.noName')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <span className="font-medium">{t('profile.email')}</span>
              <div className="flex items-center text-muted-foreground">
                <span className="mr-2">{user?.email || t('profile.noEmail')}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="font-medium">{t('profile.darkTheme')}</span>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked: boolean) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="font-medium">{t('profile.language')}</span>
              <Select value={i18n.language} onValueChange={changeLanguage}>
                <SelectTrigger className="w-[130px] text-muted-foreground">
                  <SelectValue placeholder={t('profile.language')} />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="en">{t('profile.languages.en')}</SelectItem>
                  <SelectItem value="ru">{t('profile.languages.ru')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <Button variant="destructive" className="w-full h-12 rounded-xl text-base gap-2" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
            {t('profile.logout')}
          </Button>
        </div>
      </div>
    </div>
  );
}
