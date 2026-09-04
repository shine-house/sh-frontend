import { useMutation } from "@tanstack/react-query";
import { forgotPassword, resetPassword } from "@/lib/api/auth";
import type { ResetPasswordRequest } from "@/lib/api/types/auth-types";

export const useForgotPasswordMutation = () =>
  useMutation({
    mutationFn: (email: string) => forgotPassword({ email }),
  });

export const useResetPasswordMutation = () =>
  useMutation({
    mutationFn: (payload: ResetPasswordRequest) => resetPassword(payload),
  });