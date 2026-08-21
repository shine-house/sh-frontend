import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useHousehold } from "@/hooks/useHousehold";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import SharingDialog from "@/components/SharingDialog";
import AuthDialog from "@/components/AuthDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { UserCircle, LogOut, Share2, Bell, RefreshCcw, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { isShared } = useHousehold();

  const [isSharingDialogOpen, setIsSharingDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isOnboardingResetDialogOpen, setIsOnboardingResetDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info("Você saiu da sua conta");
    setIsLogoutDialogOpen(false);
    navigate("/");
  };

  const handleResetOnboarding = () => {
    localStorage.removeItem("shine-house-onboarding-complete");
    toast.success("Onboarding será reiniciado na próxima abertura do app");
    setIsOnboardingResetDialogOpen(false);
    navigate("/lists");
  };

  const handleEnableNotifications = () => {
    toast.success("Notificações ativadas!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
      <AppHeader title="Configurações" />

      <main className="mx-auto w-full max-w-3xl flex-1 p-4 sm:p-6 space-y-8 mb-20">

        {/* Bloco de Conta */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase pl-1">
            Conta
          </h2>

          <Card className="border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 rounded-2xl p-1 shadow-sm transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">Perfil</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              {isAuthenticated ? (
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50/50 dark:bg-slate-950/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-3.5">
                    <div className="p-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
                      <UserCircle className="h-7 w-7 text-shine-teal" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm tracking-tight text-slate-800 dark:text-slate-200 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{user?.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl h-9 text-xs font-semibold text-rose-600 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 self-end sm:self-auto px-4"
                    onClick={() => setIsLogoutDialogOpen(true)}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Você não está conectado a uma conta</p>
                  <AuthDialog
                    trigger={
                      <Button className="shine-gradient rounded-xl h-9 text-xs font-semibold px-5">
                        Entrar
                      </Button>
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Bloco de Preferências */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase pl-1">
            Preferências
          </h2>

          <div className="space-y-4">
            {/* Card de Compartilhamento */}
            <Card className="border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">Compartilhamento</CardTitle>
                <CardDescription className="text-xs text-slate-400 dark:text-slate-500">
                  Compartilhe suas tarefas com outras pessoas da residência
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-2">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pt-2 border-t border-slate-50 dark:border-slate-800/40">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-xl transition-colors",
                      isShared ? "bg-teal-500/10 text-teal-600 dark:text-teal-400" : "bg-slate-50 dark:bg-slate-950 text-slate-400"
                    )}>
                      <Share2 className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {isShared ? "Compartilhamento ativado" : "Compartilhamento desativado"}
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsSharingDialogOpen(true)}
                    className="shine-gradient rounded-xl h-9 text-xs font-semibold px-4 self-end sm:self-auto disabled:opacity-40"
                    disabled={!isAuthenticated}
                  >
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card de Notificações */}
            <Card className="border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">Notificações</CardTitle>
                <CardDescription className="text-xs text-slate-400 dark:text-slate-500">
                  Receba lembretes para suas tarefas
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-2">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pt-2 border-t border-slate-50 dark:border-slate-800/40">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-400">
                      <Bell className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Lembretes de tarefas</p>
                  </div>
                  <Button
                    onClick={handleEnableNotifications}
                    className="shine-gradient rounded-xl h-9 text-xs font-semibold px-4 self-end sm:self-auto"
                  >
                    Ativar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Bloco de Experiência */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase pl-1">
            Experiência
          </h2>

          <Card className="border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
            {/* ... continuação exata a partir do conteúdo do Card de Experiência ... */}
            <CardContent className="px-4 pb-4 pt-2">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pt-2 border-t border-slate-50 dark:border-slate-800/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-400">
                    <RefreshCcw className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Reiniciar tutorial de boas-vindas</p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-xl border-slate-200 dark:border-slate-800 h-9 text-xs font-semibold px-4 self-end sm:self-auto"
                  onClick={() => setIsOnboardingResetDialogOpen(true)}
                >
                  Reiniciar
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <AppFooter />

      {/* Componente de Diálogo de Convites Domésticos */}
      <SharingDialog open={isSharingDialogOpen} onOpenChange={setIsSharingDialogOpen} />

      {/* Confirmação de Logout (Sair) */}
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className="rounded-2xl max-w-[400px] p-6 border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
              Sair da conta
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-500 dark:text-slate-400">
              Você precisará entrar novamente para acessar suas tarefas e cômodos de forma sincronizada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
            <AlertDialogCancel className="rounded-xl border border-slate-200 dark:border-slate-800 h-9 text-xs font-semibold">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="rounded-xl h-9 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white border-none transition-transform active:scale-[0.98]"
            >
              Sim, sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmação de Reset de Tutorial */}
      <AlertDialog open={isOnboardingResetDialogOpen} onOpenChange={setIsOnboardingResetDialogOpen}>
        <AlertDialogContent className="rounded-2xl max-w-[400px] p-6 border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <RefreshCcw className="h-4 w-4 text-teal-500 shrink-0" />
              Reiniciar Tutorial
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-500 dark:text-slate-400">
              Ao confirmar, o tutorial de boas-vindas será exibido na próxima vez que você abrir o aplicativo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
            <AlertDialogCancel className="rounded-xl border border-slate-200 dark:border-slate-800 h-9 text-xs font-semibold">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetOnboarding}
              className="rounded-xl h-9 text-xs font-semibold shine-gradient border-none transition-transform active:scale-[0.98]"
            >
              Sim, reiniciar tutorial
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingsPage;
