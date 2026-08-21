import { useParams, useNavigate } from "react-router-dom";
import { useTask } from "@/context/TaskContext";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import TaskList from "@/components/TaskList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar, Sparkles, Inbox, ArrowLeft, House, Calendar1 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const RoomDetailPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { rooms, activeZone } = useTask();

  const room = rooms.find(r => r.id === roomId);
  const isCurrentZone = activeZone?.room_id === roomId;

  // Tela de Tratamento Visual para Cômodo Não Encontrado
  if (!room) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
        <AppHeader
          title="Erro de Acesso"
          showBackButton
          onBack={() => navigate("/lists")}
        />

        <main className="mx-auto w-full max-w-3xl flex-1 p-4 sm:p-6 flex flex-col items-center justify-center text-center space-y-4 mb-20">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-full shadow-sm text-slate-400 dark:text-slate-600">
            <Inbox className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">Ambiente não localizado</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed">
              O cômodo que você está tentando acessar não existe ou foi removido recentemente da sua base de dados.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs font-semibold h-9 px-4 border-slate-200 dark:border-slate-800"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Voltar para o Início
          </Button>
        </main>

        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
      <AppHeader
        title={room.name}
        showBackButton
        onBack={() => navigate("/lists")}
      />

      <main className="mx-auto w-full max-w-3xl flex-1 p-4 sm:p-6 space-y-6 mb-20">

        {/* Alerta de Destaque - Quando corresponde à Zona Ativa */}
        {isCurrentZone && activeZone && (
          <Alert className="bg-teal-500/10 border-teal-500/20 text-teal-900 dark:text-teal-200 rounded-xl shadow-sm backdrop-blur-sm transition-all duration-300 animate-in fade-in-50">
            <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400 mt-0.5" />
            <AlertDescription className="pl-1">
              <span className="font-bold text-sm tracking-tight block">⭐ Este é o cômodo em foco nesta semana!</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-teal-500" />
                A zona mudará em: {format(new Date(activeZone.period_end_date), "dd 'de' MMMM", { locale: ptBR })}
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Sistema de Abas Internas Estilizadas em Pílulas */}
        <Tabs defaultValue="zone" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-950 rounded-xl p-1 h-10 border border-slate-200/20 dark:border-slate-800/40">
            <TabsTrigger
              value="zone"
              className="rounded-lg text-xs font-semibold tracking-tight data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-50 data-[state=active]:shadow-sm transition-all duration-200"
            >
              Tarefas de Zona
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="rounded-lg text-xs font-semibold tracking-tight data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-50 data-[state=active]:shadow-sm transition-all duration-200"
            >
              Tarefas Semanais
            </TabsTrigger>
          </TabsList>

          {/* Abas Envelopadas em Bloco com Efeito de Card Flutuante */}
          <TabsContent value="zone" className="pt-2 focus-visible:outline-none focus-visible:ring-0">
            <div className="bg-white dark:bg-slate-900/60 p-4 sm:p-5 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm animate-in fade-in-40 duration-200">
              <TaskList
                type="zone"
                roomId={roomId}
                icon={House}
                title={`Lista de Zona • ${room.name}`}
              />
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="pt-2 focus-visible:outline-none focus-visible:ring-0">
            <div className="bg-white dark:bg-slate-900/60 p-4 sm:p-5 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm animate-in fade-in-40 duration-200">
              <TaskList
                type="weekly"
                roomId={roomId}
                icon={Calendar1}
                title={`Rotina Semanal • ${room.name}`}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <AppFooter />
    </div>
  );
};

export default RoomDetailPage;
