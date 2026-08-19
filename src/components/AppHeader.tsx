
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthDialog from "./AuthDialog";
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

  const [isSharingDialogOpen, setIsSharingDialogOpen] = useState(false);
  const { isShared } = useHousehold();

  const handleLogout = () => {
    logout();
    toast.info("Você saiu da sua conta");
  };

  const handleEnableNotifications = () => {
    // In a real app, this would request notification permissions
    toast.success("Notificações ativadas!");
  };

  return <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b py-3 px-4">
      <div className=" max-w-4xl mx-auto flex items-center justify-between px-[12px]">

        <div className="flex items-center gap-3">
          {showBackButton && onBack && <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>}
          <h1 className="text-xl font-medium">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleEnableNotifications}>
            <Bell className="h-5 w-5" />
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSharingDialogOpen(true)}
                  className={isShared ? "text-shine-teal" : ""}
                  >
                  <Share2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Compartilhamento entre dispositivos</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuthenticated ? <>
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{user?.name || "Usuário"}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </> : <>
                  <DropdownMenuLabel>Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <AuthDialog trigger={<DropdownMenuItem onSelect={e => e.preventDefault()}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Entrar / Cadastrar
                      </DropdownMenuItem>} />
                </>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <SharingDialog open={isSharingDialogOpen} onOpenChange={setIsSharingDialogOpen} />
    </header>;
};

export default AppHeader;
