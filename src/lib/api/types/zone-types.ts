import type { UUID } from "@/lib/api/types/util-types";


// TODO: Refactor usages
// export interface ActiveZoneResponse {
//   room_id: UUID;
//   cycle_position: number;
//   cycle_length: number;
//   period_start_date: string;
//   period_end_date: string;
// }

export interface ActiveZoneResponse {
  room_id: UUID;        
  room_name: string;
  cycle_position: number;
  cycle_length: number;
  period_start_date: string; 
  period_end_date: string;   
  days_remaining: number;
  as_of_date: string;       
}