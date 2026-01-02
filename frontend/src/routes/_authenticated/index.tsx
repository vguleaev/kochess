import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { RecipeList } from '@/components/RecipeList';
import { Plus } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
});

function Index() {
  const { user } = Route.useRouteContext();

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome{user?.name ? `, ${user.name}` : ''}!</h1>
          <p className="text-muted-foreground mt-1">Manage your recipes and meal plans</p>
        </div>
        <Button size="lg">
          <Plus />
          Add Recipe
        </Button>
      </div>

      <RecipeList />
    </div>
  );
}
