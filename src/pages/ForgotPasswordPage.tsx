import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useForgotPasswordMutation } from "@/features/auth/usePasswordResetMutation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useEffect } from "react";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { mutateAsync, isPending } = useForgotPasswordMutation();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);

    if (!email.trim()) {
      setFieldError("Informe seu email.");
      return;
    }

    try {
      await mutateAsync(email.trim());
    } catch {
    } finally {
      setSubmitted(true);
    }
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
            Esqueceu sua senha?
          </CardTitle>
          <CardDescription className="text-center text-xs text-slate-500 dark:text-slate-400">
            Informe seu email e enviaremos um link para redefinir sua senha.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6 space-y-4">
          {submitted ? (
            <Alert className="rounded-xl py-2.5 border-teal-100 bg-teal-50/50 dark:bg-teal-950/20 dark:border-teal-900/30">
              <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <AlertDescription className="text-xs font-medium text-teal-800 dark:text-teal-200">
                Se este email estiver registrado, você receberá um link para redefinir sua senha em instantes.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="forgot-email" className="text-[11px] font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  Email
                </Label>
                <Input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@exemplo.com"
                  className="rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-teal-500 dark:border-slate-800"
                  required
                />
                {fieldError && (
                  <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">{fieldError}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl h-10 text-xs font-semibold mt-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 transition-all active:scale-[0.98]"
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                Enviar link de redefinição
              </Button>
            </form>
          )}

          <Link to="/auth" className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors pt-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar para o login
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}