import { apiClient } from "./client";
import type {
  InviteCodeResponse,
  JoinHouseholdResponse,
  ListMemberResponse
} from "@/lib/api/types/sharing-types";
import type { InfoMessage } from "./types/util-types";

export const createShareApi = (householdId: string) => {
  const basePath = `/households/${householdId}`;

  return {
    getInviteCode: () =>
      apiClient.get<InviteCodeResponse>(`${basePath}/invites`),

    revokeInvite: (inviteId: string) =>
      apiClient.delete<void>(`${basePath}/members/${inviteId}`),

    joinHouseholdByInviteCode: (inviteCode: string) =>
      apiClient.post<JoinHouseholdResponse>("/households/join", { invite_key: inviteCode }),

    listMembers: () =>
      apiClient.get<ListMemberResponse>(`${basePath}/members`),

    removeMember: (id: string) =>
      apiClient.delete<InfoMessage>(`${basePath}/members/${id}`),

    leaveHousehold: () =>
      apiClient.post<InfoMessage>(`${basePath}/leave`),

  };
};

export type ShareApi = ReturnType<typeof createShareApi>;