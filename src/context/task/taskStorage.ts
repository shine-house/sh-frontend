import type { RoomResponse, TaskResponse } from "./types";
import {getStartOfWeek } from "./taskUtils";

export const saveToLocalStorage = (data: {
  rooms: RoomResponse[];
  tasks: TaskResponse[];
  currentZoneIndex: number;
  zoneStartDate: Date;
  sharingKey: string | null;
  isSharingEnabled: boolean;
}) => {
  console.log("Saving to localStorage - Sharing enabled:", data.isSharingEnabled);
  
  // Only save actual data if NOT sharing - otherwise just save sharing state
  if (!data.isSharingEnabled) {
    console.log("SOLO MODE: Saving complete data to localStorage");
    localStorage.setItem("shine-house-rooms", JSON.stringify(data.rooms));
    localStorage.setItem("shine-house-tasks", JSON.stringify(data.tasks));
    localStorage.setItem("shine-house-current-zone-index", data.currentZoneIndex.toString());
    localStorage.setItem("shine-house-zone-start-date", data.zoneStartDate.toISOString());
  } else {
    console.log("SHARING MODE: Only saving sharing flags to localStorage, NOT data");
  }
  
  // Always save sharing state
  localStorage.setItem("shine-house-sharing-key", data.sharingKey || "");
  localStorage.setItem("shine-house-is-sharing-enabled", data.isSharingEnabled.toString());
};

export const loadFromLocalStorage = () => {
  const storedRooms = localStorage.getItem("shine-house-rooms");
  const storedTasks = localStorage.getItem("shine-house-tasks");
  const storedZoneIndex = localStorage.getItem("shine-house-current-zone-index");
  const storedZoneStartDate = localStorage.getItem("shine-house-zone-start-date");
  const storedSharingKey = localStorage.getItem("shine-house-sharing-key");
  const storedIsSharingEnabled = localStorage.getItem("shine-house-is-sharing-enabled") === "true";
  
  // If sharing is enabled, return only sharing flags and defaults for data
  if (storedIsSharingEnabled && storedSharingKey) {
    console.log("SHARING MODE: Only returning sharing flags, using default data for rooms/tasks");
    return {
      rooms: DEFAULT_ROOMS, // Default data, will be overridden by Supabase
      tasks: generateDefaultTasks(), // Default data, will be overridden by Supabase
      currentZoneIndex: 0, // Default, will be overridden by Supabase
      zoneStartDate: getStartOfWeek(new Date()), // Default, will be overridden by Supabase
      sharingKey: storedSharingKey,
      isSharingEnabled: storedIsSharingEnabled,
    };
  }
  
  // Regular mode: load all data from localStorage
  console.log("REGULAR MODE: Loading all data from localStorage");
  
  return {
    rooms: storedRooms ? JSON.parse(storedRooms) : DEFAULT_ROOMS,
    tasks: storedTasks ? JSON.parse(storedTasks) : generateDefaultTasks(),
    currentZoneIndex: storedZoneIndex ? parseInt(storedZoneIndex, 10) : 0,
    zoneStartDate: storedZoneStartDate ? new Date(storedZoneStartDate) : getStartOfWeek(new Date()),
    sharingKey: storedSharingKey || null,
    isSharingEnabled: storedIsSharingEnabled,
  };
};