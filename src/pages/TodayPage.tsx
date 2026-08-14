import React, { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import TaskList from "@/components/TaskList";
import GuestModeNotice from "@/components/GuestModeNotice";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Timer, Pause, Play, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTask } from "@/context/TaskContext";

const TodayPage = () => {
  const [timerActive, setTimerActive] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes in seconds
  const { toast } = useToast();
  const { activeZone, isLoading } = useTask();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerActive && !timerPaused) {
      interval = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setTimerActive(false);
            toast({
              title: "Tempo finalizado!",
              description: "Seus 15 minutos acabaram. Bom trabalho!",
              duration: 5000
            });
            return 15 * 60;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerPaused, toast]);

  const startTimer = () => {
    setTimerActive(true);
    setTimerPaused(false);
    toast({
      title: "Timer iniciado!",
      description: "15 minutos para completar suas tarefas",
      duration: 3000
    });
  };

  const pauseTimer = () => {
    setTimerPaused(!timerPaused);
    toast({
      title: timerPaused ? "Timer retomado" : "Timer pausado",
      duration: 2000
    });
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerPaused(false);
    setTimeRemaining(15 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader title="Hoje" />

      <main className="flex-1 container max-w-4xl p-4 space-y-6 mb-16">
        <GuestModeNotice />

        {activeZone && (
          <Alert className="bg-shine-teal/20 border-shine-teal">
            <Calendar className="h-4 w-4 text-shine-teal" />
            <AlertDescription className="flex justify-between items-center">
              <div>
                <span className="font-medium">Zona da semana: {activeZone.room_name}</span>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-4 py-0 px-0">
          {!timerActive ? (
            <Button onClick={startTimer} className="shine-gradient flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Iniciar Timer de 15min
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="text-xl font-bold mr-2">
                {formatTime(timeRemaining)}
              </div>
              <Button onClick={pauseTimer} variant="outline" size="sm" className="flex items-center gap-1">
                {timerPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {timerPaused ? "Continuar" : "Pausar"}
              </Button>
              <Button onClick={resetTimer} variant="outline" size="sm">
                Cancelar
              </Button>
            </div>
          )}
        </div>

        {/* Daily and weekly tasks are recurrence-driven, independent of the
            active zone — they must always render, regardless of room/cycle. */}
        <section>
          <TaskList type="daily" title="Tarefas Diárias" readOnly={true} />
        </section>

        <section className="pt-4">
          <TaskList type="weekly" title="Tarefas Semanais" readOnly={true} />
        </section>

        {!isLoading && activeZone && (
          <section className="pt-4">
            <TaskList
              type="zone"
              roomId={activeZone.room_id}
              title={`Tarefas da Zona: ${activeZone.room_name}`}
              readOnly={true}
            />
          </section>
        )}
      </main>

      <AppFooter />
    </div>
  );
};

export default TodayPage;