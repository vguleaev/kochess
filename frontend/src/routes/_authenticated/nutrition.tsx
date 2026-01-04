import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/nutrition')({
  component: NutritionPage,
});

function NutritionPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-4">Nutrition</h1>
      <p>Nutrition tracking features coming soon.</p>
    </div>
  );
}
