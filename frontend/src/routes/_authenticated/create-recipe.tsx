import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { RecipeForm } from '@/components/recipes/RecipeForm';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { recipeApi } from '@/lib/api';
import type { CreateRecipeRequest } from '@kochess/shared/types';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authenticated/create-recipe')({
  component: CreateRecipe,
});

function CreateRecipe() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateRecipeRequest) => recipeApi.create(data),
    onError: (error) => {
      console.error('Failed to create recipe:', error);
      toast.error('Failed to create recipe');
    },
  });

  const handleSubmit = async (data: CreateRecipeRequest) => {
    await createMutation.mutateAsync(data);
    await queryClient.invalidateQueries({ queryKey: ['recipes'] });
    navigate({ to: '/' });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <Button variant="ghost" className="pl-0 gap-2" onClick={() => navigate({ to: '/' })}>
          <ChevronLeft className="h-4 w-4" />
          {t('common.back', 'Back')}
        </Button>
      </div>

      <Card className="">
        <CardHeader>
          <CardTitle className="text-xl font-bold">{t('recipe.add', 'Add Recipe')}</CardTitle>
        </CardHeader>
        <CardContent>
          <RecipeForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
