
import { toast } from "sonner";
import { 
  createShareCode,
  getSharedData,
  updateSharedData,
  addUserToShare,
  removeUserFromShare,
  deleteShare,
  getUserName
} from "@/lib/supabase";
import type { RoomResponse, TaskResponse } from "./types";
import {getStartOfWeek } from "./taskUtils";

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

interface ShareTasksResult {
  success: boolean;
  sharingKey: string | null;
  isOwner: boolean;
  isJoined: boolean;
  rooms: RoomResponse[];
  tasks: TaskResponse[];
  currentZoneIndex: number;
  zoneStartDate: Date;
  // connectedUsers: ConnectedUser[];
  error?: Error;
}

export async function enableSharing(
  rooms: RoomResponse[], 
  tasks: TaskResponse[],
  currentZoneIndex: number,
  zoneStartDate: Date,
  user: User
): Promise<ShareTasksResult> {
  if (!user) {
    throw new Error("Você precisa estar logado para compartilhar sua lista");
  }
  
  try {
    const userName = getUserNameFromCustomUser(user);
    console.log("Enabling sharing for user:", userName);

    const dataToShare = {
      rooms,
      tasks,
      zoneIndex: currentZoneIndex,
      zoneStartDate: zoneStartDate.toISOString()
    };
    
    const newKey = await createShareCode(dataToShare);
    console.log("Sharing key generated:", newKey);
    
    // const connectedUsers: ConnectedUser[] = [{
      // id: user.id,
      // name: userName,
      // isOwner: true,
      // joinedAt: new Date()
    // }];
    
    return {
      success: true,
      sharingKey: newKey,
      isOwner: true,
      isJoined: false,
      rooms,
      tasks,
      currentZoneIndex,
      zoneStartDate,
      // connectedUsers
    };
  } catch (error) {
    console.error("Error enabling sharing:", error);
    return {
      success: false,
      sharingKey: null,
      isOwner: false,
      isJoined: false,
      rooms,
      tasks,
      currentZoneIndex,
      zoneStartDate,
      // connectedUsers: [],
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    };
  }
}

export async function disableSharing(
  sharingKey: string | null, 
  isOwner: boolean
): Promise<boolean> {
  if (isOwner && sharingKey) {
    try {
      await deleteShare(sharingKey);
      return true;
    } catch (error) {
      console.error("Erro ao excluir compartilhamento:", error);
      return false;
    }
  }
  return true;
}

export async function loadSharedTasks(
  key: string,
  user: User
): Promise<ShareTasksResult> {
  if (!key.startsWith("shine-")) {
    return {
      success: false,
      sharingKey: null,
      isOwner: false,
      isJoined: false,
      rooms: [],
      tasks: [],
      currentZoneIndex: 0,
      zoneStartDate: new Date(),
      // connectedUsers: [],
      error: new Error("Código de compartilhamento inválido")
    };
  }
  
  if (!user) {
    return {
      success: false,
      sharingKey: null,
      isOwner: false,
      isJoined: false,
      rooms: [],
      tasks: [],
      currentZoneIndex: 0,
      zoneStartDate: new Date(),
      // connectedUsers: [],
      error: new Error("Você precisa estar logado para entrar em uma lista compartilhada")
    };
  }
  
  try {
    console.log("Loading shared tasks with key:", key);
    const sharedData = await getSharedData(key);
    
    if (!sharedData) {
      console.error("Shared data not found for key:", key);
      return {
        success: false,
        sharingKey: null,
        isOwner: false,
        isJoined: false,
        rooms: [],
        tasks: [],
        currentZoneIndex: 0,
        zoneStartDate: new Date(),
        // connectedUsers: [],
        error: new Error("Código de compartilhamento não encontrado")
      };
    }
    
    const shareData = sharedData.share_data;
    console.log("Shared data loaded:", shareData);
    
    // Check if current user is the owner
    const isOwner = sharedData.owner_id === user.id;
    console.log("User is owner:", isOwner, "User ID:", user.id, "Owner ID:", sharedData.owner_id);
    
    // Add user to share list if they're not already there and get proper user name
    let userResult;
    try {
      const currentUserName = getUserNameFromCustomUser(user);
      userResult = await addUserToShare(key, {
        id: user.id,
        name: currentUserName
      });
      console.log("User added/updated in share list:", userResult);
    } catch (error) {
      console.warn("Could not add user to share list:", error);
    }
    
    // Process connected users - get all users from the response
    // let connectedUsers: ConnectedUser[] = [];
    
    if (userResult && Array.isArray(userResult)) {
      connectedUsers = userResult.map(u => ({
        id: u.user_id,
        name: u.name || (u.is_owner ? 'Proprietário' : 'Convidado'),
        isOwner: u.is_owner,
        joinedAt: new Date(u.joined_at)
      }));
    } else if (sharedData.users && Array.isArray(sharedData.users)) {
      connectedUsers = sharedData.users.map(u => ({
        id: u.user_id,
        name: u.name || (u.is_owner ? 'Proprietário' : 'Convidado'),
        isOwner: u.is_owner,
        joinedAt: new Date(u.joined_at)
      }));
    }
    
    console.log("Final connected users:", connectedUsers);
    
    return {
      success: true,
      sharingKey: key,
      isOwner: isOwner,
      isJoined: !isOwner, // Only joined if not owner
      rooms: shareData.rooms,
      tasks: shareData.tasks,
      currentZoneIndex: shareData.zoneIndex || 0,
      zoneStartDate: new Date(shareData.zoneStartDate) || getStartOfWeek(new Date()),
      // connectedUsers
    };
  } catch (error) {
    console.error("Erro ao carregar lista compartilhada:", error);
    return {
      success: false,
      sharingKey: null,
      isOwner: false,
      isJoined: false,
      rooms: [],
      tasks: [],
      currentZoneIndex: 0,
      zoneStartDate: new Date(),
      // connectedUsers: [],
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    };
  }
}

