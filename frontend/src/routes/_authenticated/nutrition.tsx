import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/nutrition')({
  component: NutritionPage,
});

function NutritionPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Nutrition</h1>
      <p>Nutrition tracking features coming soon.</p>
    </div>
  );
}
