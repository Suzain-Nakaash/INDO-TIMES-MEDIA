"use client";

import { useTheme } from "next-themes";
import { Menu, Moon, Sun, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AdminTopbar() {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-card px-4 shadow-sm sm:px-6 lg:px-8">
      <div className="flex items-center md:hidden">
        <Button variant="ghost" size="icon" className="-ml-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open sidebar</span>
        </Button>
      </div>
      
      <div className="flex flex-1 items-center justify-end gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle Theme</span>
        </Button>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-secondary"></span>
          <span className="sr-only">Notifications</span>
        </Button>
        
        <div className="flex items-center gap-3 border-l pl-4">
          <div className="hidden text-right md:block">
            <p className="text-sm font-medium leading-none">{user?.name || "Admin User"}</p>
            <p className="text-xs text-muted-foreground mt-1">{user?.role || "Administrator"}</p>
          </div>
          <Avatar className="h-9 w-9">
            <AvatarImage src="" alt={user?.name || "Admin"} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
