import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (registerPassword !== confirmPassword) {
      setError("As senhas não correspondem");
      return;
    }

    setIsLoading(true);

    try {
      await register(registerEmail, registerPassword, registerName);
      // Não redirecionar - usuário precisa confirmar email primeiro
    } catch (err: any) {
      setError(err.message || "Falha no registro. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-50/50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      {/* Detalhes decorativos de fundo translúcido */}
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
          <Tabs defaultValue="login" className="w-full">
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

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Criar Conta
                </Button>
              </form>

              <p className="text-xs text-center text-muted-foreground">
                Ao criar uma conta, você receberá um email de confirmação.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
