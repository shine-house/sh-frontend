
import type { RoomCreate, Task } from "./types";

// Custom user type to match AuthContext
type User = {
  id: string;
  email: string;
  name: string;
};

// Adapter function to get user name from custom User type
const getUserNameFromCustomUser = (user: User | null): string => {
  if (!user) return 'Usuário';
  
  // Since our custom user type already has name, use it directly
  if (user.name && user.name.trim()) {
    return user.name;
  }
  
  if (user.email) {
    // Extract name from email (before @) as fallback
    return user.email.split('@')[0];
  }
  
  return 'Usuário';
};

export const addRoom = (
  rooms: RoomCreate[], 
  name: string
): Room[] => {
  const newRoom = {
    id: `room-${Date.now()}`,
    name
  };
  return [...rooms, newRoom];
};

export const removeRoom = (
  rooms: Room[], 
  tasks: Task[], 
  id: string
): { rooms: Room[], tasks: Task[] } => {
  const updatedRooms = rooms.filter(room => room.id !== id);
  const updatedTasks = tasks.filter(task => task.roomId !== id);
  
  return {
    rooms: updatedRooms,
    tasks: updatedTasks
  };
};

export const addTask = (
  tasks: Task[], 
  taskData: Omit<Task, "id" | "order" | "done">
): Task[] => {
  const taskType = tasks.filter(t => t.type === taskData.type);
  const newTask: Task = {
    ...taskData,
    id: `task-${Date.now()}`,
    order: taskType.length,
    done: false
  };
  
  return [...tasks, newTask];
};

export const toggleTaskStatus = (
  tasks: Task[], 
  id: string, 
  user: User | null
): Task[] => {
  return tasks.map(task => {
    if (task.id === id) {
      const done = !task.done;
      return {
        ...task,
        done,
        doneBy: done ? getUserNameFromCustomUser(user) : undefined,
        doneAt: done ? new Date() : undefined
      };
    }
    return task;
  });
};

export const editTask = (
  tasks: Task[], 
  id: string, 
  data: Partial<Omit<Task, "id">>
): Task[] => {
  return tasks.map(task => {
    if (task.id === id) {
      return { ...task, ...data };
    }
    return task;
  });
};

export const removeTask = (
  tasks: Task[], 
  id: string
): Task[] => {
  return tasks.filter(task => task.id !== id);
};

export const reorderTask = (
  tasks: Task[], 
  id: string, 
  newOrder: number
): Task[] => {
  const task = tasks.find(t => t.id === id);
  if (!task) return tasks;
  
  const taskType = task.type;
  const tasksOfSameType = tasks.filter(t => t.type === taskType);
  
  const boundedOrder = Math.max(0, Math.min(tasksOfSameType.length - 1, newOrder));
  
  return tasks.map(t => {
    if (t.id === id) {
      return { ...t, order: boundedOrder };
    } else if (t.type === taskType) {
      if (task.order < boundedOrder && t.order > task.order && t.order <= boundedOrder) {
        return { ...t, order: t.order - 1 };
      } else if (task.order > boundedOrder && t.order < task.order && t.order >= boundedOrder) {
        return { ...t, order: t.order + 1 };
      }
    }
    return t;
  });
};

export const filterTasks = (
  tasks: Task[], 
  roomId?: string, 
  type?: Task["type"]
): Task[] => {
  return tasks
    .filter(task => {
      if (roomId && type) {
        return task.roomId === roomId && task.type === type;
      } else if (roomId) {
        return task.roomId === roomId;
      } else if (type) {
        return task.type === type;
      }
      return true;
    })
    .sort((a, b) => a.order - b.order);
};

export const getZoneCalendar = (
  rooms: Room[], 
  currentZoneIndex: number, 
  zoneStartDate: Date, 
  weeks: number = 8
): Array<{ date: Date; zone: Room | null }> => {
  const calendar: Array<{ date: Date; zone: Room | null }> = [];
  let currentDate = new Date(zoneStartDate);
  let zoneIdx = currentZoneIndex;
  
  for (let i = 0; i < weeks; i++) {
    const weekZone = rooms.length > 0 ? rooms[zoneIdx % rooms.length] : null;
    
    calendar.push({
      date: new Date(currentDate),
      zone: weekZone
    });
    
    // Add 7 days for next week
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 7);
    
    zoneIdx = (zoneIdx + 1) % Math.max(1, rooms.length);
  }
  
  return calendar;
};
