
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, Home, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const AppFooter = () => {
  const location = useLocation();
  
  const navItems = [
    {
      icon: Calendar,
      label: "Hoje",
      path: "/"
    },
    {
      icon: Home,
      label: "Minhas Listas",
      path: "/lists"
    },
    {
      icon: Settings,
      label: "Configurações",
      path: "/settings"
    }
  ];
  
  return (
    <footer className="sticky bottom-0 z-10 bg-background/80 backdrop-blur-md border-t">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex-1"
            >
              <div className="flex flex-col items-center py-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-10 w-10 rounded-full",
                    isActive && "bg-primary/10 text-primary"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </Button>
                <span className={cn(
                  "text-xs",
                  isActive ? "text-primary font-medium" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </footer>
  );
};

export default AppFooter;
