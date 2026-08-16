import { useParams, useNavigate } from "react-router-dom";
import { useTask } from "@/context/TaskContext";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import TaskList from "@/components/TaskList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const RoomDetailPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { rooms, activeZone } = useTask();

  const room = rooms.find(r => r.id === roomId);
  const isCurrentZone = activeZone?.room_id === roomId;

  if (!room) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader
          title="Cômodo não encontrado"
          showBackButton
          onBack={() => navigate("/")}
        />

        {/* <main className="flex-1 container p-4 flex flex-col items-center justify-center"> */}
        <main className="mx-auto w-full max-w-4xl flex-1 p-4 space-y-6 mb-16">
          <p className="text-muted-foreground">
            O cômodo que você está procurando não existe.
          </p>
        </main>

        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader
        title={room.name}
        showBackButton
        onBack={() => navigate("/")}
      />

      <main className="mx-auto w-full max-w-4xl flex-1 p-4 space-y-6 mb-16">
        {isCurrentZone && activeZone && (
          <Alert className="bg-shine-teal/20 border-shine-teal">
            <Calendar className="h-4 w-4 text-shine-teal" />
            <AlertDescription>
              <span className="font-medium">Este é o cômodo da semana!</span>
              <p className="text-xs text-muted-foreground mt-1">
                Próxima zona em: {format(new Date(activeZone.period_end_date), "dd 'de' MMMM", { locale: ptBR })}
              </p>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="zone">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="zone">Tarefas de Zona</TabsTrigger>
            <TabsTrigger value="weekly">Tarefas Semanais</TabsTrigger>
          </TabsList>

          <TabsContent value="zone" className="pt-4">
            <TaskList
              type="zone"
              roomId={roomId}
              title={`Tarefas de Zona - ${room.name}`}
            />
          </TabsContent>

          <TabsContent value="weekly" className="pt-4">
            <TaskList
              type="weekly"
              roomId={roomId}
              title={`Tarefas Semanais - ${room.name}`}
            />
          </TabsContent>
        </Tabs>
      </main>

      <AppFooter />
    </div>
  );
};

export default RoomDetailPage;