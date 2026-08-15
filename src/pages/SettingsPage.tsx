import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useHousehold } from "@/hooks/useHousehold";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import AuthDialog from "@/components/AuthDialog";
import SharingDialog from "@/components/SharingDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  UserCircle,
  Share2,
  Bell,
  LogOut,
  AlertTriangle,
  RefreshCcw
} from "lucide-react";
import { toast } from "sonner";

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
    navigate("/");
  };

  const handleEnableNotifications = () => {
    // TODO: In a real app, this would request notification permissions
    toast.success("Notificações ativadas!");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title="Configurações" />

      <main className="mx-auto w-full max-w-4xl flex-1 p-4 space-y-6 mb-16">
        <section className="space-y-4">
          <h2 className="text-lg font-medium">Conta</h2>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              {isAuthenticated ? (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <UserCircle className="h-8 w-8 text-shine-teal" />
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setIsLogoutDialogOpen(true)}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">Você não está conectado a uma conta</p>
                  <AuthDialog
                    trigger={
                      <Button className="shine-gradient">
                        Entrar
                      </Button>
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4 pt-2">
          <h2 className="text-lg font-medium">Preferências</h2>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Compartilhamento</CardTitle>
              <CardDescription>
                Compartilhe suas tarefas com outras pessoas da residência
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Share2 className={`h-6 w-6 ${isShared ? "text-shine-teal" : "text-muted-foreground"}`} />
                  <p>{isShared ? "Compartilhamento ativado" : "Compartilhamento desativado"}</p>
                </div>
                <Button
                  onClick={() => setIsSharingDialogOpen(true)}
                  className="shine-gradient"
                  disabled={!isAuthenticated}
                >
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Notificações</CardTitle>
              <CardDescription>
                Receba lembretes para suas tarefas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Bell className="h-6 w-6 text-muted-foreground" />
                  <p>Lembretes de tarefas</p>
                </div>
                <Button
                  onClick={handleEnableNotifications}
                  className="shine-gradient"
                >
                  Ativar
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4 pt-2">
          <h2 className="text-lg font-medium">Experiência</h2>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Redefinir Tutorial</CardTitle>
              <CardDescription>
                Reveja o tutorial de boas-vindas como se fosse a primeira vez
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <RefreshCcw className="h-6 w-6 text-muted-foreground" />
                  <p>Reiniciar tutorial de boas-vindas</p>
                </div>
                <Button
                  variant="outline"
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

      <SharingDialog
        open={isSharingDialogOpen}
        onOpenChange={setIsSharingDialogOpen}
      />

      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Sair da conta
            </DialogTitle>
            <DialogDescription>
              Você precisará entrar novamente para acessar suas tarefas e cômodos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Sim, sair
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isOnboardingResetDialogOpen} onOpenChange={setIsOnboardingResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCcw className="h-5 w-5 text-shine-teal" />
              Reiniciar Tutorial
            </DialogTitle>
            <DialogDescription>
              Ao confirmar, o tutorial de boas-vindas será exibido na próxima vez que você abrir o aplicativo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOnboardingResetDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleResetOnboarding} className="shine-gradient">
              Sim, reiniciar tutorial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;