
import { ReactNode } from "react";
import { 
  Sidebar as ShadcnSidebar, 
  SidebarContent, 
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "./sidebar";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Search, User, Users, ArrowLeftRight } from "lucide-react";
import { Button } from "./button";
import { useAuth } from "../../hooks/useAuth";

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export function Sidebar({ open, onToggle }: SidebarProps) {
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
    <SidebarProvider defaultOpen={open}>
      <ShadcnSidebar>
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
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className={cn(!open && "lg:hidden")}>
              Discovery
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isLinkActive(item.path)}
                      tooltip={!open ? item.name : undefined}
                    >
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3",
                          !open && "lg:justify-center"
                        )}
                      >
                        <item.icon className={cn("h-4 w-4", !open && "lg:h-5 lg:w-5")} />
                        {open && <span>{item.name}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {userTypeNavItems().length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className={cn(!open && "lg:hidden")}>
                {userType?.charAt(0).toUpperCase() + userType?.slice(1) || "User"} Actions
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {userTypeNavItems().map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isLinkActive(item.path)}
                        tooltip={!open ? item.name : undefined}
                      >
                        <Link
                          to={item.path}
                          className={cn(
                            "flex items-center gap-3",
                            !open && "lg:justify-center"
                          )}
                        >
                          <item.icon className={cn("h-4 w-4", !open && "lg:h-5 lg:w-5")} />
                          {open && <span>{item.name}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {accountNavItems.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className={cn(!open && "lg:hidden")}>
                Account
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {accountNavItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isLinkActive(item.path)}
                        tooltip={!open ? item.name : undefined}
                      >
                        <Link
                          to={item.path}
                          className={cn(
                            "flex items-center gap-3",
                            !open && "lg:justify-center"
                          )}
                        >
                          <item.icon className={cn("h-4 w-4", !open && "lg:h-5 lg:w-5")} />
                          {open && <span>{item.name}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
      </ShadcnSidebar>
    </SidebarProvider>
  );
}
