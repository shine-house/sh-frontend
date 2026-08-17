import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { createShareApi } from "@/lib/api/sharing";
import type { MemberResponse } from "@/lib/api/types/sharing-types";

export const useHousehold = () => {
  const { activeHouseholdId, user, isLoading: authLoading } = useAuth();

  const shareApi = useMemo(
    () => (activeHouseholdId ? createShareApi(activeHouseholdId) : null),
    [activeHouseholdId]
  );

  const membersQuery = useQuery({
    queryKey: ["household", activeHouseholdId, "members"],
    queryFn: async () => {
      if (!shareApi) {
        return { members: [], total: 0 };
      }

      return shareApi.listMembers();
    },
    enabled: !!user && !!activeHouseholdId && !authLoading,
    retry: false,
    staleTime: 1000,
  });

  const members: MemberResponse[] = membersQuery.data?.members ?? [];

  return {
    members,
    memberCount: members.length,
    isShared: members.length > 1,
    isLoading: authLoading || membersQuery.isLoading,
    refetchMembers: membersQuery.refetch,
  };
};