
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "./button";
import { UserButton } from "../auth/UserButton";
import { useAuth } from "../../hooks/useAuth";

interface NavbarProps {
  toggleSidebar?: () => void;
  actions?: ReactNode;
}

export default function Navbar({ toggleSidebar, actions }: NavbarProps) {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 md:px-6">
      <div className="flex items-center lg:hidden mr-2">
        {toggleSidebar && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold bg-gradient-to-r from-talent to-talent-dark bg-clip-text text-transparent">
            Talents Space
          </span>
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {actions}
        
        {isAuthenticated ? (
          <UserButton />
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