export async function syncToSupabase(
  sharingKey: string,
  rooms: Room[],
  tasks: Task[],
  currentZoneIndex: number,
  zoneStartDate: Date
): Promise<boolean> {
  try {
    console.log(`Syncing to Supabase with key: ${sharingKey}`);
    console.log("Tasks being synced:", tasks.filter(t => t.done).map(t => ({ 
      id: t.id, 
      name: t.name, 
      done: t.done, 
      doneBy: t.doneBy, 
      doneAt: t.doneAt 
    })));
    
    const dataToSync = {
      rooms,
      tasks,
      zoneIndex: currentZoneIndex,
      zoneStartDate: zoneStartDate.toISOString()
    };
    
    await updateSharedData(sharingKey, dataToSync);
    console.log("Successfully synced to Supabase");
    return true;
  } catch (error) {
    console.error("Erro ao sincronizar para o Supabase:", error);
    return false;
  }
}

export async function syncFromSupabase(
  sharingKey: string, 
  user: User,
  lastSyncTimestamp: number,
  // connectedUsers: ConnectedUser[]
): Promise<{
  updated: boolean;
  rooms?: RoomResponse[];
  tasks?: TaskResponse[];
  currentZoneIndex?: number;
  zoneStartDate?: Date;
  // connectedUsers?: ConnectedUser[];
  lastSyncTimestamp: number;
}> {
  if (!sharingKey || !user) {
    return { updated: false, lastSyncTimestamp };
  }
  
  try {
    const sharedData = await getSharedData(sharingKey);
    
    if (sharedData && sharedData.share_data) {
      const serverTimestamp = new Date(sharedData.updated_at || '').getTime();
      
      // Always check for user updates, but only sync data if there are actual changes
      const updatedConnectedUsers = sharedData.users && Array.isArray(sharedData.users)
        ? sharedData.users.map((user) => ({
            id: user.user_id,
            name: user.name || (user.is_owner ? 'Proprietário' : 'Convidado'),
            isOwner: user.is_owner,
            joinedAt: new Date(user.joined_at)
          }))
        : [];
      
      // Check if we need to update due to timestamp or user changes
      // const usersChanged = JSON.stringify(connectedUsers) !== JSON.stringify(updatedConnectedUsers);
      const dataChanged = serverTimestamp > lastSyncTimestamp;
      
      if (dataChanged ) {
        const shareData = sharedData.share_data;
        
        console.log("Sync from Supabase - updated users:", updatedConnectedUsers);
        console.log("Sync from Supabase - rooms:", shareData.rooms);
        console.log("Sync from Supabase - tasks:", shareData.tasks);
        console.log("Tasks with completion info:", shareData.tasks?.filter(t => t.done).map(t => ({ 
          id: t.id, 
          name: t.name, 
          done: t.done, 
          doneBy: t.doneBy, 
          doneAt: t.doneAt 
        })));
        
        return {
          updated: true,
          rooms: shareData.rooms,
          tasks: shareData.tasks,
          currentZoneIndex: shareData.zoneIndex,
          zoneStartDate: new Date(shareData.zoneStartDate),
          // connectedUsers: updatedConnectedUsers,
          lastSyncTimestamp: Date.now()
        };
      }
    }
    
    return { updated: false, lastSyncTimestamp };
  } catch (error) {
    console.error("Erro ao sincronizar do Supabase:", error);
    return { updated: false, lastSyncTimestamp };
  }
}

export async function removeUserFromShareList(
  sharingKey: string,
  userId: string
): Promise<ConnectedUser[]> {
  try {
    const updatedUsers = await removeUserFromShare(sharingKey, userId);
    
    const connectedUsers = updatedUsers.map(u => ({
      id: u.user_id,
      name: u.name || (u.is_owner ? 'Proprietário' : 'Convidado'),
      isOwner: u.is_owner,
      joinedAt: new Date(u.joined_at)
    }));
    
    toast.success("Usuário removido com sucesso");
    return connectedUsers;
  } catch (error) {
    console.error("Erro ao remover usuário:", error);
    toast.error("Erro ao remover usuário");
    throw error;
  }
}
