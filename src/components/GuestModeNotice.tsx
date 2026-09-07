import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { UserPlus, Info } from "lucide-react";
import {useNavigate} from "react-router-dom";

const GuestModeNotice: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return null;
  }

  return (
    <Alert className="mb-4 border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 text-amber-900 dark:text-amber-200 rounded-xl shadow-sm backdrop-blur-sm transition-all duration-300">
      <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
      <AlertDescription className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 w-full pl-1">
        <span className="text-xs sm:text-sm font-medium leading-relaxed opacity-90">
          Você está no modo visitante. Cadastre-se para salvar e sincronizar suas tarefas entre dispositivos.
        </span>
            <Button
            onClick={() => navigate("/auth")}
              size="sm"
              className="shrink-0 self-end sm:self-auto h-8 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500/30 border-none transition-all shadow-sm active:scale-95"
            >
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              Criar Conta / Login
            </Button>
      </AlertDescription>
    </Alert>
  );
};

export default GuestModeNotice;
