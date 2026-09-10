import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useVerifyEmailMutation, useResendVerificationMutation } from "@/features/auth/useEmailVerificationMutation";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2, ShieldAlert, Sparkles } from "lucide-react";

const TOKEN_ERROR_MESSAGES: Record<string, string> = {
  REG_VERIFICATION_TOKEN_INVALID: "Este link de verificação é inválido ou já foi utilizado.",
  REG_VERIFICATION_TOKEN_EXPIRED: "Este link de verificação expirou. Solicite um novo.",
  REG_EMAIL_ALREADY_EXISTS: "Este email já foi verificado. Você já pode fazer login.",
};

type VerificationStatus = "loading" | "success" | "error";
const REDIRECT_DELAY_MS = 2500;

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { mutateAsync: verifyEmail } = useVerifyEmailMutation();
  const { mutateAsync: resendVerification, isPending: isResending } = useResendVerificationMutation();

  const token = searchParams.get("token");

  const [status, setStatus] = useState<VerificationStatus>(token ? "loading" : "error");
  const [errorMessage, setErrorMessage] = useState<string | null>(
    token ? null : "Link de verificação inválido. Verifique se você acessou o link enviado por email corretamente."
  );

  const [resendEmail, setResendEmail] = useState("");
  const [resendSent, setResendSent] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    (async () => {
      try {
        await verifyEmail({ token });
        if (!cancelled) setStatus("success");
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError) {
          setErrorMessage(TOKEN_ERROR_MESSAGES[err.data.error_code] ?? err.data.message);
        } else {
          setErrorMessage("Não foi possível verificar seu email. Tente novamente mais tarde.");
        }
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
    // Runs exactly once per token value on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (status !== "success") return;

    const timeoutId = setTimeout(() => {
      navigate("/auth");
    }, REDIRECT_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [status, navigate]);

  const handleResend = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    setResendSent(false);
    try {
      await resendVerification({ email: resendEmail.trim() });
    } finally {
      setResendSent(true);
    }
  };

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="flex flex-col items-center gap-3 py-6">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600 dark:text-teal-400" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Verificando seu email...</p>
        </div>
      );
    }

    if (status === "success") {
      return (
        <div className="space-y-4">
          <Alert className="rounded-xl py-2.5 border-teal-100 bg-teal-50/50 dark:bg-teal-950/20 dark:border-teal-900/30">
            <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <AlertDescription className="text-xs font-medium text-teal-800 dark:text-teal-200">
              Sua conta foi verificada com sucesso! Redirecionando para o login...
            </AlertDescription>
          </Alert>
          <Link to="/auth">
            <Button className="w-full rounded-xl h-10 text-xs font-semibold">
              Ir para o login agora
            </Button>
          </Link>
        </div>
      );
    }

    // status === "error"
    return (
      <div className="space-y-4">
        <Alert variant="destructive" className="rounded-xl py-2.5">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription className="text-xs font-medium">{errorMessage}</AlertDescription>
        </Alert>

        {resendSent ? (
          <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
            Se este email possuir um cadastro pendente, um novo link foi enviado.
          </p>
        ) : (
          <form onSubmit={handleResend} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="resend-email" className="text-[11px] font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                Reenviar verificação para
              </Label>
              <Input
                id="resend-email"
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="nome@exemplo.com"
                className="rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-teal-500 dark:border-slate-800"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-xl h-10 text-xs font-semibold"
              disabled={isResending}
            >
              {isResending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
              Enviar novo link
            </Button>
          </form>
        )}

        <Link to="/auth" className="flex items-center justify-center text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors pt-1">
          Voltar para o login
        </Link>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-50/50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 dark:bg-teal-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-slate-400/10 dark:bg-slate-800/10 blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl z-10 transition-all duration-300">
        <CardHeader className="space-y-1.5 pt-6 pb-4">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-2">
            <Sparkles className="h-5 w-5" />
          </div>
          <CardTitle className="text-center text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Verificação de email
          </CardTitle>
          <CardDescription className="text-center text-xs text-slate-500 dark:text-slate-400">
            Confirmando o acesso à sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">{renderContent()}</CardContent>
      </Card>
    </div>
  );
}