import { apiClient } from "./client";
import type { ListMemberResponse } from "./types/user-types";

export interface InviteCodeResponse {
  invite_code: string;
}

export interface PendingMemberResponse {
  user_id: string;
  name: string;
  requested_at: string;
}

export interface ListPendingMemberResponse {
  items: PendingMemberResponse[];
}

export interface JoinHouseholdResponse {
  household_id: string;
  status: "pending" | "joined";
}

export const getInviteCode = (householdId: string) =>
  apiClient.get<InviteCodeResponse>(`/households/${householdId}/invite-code`);

export const regenerateInviteCode = (householdId: string) =>
  apiClient.post<InviteCodeResponse>(`/households/${householdId}/invite-code/regenerate`);

export const listMembers = (householdId: string) =>
  apiClient.get<ListMemberResponse>(`/households/${householdId}/members`);

export const removeMember = (householdId: string, userId: string) =>
  apiClient.delete<void>(`/households/${householdId}/members/${userId}`);

export const joinHouseholdByInviteCode = (inviteCode: string) =>
  apiClient.post<JoinHouseholdResponse>("/households/join", { invite_code: inviteCode });

export const listPendingMembers = (householdId: string) =>
  apiClient.get<ListPendingMemberResponse>(`/households/${householdId}/pending-members`);

export const approvePendingMember = (householdId: string, userId: string) =>
  apiClient.post<void>(`/households/${householdId}/pending-members/${userId}/approve`, {});

export const rejectPendingMember = (householdId: string, userId: string) =>
  apiClient.post<void>(`/households/${householdId}/pending-members/${userId}/reject`, {});