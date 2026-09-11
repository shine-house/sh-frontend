import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import SharingDialog from "./SharingDialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut, Share2, Bell, Menu, UserPlus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useHousehold } from "@/hooks/useHousehold";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

interface AppHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBackButton = false,
  onBack
}) => {
  const {
    user,
    isAuthenticated,
    logout
  } = useAuth();

  const navigate = useNavigate();
  const [isSharingDialogOpen, setIsSharingDialogOpen] = useState(false);
  const { isShared } = useHousehold();

  const handleLogout = async () => {
    try {
      await logout();
      toast.info("Você saiu da sua conta");
    } catch {
      toast.error("Erro ao sair da conta. Tente novamente.");
    }
  };

  const handleEnableNotifications = () => {
    toast.success("Notificações ativadas!");
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/80 py-3 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto flex items-center justify-between">

        {/* Lado Esquerdo: Título e Voltar */}
        <div className="flex items-center gap-2.5">
          {showBackButton && onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-9 w-9 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {title}
          </h1>
        </div>

        {/* Lado Direito: Ações Globais */}
        <div className="flex items-center gap-2">

          {/* Componente de Alternância de Tema */}
          <ThemeToggle />

          {/* Botão de Notificações */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEnableNotifications}
            className="h-9 w-9 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <Bell className="h-4 w-4" />
          </Button>

          {/* Botão de Compartilhamento com Tooltip */}
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSharingDialogOpen(true)}
                  className={cn(
                    "h-9 w-9 rounded-xl text-slate-500 transition-all duration-200",
                    isShared
                      ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20"
                      : "hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                  )}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-lg bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900 text-xs px-2.5 py-1.5 border-none shadow-md">
                <p className="font-medium">Compartilhamento entre dispositivos</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Menu de Perfil / Conta */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl min-w-[160px] p-1 border-slate-200 dark:border-slate-800 shadow-lg">
              {isAuthenticated ? (
                <>
                  <DropdownMenuLabel className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 px-2.5 py-2">
                    <User className="h-3.5 w-3.5" />
                    <span className="truncate">{user?.name || "Usuário"}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-lg text-xs gap-2 py-2 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sair da conta
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2.5 py-2">
                    Minha Conta
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                  <DropdownMenuItem
                    onClick={() => navigate("/auth")}
                    className="rounded-lg text-xs gap-2 py-2 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <UserPlus className="h-3.5 w-3.5 text-slate-400" />
                    Entrar / Cadastrar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <SharingDialog open={isSharingDialogOpen} onOpenChange={setIsSharingDialogOpen} />
    </header>
  );
};

export default AppHeader;
