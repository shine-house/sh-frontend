
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Cômodos</h2>
        <Button
          size="sm"
          onClick={() => setIsAddingRoom(true)}
          className="shine-gradient"
        >
          <Plus className="h-4 w-4 mr-1" /> Adicionar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((room) => (
          <RoomItem
            key={room.id}
            room={room}
            onSelect={onSelectRoom}
          />
        ))}
      </div>

      <Dialog open={isAddingRoom} onOpenChange={setIsAddingRoom}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Cômodo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="room-name" className="text-sm font-medium">Nome</label>
              <Input
                id="room-name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Ex: Cozinha, Sala, Quarto..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingRoom(false)}>Cancelar</Button>
            <Button onClick={handleAddRoom} className="shine-gradient">Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomList;
