import { useQuery } from '@tanstack/react-query';
import { recipeApi } from '@/lib/api';
import type { Recipe } from '@kochess/shared/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, ChefHat, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';

export function RecipeList() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredRecipes = data.recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('recipe.searchPlaceholder', 'Search recipes...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>{t('recipe.noResults', 'No recipes found matching your search.')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

interface RecipeCardProps {
  recipe: Recipe;
}

function getGradient(id: string) {
  const gradients = [
    'bg-gradient-to-br from-[#fbc2eb] to-[#a6c1ee]',
    'bg-gradient-to-br from-[#e0c3fc] to-[#8ec5fc]',
    'bg-gradient-to-br from-[#ff9a9e] to-[#fecfef]',
    'bg-gradient-to-br from-[#a18cd1] to-[#fbc2eb]',
    'bg-gradient-to-br from-[#fad0c4] to-[#ffd1ff]',
    'bg-gradient-to-br from-[#ffecd2] to-[#fcb69f]',
    'bg-gradient-to-br from-[#84fab0] to-[#8fd3f4]',
    'bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb]',
    'bg-gradient-to-br from-[#cfd9df] to-[#e2ebf0]',
    'bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]',
  ];

  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  return gradients[Math.abs(hash) % gradients.length];
}

function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link to="/edit-recipe/$recipeId" params={{ recipeId: recipe.id }} className="block">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col pt-0">
        <div
          className={`aspect-video w-full overflow-hidden ${typeof recipe.photo === 'string' && recipe.photo.length > 0 ? 'bg-muted' : getGradient(recipe.id)}`}>
          {typeof recipe.photo === 'string' && recipe.photo.length > 0 ? (
            <img src={recipe.photo} alt={recipe.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-20">
              <ChefHat className="w-16 h-16 text-black/50 mix-blend-overlay" />
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-1">{recipe.title}</CardTitle>
          {recipe.description && <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>}
        </CardHeader>
        {recipe.ingredients && (
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground line-clamp-3">{recipe.ingredients}</p>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
