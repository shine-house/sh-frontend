import { useMutation } from "@tanstack/react-query";
import { verifyEmail, resendVerification } from "@/lib/api/auth";
import type { VerifyEmailRequest, ResendVerificationRequest } from "@/lib/api/types/auth-types";

export const useVerifyEmailMutation = () =>
  useMutation({
    mutationFn: (payload: VerifyEmailRequest) => verifyEmail(payload),
  });

export const useResendVerificationMutation = () =>
  useMutation({
    mutationFn: (payload: ResendVerificationRequest) => resendVerification(payload),
  });