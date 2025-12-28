import { useQuery } from '@tanstack/react-query';
import { recipeApi } from '@/lib/api';
import type { Recipe } from '@/types/recipe';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { ChefHat, AlertCircle } from 'lucide-react';

export function RecipeList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recipes'],
    queryFn: recipeApi.list,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="size-8" />
          <p className="text-sm text-muted-foreground">Loading recipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3 text-center max-w-md">
          <AlertCircle className="size-12 text-destructive" />
          <div>
            <h3 className="font-semibold text-lg mb-1">Failed to load recipes</h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.recipes || data.recipes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3 text-center max-w-md">
          <ChefHat className="size-16 text-muted-foreground" />
          <div>
            <h3 className="font-semibold text-lg mb-1">No recipes yet</h3>
            <p className="text-sm text-muted-foreground">
              Get started by creating your first recipe. Click the "Add Recipe" button to begin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}

interface RecipeCardProps {
  recipe: Recipe;
}

function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      {recipe.photo && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img src={recipe.photo} alt={recipe.title} className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-1">{recipe.title}</CardTitle>
        {recipe.description && <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>}
      </CardHeader>
      {recipe.ingredients && (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">{recipe.ingredients}</p>
        </CardContent>
      )}
    </Card>
  );
}
