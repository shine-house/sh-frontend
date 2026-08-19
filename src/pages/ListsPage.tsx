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
import { AlertCircle, Calendar } from "lucide-react";
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
    <div className="flex flex-col min-h-screen">
      <AppHeader title="Minhas Listas" />

      {/* <main className="flex-1 container max-w-4xl p-4 space-y-6 mb-16"> */}
      <main className="mx-auto w-full max-w-4xl flex-1 p-4 space-y-6 mb-16">
        {!isAuthenticated && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex justify-between items-center">
              <span>Sem uma conta, seus dados serão salvos apenas neste dispositivo.</span>
              <AuthDialog
                trigger={
                  <Button variant="outline" size="sm">
                    Criar Conta
                  </Button>
                }
              />
            </AlertDescription>
          </Alert>
        )}

        {activeZone && (
          <Alert className="bg-shine-teal/20 border-shine-teal">
            <Calendar className="h-4 w-4 text-shine-teal" />
            <AlertDescription className="flex justify-between items-center">
              <div>
                <span className="font-medium">Zona da semana: {activeZone.room_name}</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Próxima zona em: {format(new Date(activeZone.period_end_date), "dd 'de' MMMM", { locale: ptBR })}
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="rooms">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rooms">Cômodos</TabsTrigger>
            <TabsTrigger value="tasks">Tarefas Diárias</TabsTrigger>
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="pt-4">
            <TaskList
              type="daily"
              title="Tarefas Diárias"
            />
{/*
            <div className="mt-6">
              <TaskList
                type="weekly"
                title="Tarefas Semanais"
              />
            </div>

            {activeZone && (
              <div className="mt-6">
                <TaskList
                  type="zone"
                  roomId={activeZone.room_id}
                  title={`Tarefas da Zona: ${activeZone.room_name}`}
                />
              </div>
            )} */}
          </TabsContent>

          <TabsContent value="rooms" className="pt-4">
            <RoomList onSelectRoom={handleSelectRoom} />
          </TabsContent>

          <TabsContent value="calendar" className="pt-4">
            <ZoneCalendar weeks={8} />
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