import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-teal-400" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl border-slate-200 dark:border-slate-800 p-1 min-w-[120px]">
        <DropdownMenuItem onClick={() => setTheme("light")} className="rounded-lg text-xs gap-2 py-2 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800">
          <Sun className="h-3.5 w-3.5 text-amber-500" />
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="rounded-lg text-xs gap-2 py-2 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800">
          <Moon className="h-3.5 w-3.5 text-teal-400" />
          Escuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="rounded-lg text-xs gap-2 py-2 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800">
          <Monitor className="h-3.5 w-3.5 text-slate-400" />
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
