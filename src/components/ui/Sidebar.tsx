
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Search, User, Users, ArrowLeftRight } from "lucide-react";
import { Button } from "./button";
import { useAuth } from "../../hooks/useAuth";

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const { user, isAuthenticated, userType } = useAuth();
  const location = useLocation();

  const mainNavItems = [
    { name: "Discover", path: "/", icon: Home },
    { name: "Search", path: "/search", icon: Search },
    { name: "Talents", path: "/talents", icon: Users },
  ];

  const accountNavItems = isAuthenticated
    ? [
        { name: "My Profile", path: "/profile", icon: User },
      ]
    : [];

  const userTypeNavItems = () => {
    if (!isAuthenticated) return [];

    switch (userType) {
      case "talent":
        return [
          { name: "My Showcase", path: "/talent/showcase", icon: ArrowLeftRight },
        ];
      case "mentor":
        return [
          { name: "My Mentees", path: "/mentor/mentees", icon: Users },
        ];
      case "investor":
        return [
          { name: "My Investments", path: "/investor/investments", icon: ArrowLeftRight },
        ];
      case "admin":
        return [
          { name: "Dashboard", path: "/admin/dashboard", icon: ArrowLeftRight },
        ];
      default:
        return [];
    }
  };

  const isLinkActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col border-r bg-background transition-transform lg:static lg:w-60",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16"
      )}
    >
      <div className="flex h-16 items-center border-b px-4 lg:justify-center">
        {open && (
          <Link to="/" className="flex items-center">
            <span className="text-lg font-semibold bg-gradient-to-r from-talent to-talent-dark bg-clip-text text-transparent">
              TS
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto lg:hidden"
          onClick={onToggle}
        >
          <ArrowLeftRight className="h-4 w-4" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      
      <nav className="flex-1 overflow-auto py-4">
        <div className="px-3 mb-6">
          <h3 className={cn("mb-2 text-xs font-medium text-muted-foreground", !open && "lg:hidden")}>
            Discovery
          </h3>
          <div className="grid gap-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  isLinkActive(item.path) ? "bg-accent text-accent-foreground" : "text-foreground",
                  !open && "lg:justify-center"
                )}
              >
                <item.icon className={cn("h-4 w-4", !open && "lg:h-5 lg:w-5")} />
                {open && <span>{item.name}</span>}
              </Link>
            ))}
          </div>
        </div>

        {userTypeNavItems().length > 0 && (
          <div className="px-3 mb-6">
            <h3 className={cn("mb-2 text-xs font-medium text-muted-foreground", !open && "lg:hidden")}>
              {userType?.charAt(0).toUpperCase() + userType?.slice(1) || "User"} Actions
            </h3>
            <div className="grid gap-1">
              {userTypeNavItems().map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    isLinkActive(item.path) ? "bg-accent text-accent-foreground" : "text-foreground",
                    !open && "lg:justify-center"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", !open && "lg:h-5 lg:w-5")} />
                  {open && <span>{item.name}</span>}
                </Link>
              ))}
            </div>
          </div>
        )}

        {accountNavItems.length > 0 && (
          <div className="px-3">
            <h3 className={cn("mb-2 text-xs font-medium text-muted-foreground", !open && "lg:hidden")}>
              Account
            </h3>
            <div className="grid gap-1">
              {accountNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    isLinkActive(item.path) ? "bg-accent text-accent-foreground" : "text-foreground",
                    !open && "lg:justify-center"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", !open && "lg:h-5 lg:w-5")} />
                  {open && <span>{item.name}</span>}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}
