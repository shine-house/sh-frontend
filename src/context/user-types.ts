import type { UUID } from "./util-types";

type RoleEnum = "owner" | "member";

interface UserBase {
  email: string;
  name?: string | null;
}

export interface UserCreate extends UserBase {
  password: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserUpdateRequest {
  email?: string | null;
  name?: string | null;
  password?: string | null;
}

export interface UserResponse extends UserBase {
  id: UUID;
  last_login?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPublic {
  id: UUID;
  name?: string | null;
  email: string;
  created_at: string;
}

export interface HouseholdInfo {
  id: UUID;
  name: string;
  role: RoleEnum;
}

export interface AuthMeResponse {
  user: UserResponse;
  active_household_id: string;
}

export interface LoginResponse extends AuthMeResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface MemberResponse{
  user_id: UUID;
  household_id: UUID;
  role: RoleEnum;
  joined_at: string;
}

export interface ListMemberResponse{
  members: MemberResponse[];
  total: number;
}