import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import TaskList from "@/components/TaskList";
import GuestModeNotice from "@/components/GuestModeNotice";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Timer, Pause, Play, Calendar, RotateCcw, House, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTask } from "@/context/TaskContext";

const TodayPage = () => {
  const [timerActive, setTimerActive] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60);
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
      title: timerPaused ? "Timer retornado" : "Timer pausado",
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
    <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <AppHeader title="Hoje" />

      {/* BARRA DE PROGRESSO GLOBAL: Corre no topo discretamente sempre que houver qualquer mutação de carregamento */}
      <div className="sticky top-[57px] left-0 right-0 h-[2.5px] w-full bg-transparent z-40 overflow-hidden">
        {isLoading && (
          <div className="h-full w-full bg-teal-500 animate-in fade-in duration-200">
            <div className="h-full w-[30%] bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.5s_infinite] bg-teal-400 absolute left-0 top-0 w-full transform origin-left animate-[loading-bar_1s_ease-in-out_infinite]"
              style={{
                animation: 'loading-bar 1.5s infinite linear',
                backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
              }}
            />
          </div>
        )}
      </div>

      <main className="mx-auto w-full max-w-3xl flex-1 p-4 sm:p-6 space-y-8 mb-20">
        <GuestModeNotice />

        {activeZone && (
          <Alert className="bg-teal-500/10 border-teal-500/20 text-teal-900 dark:text-teal-200 rounded-xl shadow-sm backdrop-blur-sm transition-all duration-300">
            <Calendar className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <AlertDescription className="flex justify-between items-center ml-2">
              <div>
                <span className="font-semibold tracking-tight">Zona da semana:</span>{" "}
                <span className="opacity-90">{activeZone.room_name}</span>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Bloco do Timer */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={`p-2.5 rounded-xl transition-colors duration-300 ${timerActive && !timerPaused ? 'bg-teal-500/10 text-teal-600 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                <Timer className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Foco de 15 Minutos</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Execute uma pequena tarefa sem pausas.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              {!timerActive ? (
                <Button
                  onClick={startTimer}
                  className="shine-gradient flex items-center gap-2 shadow-sm shadow-teal-500/20 hover:shadow-md transition-all font-medium rounded-xl h-10 px-4"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Iniciar Timer
                </Button>
              ) : (
                <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200/40 dark:border-slate-800">
                  <div className="text-xl font-bold tracking-tabular-nums px-3 font-mono text-slate-900 dark:text-slate-50">
                    {formatTime(timeRemaining)}
                  </div>

                  <Button
                    onClick={pauseTimer}
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-lg ${timerPaused ? 'text-teal-600 hover:bg-teal-50' : 'text-amber-600 hover:bg-amber-50'}`}
                    title={timerPaused ? "Continuar" : "Pausar"}
                  >
                    {timerPaused ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4 fill-current" />}
                  </Button>

                  <Button
                    onClick={resetTimer}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                    title="Cancelar"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Seções de Listas Estabilizadas (Nenhuma pisca ou some mais!) */}
        <div className="space-y-6">
          <section className="bg-white dark:bg-slate-900/60 p-4 sm:p-5 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm">
            <TaskList
             type="daily"
             icon={Clock}
             title=" Tarefas Diárias"
             readOnly={true} />
          </section>

          <section className="bg-white dark:bg-slate-900/60 p-4 sm:p-5 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm">
            <TaskList
             type="weekly"
             icon={Calendar}
             title="Tarefas Semanais"
             readOnly={true} />
          </section>

          {activeZone && (
            <section className="bg-white dark:bg-slate-900/60 p-4 sm:p-5 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm">
              <TaskList
                type="zone"
                icon={House}
                roomId={activeZone.room_id}
                title={`Tarefas da Zona: ${activeZone.room_name}`}
                readOnly={true}
              />
            </section>
          )}
        </div>
      </main>

      <AppFooter />
    </div>
  );
};

export default TodayPage;
