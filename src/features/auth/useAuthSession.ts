import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/api/auth";

export const useAuthSession = () =>
  useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 0,
  });
