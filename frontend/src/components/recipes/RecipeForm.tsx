import { useForm } from 'react-hook-form';
import type { CreateRecipeRequest, Recipe } from '@kochess/shared/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Trash2, ChefHat } from 'lucide-react';

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

interface RecipeFormProps extends Omit<React.ComponentProps<'form'>, 'onSubmit'> {
  initialData?: Recipe;
  onSubmit: (data: CreateRecipeRequest) => Promise<void>;
  onDelete?: () => Promise<void>;
  isDeleting?: boolean;
  className?: string;
}

export function RecipeForm({ initialData, onSubmit, onDelete, isDeleting, className, ...props }: RecipeFormProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateRecipeRequest>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      ingredients: initialData?.ingredients || '',
      // TODO: Photo handling is tricky here as file input manages its own state
      // We can't set "default value" for file input to a URL.
      // We might need a separate preview for existing photo.
    },
  });

  const handleFormSubmit = async (data: CreateRecipeRequest) => {
    // TODO: Handle photo upload here if file is selected
    // For now, we pass the data as is, but specific handling for photo might be needed
    // depending on backend expectation (URL vs File)
    await onSubmit(data);
  };

  return (
    <form className={cn('grid items-start gap-4', className)} onSubmit={handleSubmit(handleFormSubmit)} {...props}>
      <div className="grid gap-2">
        <Label htmlFor="title">{t('recipe.title') || 'Title'}</Label>
        <Input
          id="title"
          placeholder={t('recipe.titlePlaceholder') || 'e.g. Chicken Caesar Salad'}
          {...register('title', { required: true })}
        />
        {errors.title && <span className="text-destructive text-sm">Title is required</span>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="photo">{t('recipe.photo') || 'Photo'}</Label>
        {initialData && (
          <div className="mb-2">
            {initialData.photo ? (
              <img src={initialData.photo} alt="Current" className="h-40 w-full object-cover rounded-md" />
            ) : (
              <div className={`h-40 w-full rounded-md flex items-center justify-center ${getGradient(initialData.id)}`}>
                <ChefHat className="w-16 h-16 text-black/50 mix-blend-overlay opacity-20" />
              </div>
            )}
          </div>
        )}
        <Input id="photo" type="file" accept="image/*" {...register('photo')} />
        <p className="text-xs text-muted-foreground">{t('recipe.photoHelp', 'Take a photo or upload an image')}</p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">{t('recipe.description') || 'Description'}</Label>
        <Textarea
          id="description"
          placeholder={t('recipe.descriptionPlaceholder') || 'Describe how to make it...'}
          {...register('description')}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ingredients">{t('recipe.ingredients') || 'Ingredients'}</Label>
        <Textarea
          id="ingredients"
          placeholder={t('recipe.ingredientsPlaceholder') || 'List ingredients here...'}
          {...register('ingredients')}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
        </Button>
        {onDelete && (
          <Button type="button" variant="destructive" disabled={isDeleting || isSubmitting} onClick={onDelete}>
            {isDeleting ? <span className="animate-spin mr-2">...</span> : <Trash2 className="w-4 h-4" />}
            {t('common.delete', 'Delete')}
          </Button>
        )}
      </div>
    </form>
  );
}
