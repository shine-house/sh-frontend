import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthDialogProps {
  trigger: React.ReactNode;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ trigger }) => {
  const { login, register } = useAuth();
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(loginEmail, loginPassword);
      setIsOpen(false);
    } catch (err: any) {
      setError(err?.message || "E-mail ou senha inválidos. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (registerPassword !== confirmPassword) {
      setError("As senhas informadas não correspondem.");
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

  // Componente de Erro Customizado e Elegante
  const ErrorAlert = () => (
    error ? (
      <Alert
        variant="destructive"
        className="rounded-xl py-2.5 px-3.5 border-rose-100 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-900/30 text-rose-900 dark:text-rose-200 animate-in fade-in-50 slide-in-from-top-1 duration-200"
      >
        <div className="flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <AlertDescription className="text-xs font-semibold tracking-tight leading-none text-rose-700 dark:text-rose-300">
            {error}
          </AlertDescription>
        </div>
      </Alert>
    ) : null
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); setError(null); }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] rounded-2xl p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl gap-0 animate-in fade-in-50 zoom-in-95">

        {/* Cabeçalho do Modal Reestilizado */}
        <DialogHeader className="space-y-1.5 pt-2 pb-4 text-center">
          <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 text-center">
            Acesse sua conta [TESTE DIALOG]
          </DialogTitle>
        </DialogHeader>

        {/* Seletores de Abas em Estilo Pílula Minimalista */}
        <Tabs defaultValue="login" className="w-full" onValueChange={() => setError(null)}>
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
            <ErrorAlert />

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
                className="w-full bg-teal-600 hover:bg-teal-500 text-white dark:bg-teal-600 dark:hover:bg-teal-700 rounded-xl h-10 text-xs font-semibold mt-2 transition-transform active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                Entrar
              </Button>
            </form>
          </TabsContent>

          {/* CONTEÚDO: ABA DE CADASTRO */}
          <TabsContent value="register" className="space-y-4 pt-1 focus-visible:outline-none focus-visible:ring-0">
            <ErrorAlert />

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
                  placeholder="••••••••"
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
                  placeholder="••••••••"
                  className="rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-teal-500 dark:border-slate-800"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-500 text-white dark:bg-teal-600 dark:hover:bg-teal-700 rounded-xl h-10 text-xs font-semibold mt-2 transition-transform active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                Cadastrar
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;

