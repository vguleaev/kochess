import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { RecipeList } from '@/components/RecipeList';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
});

function Index() {
  const { user } = Route.useRouteContext();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('home.welcome', 'Welcome{{name}}!', { name: user?.name ? `, ${user.name}` : '' })}
          </h1>
        </div>
        <Link to="/create-recipe">
          <Button size="lg">
            <Plus className="mr-1 h-4 w-4" />
            {t('home.addRecipe', 'Add Recipe')}
          </Button>
        </Link>
      </div>
      <p className="text-muted-foreground mb-4">{t('home.description', 'Manage your recipes and meal plans')}</p>

      <RecipeList />
    </div>
  );
}
