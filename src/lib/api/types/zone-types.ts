import type { UUID } from "../lib/api/types/util-types";


// TODO: Is really usefull?? need a new endpoint?
export interface ActiveZoneResponse {
  room_id: UUID;
  cycle_position: number;
  cycle_length: number;
  period_start_date: string; // ISO date
  period_end_date: string;   // ISO date
}