import { Link } from '@tanstack/react-router';
import { UserMenu } from '@/components/UserMenu';

export const Navbar = () => {
  return (
    <div className="hidden md:flex p-4 items-center justify-between border-b border-border bg-background">
      <div className="flex gap-6">
        <Link
          to="/"
          className="text-foreground hover:text-primary transition-colors [&.active]:text-primary [&.active]:font-bold">
          Home
        </Link>
        <Link
          to="/nutrition"
          className="text-foreground hover:text-primary transition-colors [&.active]:text-primary [&.active]:font-bold">
          Nutrition
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <UserMenu />
      </div>
    </div>
  );
};
