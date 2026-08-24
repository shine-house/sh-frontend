
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface AuthDialogProps {
  trigger: React.ReactNode;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ trigger }) => {
  const { login, register } = useAuth();
  // const { login, register, loginWithGoogle } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setError(null);
    setIsLoading(true);

    try {
      await login(loginEmail, loginPassword);
      setIsOpen(false);
    } catch (err: any) {
      setError(err?.message || "Falha no login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setError(null);

    // Validation
    if (registerPassword !== confirmPassword) {
      setError("As senhas não correspondem");
      return;
    }

    setIsLoading(true);

    try {
      await register(registerEmail, registerPassword, registerName);
      setIsOpen(false);
    } catch (err) {
      setError("Falha no registro. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // await loginWithGoogle();
      setIsOpen(false);
    } catch (err) {
      setError("Falha no login com Google. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] rounded-2xl p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl gap-0 animate-in fade-in-50 zoom-in-95">

        {/* Cabeçalho do Modal Reestilizado */}
        <DialogHeader className="space-y-1.5 pt-2 pb-4 text-center">
          <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 text-center">
            Acesse sua conta
          </DialogTitle>
        </DialogHeader>

        {/* Seletores de Abas em Estilo Pílula Minimalista */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-950 rounded-xl p-1 mb-4 h-10 border border-slate-200/20 dark:border-slate-800/40">
            <TabsTrigger value="login" className="rounded-lg text-xs font-semibold tracking-tight data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-50 data-[state=active]:shadow-sm transition-all">
              Entrar
            </TabsTrigger>
            <TabsTrigger value="register" className="rounded-lg text-xs font-semibold tracking-tight data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-50 data-[state=active]:shadow-sm transition-all">
              Cadastrar
            </TabsTrigger>
          </TabsList>

          {/* CONTEÚDO: ABA DE LOGIN */}
          <TabsContent value="login" className="space-y-4 pt-1 focus-visible:outline-none focus-visible:ring-0">
            {error && (
              <Alert variant="destructive" className="rounded-xl py-2.5">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="text-[11px] font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  Email
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
                <Label htmlFor="login-password" className="text-[11px] font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  Senha
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
                className="w-full shine-gradient rounded-xl h-10 text-xs font-semibold mt-2 transition-transform active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                Entrar
              </Button>
            </form>

            {/* Linha Divisória de Autenticação Social */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-semibold">
                <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 dark:text-slate-500">
                  Ou continue com
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full rounded-xl h-10 text-xs font-semibold border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-50 flex items-center justify-center"
              onClick={handleGoogleLogin}
              disabled={true}
            >
              <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4 shrink-0">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </TabsContent>

          {/* CONTEÚDO: ABA DE CADASTRO */}
          <TabsContent value="register" className="space-y-4 pt-1 focus-visible:outline-none focus-visible:ring-0">
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
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="register-password" className="text-[11px] font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  Senha
                </Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-teal-500 dark:border-slate-800"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="text-[11px] font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  Confirmar Senha
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita sua senha"
                  className="rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-teal-500 dark:border-slate-800"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full shine-gradient rounded-xl h-10 text-xs font-semibold mt-4 transition-transform active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                Cadastrar
              </Button>
            </form>

            {/* Linha Divisória de Autenticação Social no Cadastro */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-semibold">

                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou continue com
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={true}
            // disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
