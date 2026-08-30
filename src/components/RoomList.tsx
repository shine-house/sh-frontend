import React, { useState } from "react";
import { useTask } from "@/context/TaskContext";
import RoomItem from "./RoomItem";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomListProps {
  onSelectRoom: (roomId: string) => void;
}

const RoomList: React.FC<RoomListProps> = ({ onSelectRoom }) => {
  // Resgatamos o estado de carregamento global do contexto de tarefas
  const { rooms, addRoom, isLoading } = useTask();
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddRoom = async () => {
    if (!newRoomName.trim()) return;

    setIsSubmitting(true);
    try {
      await addRoom(newRoomName);
      setNewRoomName("");
      setIsAddingRoom(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNewRoomName("");
    setIsAddingRoom(false);
  };

  return (
    <div className="space-y-5">
      {/* Cabeçalho da Listagem de Cômodos */}
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-200">
          Cômodos
        </h2>
        <Button
          size="sm"
          onClick={() => setIsAddingRoom(true)}
          disabled={isLoading}
          className="shine-gradient rounded-xl px-3 h-8 text-xs font-medium font-sans shadow-sm transition-transform active:scale-95 disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar
        </Button>
      </div>

      {/* Controle de Estados de Exibição (Loading -> Vazio -> Grid Ativo) */}
      {isLoading && rooms.length === 0 ? (
        // Estado Inicial de Carregamento (Skeleton / Loading Grid)
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-300">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-28 border border-slate-200/40 dark:border-slate-800/60 bg-white dark:bg-slate-900 rounded-2xl p-4 flex flex-col justify-between"
            >
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-md w-1/3 animate-pulse" />
              <div className="flex gap-2">
                <div className="h-6 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100/50 dark:border-slate-800/40 w-24 animate-pulse" />
                <div className="h-6 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100/50 dark:border-slate-800/40 w-24 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : rooms.length === 0 ? (
        // Estado de Lista Vazia Concluída
        <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm min-h-40 gap-3 animate-in fade-in duration-300">
          <div className="p-3 bg-slate-100/80 dark:bg-slate-800/50 rounded-xl text-slate-400">
            <Home className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-tight">Nenhum cômodo encontrado</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[240px]">Clique em adicionar no cabeçalho para criar seu primeiro ambiente.</p>
          </div>
        </div>
      ) : (
        // Lista Ativa de Cômodos com esmaecimento sutil caso haja sincronização paralela
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4 relative transition-opacity duration-300", isLoading && "opacity-75 pointer-events-none")}>
          {rooms.map((room) => (
            <RoomItem
              key={room.id}
              room={room}
              onSelect={onSelectRoom}
            />
          ))}
          {isLoading && (
            <div className="absolute top-3 right-3 bg-white/80 dark:bg-slate-900/80 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm backdrop-blur-sm">
              <Loader2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Modal / Dialog para Criar Novo Cômodo */}
      <Dialog open={isAddingRoom} onOpenChange={(open) => !open && !isSubmitting && handleCancel()}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Adicionar Cômodo
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <label
                htmlFor="room-name"
                className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400"
              >
                Nome do ambiente
              </label>
              <Input
                id="room-name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Ex: Cozinha, Sala, Quarto..."
                disabled={isSubmitting}
                className="rounded-xl border-slate-200/80 focus-visible:ring-teal-500 focus-visible:border-teal-500 dark:border-slate-800"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && !isSubmitting && handleAddRoom()}
              />
            </div>
          </div>

          {/* Rodapé do Modal */}
          <DialogFooter className="gap-2 sm:gap-0 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="rounded-xl border-slate-200 dark:border-slate-800 h-9 text-xs font-semibold px-4"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleAddRoom}
              disabled={!newRoomName.trim() || isSubmitting}
              className="rounded-xl h-9 text-xs font-semibold px-5 bg-teal-600 hover:bg-teal-500 text-white dark:bg-teal-600 dark:hover:bg-teal-700 disabled:opacity-40 disabled:pointer-events-none transition-all gap-1.5"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isSubmitting ? "Adicionando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomList;
