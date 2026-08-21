import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTask } from "@/context/TaskContext";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import TaskList from "@/components/TaskList";
import RoomList from "@/components/RoomList";
import AuthDialog from "@/components/AuthDialog";
import Onboarding from "@/components/Onboarding";
import ZoneCalendar from "@/components/ZoneCalendar";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Calendar, Clock, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ListsPage = () => {
  const { isAuthenticated } = useAuth();
  const { activeZone } = useTask();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("shine-house-onboarding-complete");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCompleteOnboarding = () => {
    localStorage.setItem("shine-house-onboarding-complete", "true");
    setShowOnboarding(false);
  };

  const handleSelectRoom = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
      <AppHeader title="Minhas Listas" />

      {/* Main padronizado com max-w-3xl para consistência total entre as telas */}
      <main className="mx-auto w-full max-w-3xl flex-1 p-4 sm:p-6 space-y-8 mb-20">

        {/* Alerta de Modo Visitante Modernizado */}
        {!isAuthenticated && (
          <Alert className="border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 text-amber-900 dark:text-amber-200 rounded-xl shadow-sm backdrop-blur-sm">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
            <AlertDescription className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 w-full pl-1">
              <span className="text-xs sm:text-sm font-medium opacity-95">
                Sem uma conta ativa, seus dados de ambientes serão salvos apenas localmente neste dispositivo.
              </span>
              <AuthDialog
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 self-end sm:self-auto h-8 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500/30 border-none transition-all shadow-sm active:scale-95"
                  >
                    Criar Conta
                  </Button>
                }
              />
            </AlertDescription>
          </Alert>
        )}

        {/* Card de Zona Ativa da Semana Polido */}
        {activeZone && (
          <Alert className="bg-teal-500/10 border-teal-500/20 text-teal-900 dark:text-teal-200 rounded-xl shadow-sm backdrop-blur-sm">
            <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400 mt-0.5" />
            <AlertDescription className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 w-full pl-1">
              <div>
                <span className="font-semibold text-sm tracking-tight">Zona da semana:</span>{" "}
                <span className="text-sm opacity-90">{activeZone.room_name}</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-teal-500" />
                  Próxima rotação em: {format(new Date(activeZone.period_end_date), "dd 'de' MMMM", { locale: ptBR })}
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs de Controle - Estilizadas como pílulas premium de aplicação SaaS */}
        <Tabs defaultValue="rooms" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-950 rounded-xl p-1 mb-6 h-10 border border-slate-200/20 dark:border-slate-800/40">
            <TabsTrigger
              value="rooms"
              className="rounded-lg text-xs font-semibold tracking-tight data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-50 data-[state=active]:shadow-sm transition-all duration-200"
            >
              Cômodos
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="rounded-lg text-xs font-semibold tracking-tight data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-50 data-[state=active]:shadow-sm transition-all duration-200"
            >
              Tarefas Diárias
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="rounded-lg text-xs font-semibold tracking-tight data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-50 data-[state=active]:shadow-sm transition-all duration-200"
            >
              Calendário
            </TabsTrigger>
          </TabsList>

          {/* Conteúdo: Abas envelopadas em caixas limpas com profundidade */}
          <TabsContent value="rooms" className="pt-1 focus-visible:outline-none focus-visible:ring-0">
            <div className="bg-white dark:bg-slate-900/60 p-4 sm:p-5 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm animate-in fade-in-50 duration-200">
              <RoomList onSelectRoom={handleSelectRoom} />
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="pt-1 focus-visible:outline-none focus-visible:ring-0">
            <div className="bg-white dark:bg-slate-900/60 p-4 sm:p-5 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm animate-in fade-in-50 duration-200">
              <TaskList
                type="daily"
                icon={Clock}
                title="Tarefas Diárias"
              />
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="pt-1 focus-visible:outline-none focus-visible:ring-0">
            <div className="bg-white dark:bg-slate-900/60 p-4 sm:p-5 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm animate-in fade-in-50 duration-200">
              <ZoneCalendar weeks={8} />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <AppFooter />

      {showOnboarding && (
        <Onboarding onComplete={handleCompleteOnboarding} />
      )}
    </div>
  );
};

export default ListsPage;
