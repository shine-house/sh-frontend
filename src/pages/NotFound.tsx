import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle, ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-50/50 dark:bg-slate-950 overflow-hidden transition-colors duration-300 select-none">
      {/* Detalhes de luz de fundo difusa do ecossistema */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 dark:bg-teal-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-slate-400/10 dark:bg-slate-800/10 blur-3xl pointer-events-none" />

      {/* Caixa centralizada de Erro com Estilo SaaS Premium */}
      <div className="text-center max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-xl z-10 transition-all duration-300 animate-in fade-in-50 zoom-in-95">

        {/* Bloco do Ícone de Erro */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-4 animate-bounce [animation-duration:3s]">
          <HelpCircle className="h-6 w-6 stroke-[2.2]" />
        </div>

        {/* Textos Informativos */}
        <div className="space-y-1.5 mb-6">
          <h1 className="text-4xl font-extrabold tracking-tighter bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-slate-50 dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Página não encontrada
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed px-4">
            Parece que essa zona sumiu do mapa ou o link digitado está incorreto. Vamos voltar para as rotinas?
          </p>
        </div>

        {/* Ação de retorno usando a tag de Link nativa do ecossistema para evitar refresh de tela */}
        <Link to="/">
          <Button
            className="w-full rounded-xl h-10 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar para o Início
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
