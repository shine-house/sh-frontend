import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useResetPasswordMutation } from "@/features/auth/usePasswordResetMutation";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2, ShieldAlert, Sparkles } from "lucide-react";

const TOKEN_ERROR_MESSAGES: Record<string, string> = {
  PWD_RESET_TOKEN_INVALID: "Este link de redefinição é inválido ou já foi utilizado. Solicite um novo.",
  PWD_RESET_TOKEN_EXPIRED: "Este link de redefinição expirou. Solicite um novo link.",
};

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, logout } = useAuth();
  const { mutateAsync, isPending } = useResetPasswordMutation();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirm?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => navigate("/auth"), 3000);
    return () => clearTimeout(timer);
  }, [success, navigate]);

  const validate = (): boolean => {
    const errors: { password?: string; confirm?: string } = {};

    if (newPassword.length < 8) {
      errors.password = "A senha deve ter no mínimo 8 caracteres.";
    }
    if (confirmPassword !== newPassword) {
      errors.confirm = "As senhas não coincidem.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!token || !validate()) return;

    try {
      await mutateAsync({
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      if (isAuthenticated) {
        await logout();
      }

      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(TOKEN_ERROR_MESSAGES[err.data.error_code] ?? err.data.message);
      } else {
        setServerError("Não foi possível redefinir sua senha. Tente novamente mais tarde.");
      }
    }
  };

  const renderContent = () => {
    if (!token) {
      return (
        <div className="space-y-4">
          <Alert variant="destructive" className="rounded-xl py-2.5">
            <ShieldAlert className="h-4 w-4" />
            <AlertDescription className="text-xs font-medium">
              Link de redefinição inválido. Verifique se você acessou o link enviado por email corretamente.
            </AlertDescription>
          </Alert>
          <Link to="/forgot-password">
            <Button className="w-full rounded-xl h-10 text-xs font-semibold">
              Solicitar novo link
            </Button>
          </Link>
        </div>
      );
    }

    if (success) {
      return (
        <div className="space-y-4">
          <Alert className="rounded-xl py-2.5 border-teal-100 bg-teal-50/50 dark:bg-teal-950/20 dark:border-teal-900/30">
            <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <AlertDescription className="text-xs font-medium text-teal-800 dark:text-teal-200">
              Senha redefinida com sucesso! Redirecionando para o login...
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

    return (
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {serverError && (
          <Alert variant="destructive" className="rounded-xl py-2.5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs font-medium">{serverError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="new-password" className="text-[11px] font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
            Nova senha
          </Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            className="rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-teal-500 dark:border-slate-800"
            required
            minLength={8}
          />
          {fieldErrors.password && (
            <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">{fieldErrors.password}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm-new-password" className="text-[11px] font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
            Confirmar nova senha
          </Label>
          <Input
            id="confirm-new-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita a nova senha"
            className="rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-teal-500 dark:border-slate-800"
            required
            minLength={8}
          />
          {fieldErrors.confirm && (
            <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">{fieldErrors.confirm}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full rounded-xl h-10 text-xs font-semibold mt-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 transition-all active:scale-[0.98]"
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
          Redefinir senha
        </Button>
      </form>
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
            Redefinir senha
          </CardTitle>
          <CardDescription className="text-center text-xs text-slate-500 dark:text-slate-400">
            Escolha uma nova senha para sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">{renderContent()}</CardContent>
      </Card>
    </div>
  );
}