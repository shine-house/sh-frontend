import { useQuery } from "@tanstack/react-query";
import * as householdsApi from "@/lib/api/households";
import { useAuth } from "@/context/AuthContext";
import type { MemberResponse } from "@/lib/api/types/user-types";

export const useHousehold = () => {
  const { activeHouseholdId } = useAuth();

  const membersQuery = useQuery({
    queryKey: ["household", activeHouseholdId, "members"],
    queryFn: () => householdsApi.listMembers(activeHouseholdId!),
    enabled: !!activeHouseholdId,
  });

  const members: MemberResponse[] = membersQuery.data?.members ?? [];

  return {
    members,
    memberCount: members.length,
    isShared: members.length > 1,
    isLoading: membersQuery.isLoading,
    refetchMembers: membersQuery.refetch,
  };
};