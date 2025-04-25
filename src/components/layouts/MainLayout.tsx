
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../ui/Navbar";
import Sidebar from "../ui/sidebar";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-col flex-1">
        <Navbar 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          actions={
            <>
              <Button variant="ghost" size="icon" className="relative mr-1">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-destructive"></span>
              </Button>
            </>
          }
        />
        
        <main className="flex-1 p-4 md:p-6 pb-16">
          <div className="mx-auto w-full max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
