import { Link, useLocation } from "react-router-dom";
import { Calendar, Home, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-t border-slate-200/60 dark:border-slate-800/80 pb-safe-bottom transition-colors duration-300">
      <div className="max-w-3xl mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex-1 flex flex-col items-center justify-center h-full group"
            >
              <div className="flex flex-col items-center justify-center w-full gap-0.5 transition-transform duration-150 active:scale-95">
                <div
                  className={cn(
                    "flex items-center justify-center h-8 w-12 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                      : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 group-hover:bg-slate-100/50 dark:group-hover:bg-slate-900/50"
                  )}
                >
                  <item.icon className="h-5 w-5 stroke-[2.2]" />
                </div>

                <span className={cn(
                  "text-[10px] tracking-tight transition-colors duration-200",
                  isActive
                    ? "text-teal-600 dark:text-teal-400 font-bold"
                    : "text-slate-400 dark:text-slate-500 font-medium group-hover:text-slate-600 dark:group-hover:text-slate-400"
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
