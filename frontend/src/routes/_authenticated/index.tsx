import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
});

function Index() {
  const { user } = Route.useRouteContext();

  return (
    <div className="p-2">
      <h3 className="text-2xl font-bold pb-4">Welcome Home{user?.firstName ? `, ${user.firstName}` : ''}!</h3>

      <div className="flex min-h-svh flex-col items-center justify-center">
        <Button>Click me</Button>
      </div>
    </div>
  );
}
