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
import { Plus } from "lucide-react";

interface RoomListProps {
  onSelectRoom: (roomId: string) => void;
}

const RoomList: React.FC<RoomListProps> = ({ onSelectRoom }) => {
  const { rooms, addRoom } = useTask();
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  const handleAddRoom = () => {
    if (!newRoomName.trim()) return;

    addRoom(newRoomName);
    setNewRoomName("");
    setIsAddingRoom(false);
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
          className="shine-gradient rounded-xl px-3 h-8 text-xs font-medium font-sans shadow-sm transition-transform active:scale-95"
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar
        </Button>
      </div>

      {/* Grid de Cards de Cômodos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rooms.map((room) => (
          <RoomItem
            key={room.id}
            room={room}
            onSelect={onSelectRoom}
          />
        ))}
      </div>

      {/* Modal / Dialog para Criar Novo Cômodo */}
      <Dialog open={isAddingRoom} onOpenChange={(open) => !open && handleCancel()}>
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
                className="rounded-xl border-slate-200/80 focus-visible:ring-teal-500 focus-visible:border-teal-500 dark:border-slate-800"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleAddRoom()}
              />
            </div>
          </div>

          {/* Rodapé do Modal */}
          <DialogFooter className="gap-2 sm:gap-0 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="rounded-xl border-slate-200 dark:border-slate-800 h-9 text-xs font-semibold px-4"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleAddRoom}
              disabled={!newRoomName.trim()}
              className="rounded-xl h-9 text-xs font-semibold px-5 bg-teal-600 hover:bg-teal-500 text-white dark:bg-teal-600 dark:hover:bg-teal-700 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomList;
