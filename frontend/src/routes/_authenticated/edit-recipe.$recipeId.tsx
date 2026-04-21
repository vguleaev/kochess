import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { RecipeForm } from '@/components/recipes/RecipeForm';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { recipeApi } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateRecipeRequest } from '@kochess/shared/types';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authenticated/edit-recipe/$recipeId')({
  component: EditRecipe,
});

function EditRecipe() {
  const { recipeId } = Route.useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => recipeApi.get(recipeId),
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateRecipeRequest) => recipeApi.update(recipeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipe', recipeId] });
      navigate({ to: '/' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => recipeApi.delete(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      navigate({ to: '/' });
    },
    onError: (error) => {
      console.error('Failed to delete recipe:', error);
      setIsDeleting(false);
      setShowDeleteDialog(false);
    },
  });

  const handleSubmit = async (data: CreateRecipeRequest) => {
    try {
      await updateMutation.mutateAsync(data);
    } catch (error) {
      console.error('Failed to update recipe:', error);
      toast.error('Failed to update recipe');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteMutation.mutateAsync();
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-destructive mb-4">{error ? 'Failed to load recipe' : 'Recipe not found'}</p>
        <Button onClick={() => navigate({ to: '/' })}>{t('common.goBack', 'Go Back')}</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <Button variant="ghost" className="pl-0 gap-2" onClick={() => navigate({ to: '/' })}>
          <ChevronLeft className="h-4 w-4" />
          {t('common.back', 'Back')}
        </Button>
      </div>

      <Card className="border-none shadow-none sm:border sm:shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t('recipe.edit', 'Edit Recipe')}</CardTitle>
        </CardHeader>
        <CardContent>
          <RecipeForm
            initialData={recipe}
            onSubmit={handleSubmit}
            onDelete={async () => setShowDeleteDialog(true)}
            isDeleting={isDeleting}
          />
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('recipe.deleteConfirmTitle', 'Delete Recipe?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                'recipe.deleteConfirmDescription',
                'This action cannot be undone. This will permanently delete your recipe.',
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting ? <Spinner className="mr-2 h-4 w-4" /> : null}
              {t('common.delete', 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
