import type { RoleEnum, UUID } from "./util-types";


export interface InviteCodeResponse {
  usage_count: number;
  id: UUID;
  household_id: UUID;
  invite_key: string;
  is_active: boolean;
  created_at: string;
}

export interface MemberResponse {
  user_id: UUID;
  household_id: UUID;
  name: string;
  role: RoleEnum;
  joined_at: string;
}

export interface ListMemberResponse {
  members: MemberResponse[];
  total: number;
}

export interface JoinHouseholdResponse {
  household_id: UUID;
  message: string;
}