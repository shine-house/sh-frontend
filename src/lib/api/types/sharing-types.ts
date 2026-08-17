import type { RoleEnum, UUID } from "./util-types";


export interface ActiveInvite {
  id: UUID;
  created_at: string;
  usage_count: number;
  invite_key: string;
  users_joined: UUID;
}
export interface InviteCodeResponse {
  usage_count: number;
  id: UUID;
  household_id: UUID;
  invite_key: string;
  is_active: boolean;
  created_at: string;
}

export interface InviteCodeInfoResponse {
  household_id: UUID;
  message: string;
  active_invite: ActiveInvite;
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