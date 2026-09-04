import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useResendVerificationMutation } from "@/features/auth/useEmailVerificationMutation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2, MailCheck, Sparkles } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const { mutateAsync: resendVerification, isPending: isResending } = useResendVerificationMutation();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [resendSent, setResendSent] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(loginEmail, loginPassword);
      navigate('/');
    } catch (err: any) {
      setError(err.message || "Falha no login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    if (registerPassword !== confirmPassword) {
      setError("As senhas não correspondem");
      return;
    }

    setIsLoading(true);

     try {
      await register(registerEmail, registerPassword, registerName);
      setPendingEmail(registerEmail);
    } catch (err: any) {
      setError(err.message || "Falha no registro. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!pendingEmail) return;
    setResendSent(false);
    try {
      await resendVerification({ email: pendingEmail });
    } finally {
      setResendSent(true);
    }
  };

  const goToLogin = () => {
    setPendingEmail(null);
    setResendSent(false);
    setActiveTab("login");
  };

  const renderCheckEmailScreen = () => (
    <div className="space-y-4">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
        <MailCheck className="h-6 w-6" />
      </div>
      <Alert className="rounded-xl py-2.5 border-teal-100 bg-teal-50/50 dark:bg-teal-950/20 dark:border-teal-900/30">
        <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
        <AlertDescription className="text-xs font-medium text-teal-800 dark:text-teal-200">
          Enviamos um link de confirmação para <strong>{pendingEmail}</strong>. Verifique sua
          caixa de entrada (e spam) para ativar sua conta.
        </AlertDescription>
      </Alert>

      {resendSent && (
        <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
          Se o email estiver pendente de confirmação, um novo link foi enviado.
        </p>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full rounded-xl h-10 text-xs font-semibold"
        onClick={handleResend}
        disabled={isResending}
      >
        {isResending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
        Reenviar email de confirmação
      </Button>

      <Button
        type="button"
        className="w-full rounded-xl h-10 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
        onClick={goToLogin}
      >
        Ir para o login
      </Button>
    </div>
  );

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
            Tarefas em Zona
          </CardTitle>
          <CardDescription className="text-center text-xs text-slate-500 dark:text-slate-400">
            Acesse sua conta ou crie uma nova para sincronizar seus ambientes
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-950 rounded-xl p-1 mb-4 h-10">
              <TabsTrigger value="login" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
                Entrar
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
                Cadastrar
              </TabsTrigger>
            </TabsList>

            {/* Aba de Login */}
            <TabsContent value="login" className="space-y-4 pt-1 focus-visible:outline-none">
              {error && (
                <Alert variant="destructive" className="rounded-xl py-2.5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-3.5">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email" className="text-[11px] font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                    Email [AUTH PAGHE]
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="nome@exemplo.com"
                    className="rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-teal-500 dark:border-slate-800"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="login-password">
                    <span className="text-[11px] font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">Senha</span>
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-teal-500 dark:border-slate-800"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl h-10 text-xs font-semibold mt-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 transition-all active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                  Entrar
                </Button>
              </form>
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                Esqueceu sua senha?
              </Link>
            </div>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 pt-1 focus-visible:outline-none">
              {pendingEmail ? (
                renderCheckEmailScreen()
              ) : (
                <>
                  {error && (
                    <Alert variant="destructive" className="rounded-xl py-2.5">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleRegister} className="space-y-3.5">
                <div className="space-y-1.5">
                  <Label htmlFor="register-name" className="text-[11px] font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                    Nome completo
                  </Label>
                  <Input
                    id="register-name"
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="Seu nome"
                    className="rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-teal-500 dark:border-slate-800"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="register-email" className="text-[11px] font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                    Email
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="nome@exemplo.com"
                    className="rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-teal-500 dark:border-slate-800"
                    required />

                  Senha
                  <Input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-teal-500 dark:border-slate-800"
                    required
                    minLength={6} />

                  Confirmar Senha
                  <Input id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita sua senha"
                    className="rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-teal-500 dark:border-slate-800"
                    required
                    minLength={6} />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Criar Conta
                    </Button>
                  </form>

                  <p className="text-xs text-center text-muted-foreground">
                    Ao criar uma conta, você receberá um email de confirmação.
                  </p>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
