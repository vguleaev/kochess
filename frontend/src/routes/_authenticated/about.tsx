import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/about')({
  component: About,
});

function About() {
  const { user } = Route.useRouteContext();

  return (
    <div className="p-2">
      <p>Hello from About!</p>
      {user && <p>Logged in as: {user.email}</p>}
    </div>
  );
}
