import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import type { RoomResponse, TaskCreate, TaskContextType, TaskResponse } from "./types";
import { DEFAULT_ROOMS, generateDefaultTasks, getStartOfWeek, addDays } from "./taskUtils";
import { 
  saveToLocalStorage, 
  loadFromLocalStorage 
} from "./taskStorage";
import { 
  loadUserData,
  saveUserData,
  updateTaskStatus as updateTaskStatusInDB
} from "@/lib/supabase/userData";
import {
  enableSharing as enableSharingService,
  disableSharing as disableSharingService,
  loadSharedTasks as loadSharedTasksService,
  syncToSupabase,
  syncFromSupabase,
  removeUserFromShareList
} from "./taskSharing";
import {
  addRoom as addRoomOperation,
  removeRoom as removeRoomOperation,
  addTask as addTaskOperation,
  toggleTaskStatus as toggleTaskStatusOperation,
  editTask as editTaskOperation,
  removeTask as removeTaskOperation,
  reorderTask as reorderTaskOperation,
  filterTasks as filterTasksOperation,
  getZoneCalendar as getZoneCalendarOperation
} from "./taskOperations";

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};

const POLLING_INTERVAL = 5000; // Reduced polling frequency
const SYNC_DEBOUNCE_MS = 1000; // Debounce sync calls

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { user, isLoading: authLoading } = useAuth();
  
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  
  const [currentZoneIndex, setCurrentZoneIndex] = useState<number>(0);
  const [zoneStartDate, setZoneStartDate] = useState<Date>(() => getStartOfWeek(new Date()));
  
  // Initialize sharing state from localStorage to persist across page reloads
  const [sharingKey, setSharingKey] = useState<string | null>(() => {
    const stored = localStorage.getItem("shine-house-sharing-key");
    return stored || null;
  });
  const [isSharingEnabled, setIsSharingEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem("shine-house-is-sharing-enabled");
    return stored === "true";
  });
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<number>(Date.now());
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [syncAttempts, setSyncAttempts] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Refs for debouncing and preventing infinite loops
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncDataRef = useRef<string>("");
  const isLoadingInitialDataRef = useRef<boolean>(false);

  const currentZone = rooms.length > 0 ? rooms[currentZoneIndex % rooms.length] : null;
  const nextZoneChangeDate = addDays(zoneStartDate, 7);

  // Debounced sync function to prevent infinite loops
  const debouncedSync = useCallback(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    
    syncTimeoutRef.current = setTimeout(() => {
      if (isSharingEnabled && sharingKey && user && !isSyncing) {
        const currentDataString = JSON.stringify({ rooms, tasks, currentZoneIndex, zoneStartDate });
        if (currentDataString !== lastSyncDataRef.current) {
          console.log("SHARING MODE: Data changed, syncing to Supabase");
          lastSyncDataRef.current = currentDataString;
          handleSyncWithSupabase();
        }
      }
    }, SYNC_DEBOUNCE_MS);
  }, [isSharingEnabled, sharingKey, user, rooms, tasks, currentZoneIndex, zoneStartDate]);

  // Clear localStorage data when sharing is enabled to prevent conflicts
  const clearLocalStorageData = useCallback(() => {
    console.log("SHARING MODE: Clearing localStorage data to prevent conflicts");
    localStorage.removeItem("shine-house-rooms");
    localStorage.removeItem("shine-house-tasks");
    localStorage.removeItem("shine-house-current-zone-index");
    localStorage.removeItem("shine-house-zone-start-date");
  }, []);

  // Load initial data with user-based or sharing priority
  useEffect(() => {
    // Don't load data until auth is initialized
    if (authLoading) {
      console.log("Waiting for auth to initialize...");
      return;
    }

    const loadInitialData = async () => {
      console.log("Loading initial data. User:", user?.id, "Sharing enabled:", isSharingEnabled);
      
      if (isLoadingInitialDataRef.current) {
        console.log("Already loading initial data, skipping");
        return;
      }
      
      isLoadingInitialDataRef.current = true;
      
      try {
        if (user && !isSharingEnabled) {
          // Regular authenticated mode: load user's personal data from database
          console.log("USER MODE: Loading user data from database");
          const userData = await loadUserData(user.id);
          
          if (userData) {
            console.log("USER MODE: Successfully loaded user data from database");
            setRooms(userData.rooms);
            setTasks(userData.tasks);
            setCurrentZoneIndex(userData.zoneSettings.currentZoneIndex);
            setZoneStartDate(userData.zoneSettings.zoneStartDate);
            
            // Clear any localStorage data to avoid conflicts
            localStorage.removeItem("shine-house-rooms");
            localStorage.removeItem("shine-house-tasks");
            localStorage.removeItem("shine-house-current-zone-index");
            localStorage.removeItem("shine-house-zone-start-date");
            
            toast.success("Dados carregados da sua conta!");
          } else {
            console.log("USER MODE: No data found, creating default data for user");
            // First-time user - save default data to database
            const defaultUserData = {
              rooms: DEFAULT_ROOMS,
              tasks: generateDefaultTasks(),
              zoneSettings: {
                currentZoneIndex: 0,
                zoneStartDate: getStartOfWeek(new Date())
              }
            };
            
            const saved = await saveUserData(user.id, defaultUserData);
            if (saved) {
              console.log("USER MODE: Default data saved to database");
              setRooms(DEFAULT_ROOMS);
              setTasks(generateDefaultTasks());
              setCurrentZoneIndex(0);
              setZoneStartDate(getStartOfWeek(new Date()));
              toast.success("Conta configurada com dados iniciais!");
            } else {
              console.error("USER MODE: Failed to save default data");
              setRooms(DEFAULT_ROOMS);
              setTasks(generateDefaultTasks());
              setCurrentZoneIndex(0);
              setZoneStartDate(getStartOfWeek(new Date()));
            }
          }
        } else if (isSharingEnabled && sharingKey && user) {
          // Sharing mode: load from Supabase sharing data
          console.log("SHARING MODE: Loading from Supabase, ignoring localStorage and user data");
          clearLocalStorageData();
          
          const result = await syncFromSupabase(sharingKey, user, 0, []);
          if (result.updated) {
            console.log("SHARING MODE: Successfully loaded shared data");
            setRooms(result.rooms || []);
            setTasks(result.tasks || []);
            setCurrentZoneIndex(result.currentZoneIndex || 0);
            setZoneStartDate(result.zoneStartDate || getStartOfWeek(new Date()));
            setConnectedUsers(result.connectedUsers || []);
            setLastSyncTimestamp(Date.now());
          } else {
            console.log("SHARING MODE: Failed to load shared data, using defaults");
            setRooms(DEFAULT_ROOMS);
            setTasks(generateDefaultTasks());
          }
        } else {
          // Unauthenticated mode: use localStorage fallback
          console.log("GUEST MODE: Loading from localStorage (unauthenticated)");
          const data = loadFromLocalStorage();
          console.log("Loaded data from localStorage:", data);
          
          setRooms(data.rooms);
          setTasks(data.tasks);
          setCurrentZoneIndex(data.currentZoneIndex);
          setZoneStartDate(data.zoneStartDate);
          setSharingKey(data.sharingKey);
          setIsSharingEnabled(data.isSharingEnabled);
          
          // Show notice about guest mode
          if (!user) {
            setTimeout(() => {
              toast.info("Você está no modo visitante. Faça login para sincronizar seus dados entre dispositivos.", {
                duration: 5000
              });
            }, 2000);
          }
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        // Fallback to defaults
        setRooms(DEFAULT_ROOMS);
        setTasks(generateDefaultTasks());
      } finally {
        isLoadingInitialDataRef.current = false;
        setIsInitialized(true);
      }
    };

    loadInitialData();
  }, [user, isSharingEnabled, sharingKey, authLoading]);

  // Zone updates
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const zoneStart = new Date(zoneStartDate);
    zoneStart.setHours(0, 0, 0, 0);
    
    const daysSinceStart = Math.floor((today.getTime() - zoneStart.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceStart >= 7) {
      const newZoneIndex = (currentZoneIndex + 1) % Math.max(1, rooms.length);
      const newStartDate = getStartOfWeek(today);
      
      console.log("Auto-advancing to next zone:", newZoneIndex);
      setCurrentZoneIndex(newZoneIndex);
      setZoneStartDate(newStartDate);
    }
  }, [currentZoneIndex, zoneStartDate, rooms.length]);

  // Data persistence with user-based storage
  useEffect(() => {
    if (!isInitialized) return;

    console.log("Data changed, syncing. User:", user?.id, "Sharing enabled:", isSharingEnabled, "Key:", sharingKey);
    
    if (isSharingEnabled && sharingKey && user) {
      // Sharing mode: sync to Supabase sharing data
      console.log("SHARING MODE: Syncing to Supabase sharing");
      saveToLocalStorage({
        rooms: [],
        tasks: [],
        currentZoneIndex: 0,
        zoneStartDate: new Date(),
        sharingKey,
        isSharingEnabled
      });
      debouncedSync();
    } else if (user && !isSharingEnabled) {
      // User mode: save to user's database
      console.log("USER MODE: Saving to user database");
      const userData = {
        rooms,
        tasks,
        zoneSettings: {
          currentZoneIndex,
          zoneStartDate
        }
      };
      
      // Debounced save to prevent excessive API calls
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      
      syncTimeoutRef.current = setTimeout(async () => {
        const success = await saveUserData(user.id, userData);
        if (!success) {
          console.error("Failed to save user data to database");
          toast.error("Erro ao salvar dados");
        }
      }, SYNC_DEBOUNCE_MS);
    } else {
      // Guest mode: save to localStorage
      console.log("GUEST MODE: Saving to localStorage");
      saveToLocalStorage({
        rooms,
        tasks,
        currentZoneIndex,
        zoneStartDate,
        sharingKey,
        isSharingEnabled
      });
    }
  }, [rooms, tasks, currentZoneIndex, zoneStartDate, sharingKey, isSharingEnabled, isInitialized, user, debouncedSync]);

  // Poll for updates from Supabase when in sharing mode
  useEffect(() => {
    if (!isInitialized || !isSharingEnabled || !sharingKey || !user) {
      return;
    }

    console.log("Starting polling for updates");
    
    const syncInterval = setInterval(() => {
      if (!isSyncing) {
        handleSyncFromSupabase();
      }
    }, POLLING_INTERVAL);

    return () => clearInterval(syncInterval);
  }, [isInitialized, isSharingEnabled, sharingKey, user]);

  const handleSyncFromSupabase = async () => {
    if (!sharingKey || !user || isSyncing) return;
    
    setIsSyncing(true);
    
    try {
      const result = await syncFromSupabase(
        sharingKey,
        user,
        lastSyncTimestamp,
        connectedUsers
      );
      
      if (result.updated) {
        console.log("SHARING MODE: Received updated data from Supabase");
        
        if (result.connectedUsers) {
          setConnectedUsers(result.connectedUsers);
        }
        
        if (result.rooms && result.tasks) {
          setRooms(result.rooms);
          setCurrentZoneIndex(result.currentZoneIndex || 0);
          setZoneStartDate(result.zoneStartDate || getStartOfWeek(new Date()));
          setTasks(result.tasks);
          
          lastSyncDataRef.current = JSON.stringify({
            rooms: result.rooms,
            tasks: result.tasks,
            currentZoneIndex: result.currentZoneIndex || 0,
            zoneStartDate: result.zoneStartDate || getStartOfWeek(new Date())
          });
        }
        
        setLastSyncTimestamp(result.lastSyncTimestamp);
        setSyncAttempts(0);
      }
    } catch (error) {
      console.error("Erro ao sincronizar do Supabase:", error);
      
      setSyncAttempts(prev => {
        const newAttempts = prev + 1;
        if (newAttempts > 5) {
          toast.error("Falha na sincronização. Compartilhamento desativado.");
          handleDisableSharing();
        }
        return newAttempts;
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncWithSupabase = async () => {
    if (!sharingKey || !user || isSyncing) return;
    
    setIsSyncing(true);
    
    try {
      console.log("SHARING MODE: Syncing to Supabase with key:", sharingKey);
      
      const success = await syncToSupabase(
        sharingKey,
        rooms,
        tasks,
        currentZoneIndex,
        zoneStartDate
      );
      
      if (success) {
        setLastSyncTimestamp(Date.now());
        setSyncAttempts(0);
        console.log("SHARING MODE: Successfully synced to Supabase");
      }
    } catch (error) {
      console.error("Erro ao sincronizar para o Supabase:", error);
      
      setSyncAttempts(prev => {
        const newAttempts = prev + 1;
        if (newAttempts > 5) {
          toast.error("Falha na sincronização. Compartilhamento desativado.");
          handleDisableSharing();
        }
        return newAttempts;
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddRoom = (name: string) => {
    const updatedRooms = addRoomOperation(rooms, name);
    setRooms(updatedRooms);
  };

  const handleRemoveRoom = (id: string) => {
    const { rooms: updatedRooms, tasks: updatedTasks } = removeRoomOperation(rooms, tasks, id);
    setRooms(updatedRooms);
    setTasks(updatedTasks);
  };

  const handleAddTask = (taskData: TaskCreate) => {
    const updatedTasks = addTaskOperation(tasks, taskData);
    setTasks(updatedTasks);
  };

  const toggleTaskStatus = useCallback(async (id: string) => {
    console.log("Toggling task status for task:", id);
    
    // Optimistically update the UI first
    setTasks(prevTasks => {
      const updatedTasks = toggleTaskStatusOperation(prevTasks, id, user);
      const toggledTask = updatedTasks.find(t => t.id === id);
      console.log("Task status toggled, updated tasks:", toggledTask);
      
      // If user is authenticated and not in sharing mode, sync to database immediately
      if (user && !isSharingEnabled && toggledTask) {
        updateTaskStatusInDB(
          user.id, 
          id, 
          toggledTask.done, 
          toggledTask.doneBy
        ).catch(error => {
          console.error("Failed to sync task status to database:", error);
          toast.error("Erro ao salvar status da tarefa");
        });
      }
      
      return updatedTasks;
    });
  }, [user, isSharingEnabled]);

  const handleEditTask = (id: string, data: Partial<Omit<Task, "id">>) => {
    const updatedTasks = editTaskOperation(tasks, id, data);
    setTasks(updatedTasks);
  };

  const handleRemoveTask = (id: string) => {
    const updatedTasks = removeTaskOperation(tasks, id);
    setTasks(updatedTasks);
  };

  const handleReorderTask = (id: string, newOrder: number) => {
    const updatedTasks = reorderTaskOperation(tasks, id, newOrder);
    setTasks(updatedTasks);
  };

  const handleFilterTasks = (roomId?: string, type?: Task["type"]) => {
    return filterTasksOperation(tasks, roomId, type);
  };

  const handleManuallySetCurrentZone = (zoneId: string) => {
    const zoneIndex = rooms.findIndex(room => room.id === zoneId);
    if (zoneIndex !== -1) {
      setCurrentZoneIndex(zoneIndex);
      setZoneStartDate(getStartOfWeek(new Date()));
      toast.success(`Zona definida manualmente para: ${rooms[zoneIndex].name}`);
    }
  };

  const handleEnableSharing = async (): Promise<void> => {
    console.log("Creating shared list in Supabase");
    if (!user) {
      throw new Error("Você precisa estar logado para compartilhar sua lista");
    }
    
    try {
      const result = await enableSharingService(
        rooms,
        tasks,
        currentZoneIndex,
        zoneStartDate,
        user
      );
      
      if (result.success && result.sharingKey) {
        console.log("Sharing enabled successfully:", result.sharingKey);
        
        // Clear localStorage data to prevent conflicts
        clearLocalStorageData();
        
        setSharingKey(result.sharingKey);
        setIsSharingEnabled(true);
        setIsOwner(true);
        setIsJoined(false);
        setConnectedUsers(result.connectedUsers);
        setSyncAttempts(0);
        
        // Immediately persist sharing state to localStorage
        localStorage.setItem("shine-house-sharing-key", result.sharingKey);
        localStorage.setItem("shine-house-is-sharing-enabled", "true");
        
        // Update sync data ref
        lastSyncDataRef.current = JSON.stringify({ rooms, tasks, currentZoneIndex, zoneStartDate });
      } else {
        throw result.error || new Error("Erro desconhecido ao ativar compartilhamento");
      }
    } catch (error) {
      console.error("Error enabling sharing:", error);
      throw error;
    }
  };

  const handleDisableSharing = () => {
    console.log("Disabling sharing");
    setIsSharingEnabled(false);
    setIsJoined(false);
    setIsOwner(false);
    
    const key = sharingKey;
    const wasOwner = isOwner;
    
    setSharingKey(null);
    setConnectedUsers([]);
    setSyncAttempts(0);
    
    // Immediately clear sharing state from localStorage
    localStorage.removeItem("shine-house-sharing-key");
    localStorage.setItem("shine-house-is-sharing-enabled", "false");
    
    // Clear sync timeout and reset sync data ref
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    lastSyncDataRef.current = "";
    
    if (wasOwner && key) {
      disableSharingService(key, wasOwner);
    }
    
    toast.info("Compartilhamento desativado");
  };

  const handleLoadSharedTasks = async (key: string): Promise<boolean> => {
    if (!key.startsWith("shine-")) {
      toast.error("Código de compartilhamento inválido");
      return false;
    }
    
    if (!user) {
      toast.error("Você precisa estar logado para entrar em uma lista compartilhada");
      return false;
    }
    
    try {
      console.log("Loading shared tasks for key:", key);
      const result = await loadSharedTasksService(key, user);
      
      if (!result.success) {
        console.error(`Código de compartilhamento não encontrado: ${key}`);
        return false;
      }
      
      console.log("Successfully joined shared list");
      
      // Clear localStorage data to prevent conflicts
      clearLocalStorageData();
      
      setSharingKey(key);
      setIsSharingEnabled(true);
      setIsJoined(true);
      setIsOwner(false);
      setSyncAttempts(0);
      
      // Immediately persist sharing state to localStorage
      localStorage.setItem("shine-house-sharing-key", key);
      localStorage.setItem("shine-house-is-sharing-enabled", "true");
      
      setRooms(result.rooms);
      setCurrentZoneIndex(result.currentZoneIndex);
      setZoneStartDate(result.zoneStartDate);
      setConnectedUsers(result.connectedUsers);
      setTasks(result.tasks);
      setLastSyncTimestamp(Date.now());
      
      // Update sync data ref
      lastSyncDataRef.current = JSON.stringify({
        rooms: result.rooms,
        tasks: result.tasks,
        currentZoneIndex: result.currentZoneIndex,
        zoneStartDate: result.zoneStartDate
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao carregar lista compartilhada:", error);
      return false;
    }
  };

  const handleRemoveConnectedUser = async (userId: string) => {
    if (!isOwner || !sharingKey) {
      toast.error("Apenas o proprietário pode remover usuários");
      return;
    }
    
    try {
      const updatedUsers = await removeUserFromShareList(sharingKey, userId);
      setConnectedUsers(updatedUsers);
      toast.success("Usuário removido com sucesso");
    } catch (error) {
      console.error("Erro ao remover usuário:", error);
      toast.error("Erro ao remover usuário");
    }
  };

  const handleGetZoneCalendar = (weeks: number = 8) => {
    return getZoneCalendarOperation(rooms, currentZoneIndex, zoneStartDate, weeks);
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  return (
    <TaskContext.Provider
      value={{
        rooms,
        tasks,
        currentZoneIndex,
        currentZone,
        zoneStartDate,
        nextZoneChangeDate,
        addRoom: handleAddRoom,
        removeRoom: handleRemoveRoom,
        addTask: handleAddTask,
        toggleTaskStatus,
        editTask: handleEditTask,
        removeTask: handleRemoveTask,
        reorderTask: handleReorderTask,
        filterTasks: handleFilterTasks,
        sharingKey,
        isSharingEnabled,
        enableSharing: handleEnableSharing,
        disableSharing: handleDisableSharing,
        loadSharedTasks: handleLoadSharedTasks,
        getZoneCalendar: handleGetZoneCalendar,
        manuallySetCurrentZone: handleManuallySetCurrentZone,
        connectedUsers,
        removeConnectedUser: handleRemoveConnectedUser
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskProvider;