import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { UserPlus, Info } from "lucide-react";
import AuthDialog from "./AuthDialog";

const GuestModeNotice: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null;
  }

  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
      <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-amber-800 dark:text-amber-200">
          Você está no modo visitante. Suas alterações não serão sincronizadas.
        </span>
        <AuthDialog 
          trigger={
            <Button size="sm" className="ml-4">
              <UserPlus className="h-4 w-4 mr-2" />
              Fazer Login
            </Button>
          } 
        />
      </AlertDescription>
    </Alert>
  );
};

export default GuestModeNotice;