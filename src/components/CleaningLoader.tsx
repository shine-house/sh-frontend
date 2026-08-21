import React, { useState, useEffect } from "react";
import { Home, Sparkles, CheckCircle2 } from "lucide-react";

interface CleaningLoaderProps {
  message?: string; // Permite passar uma mensagem customizada se necessário
}

const CleaningLoader: React.FC<CleaningLoaderProps> = ({ message }) => {
  const defaultPhrases = [
    "Espanando a poeira do servidor...",
    "Deixando a pia brilhando em 15 minutos...",
    "São só 15 minutinhos...",
    "Organizando os cômodos em zonas...",
    "Dizendo adeus ao caos doméstico...",
    "Feito é melhor que perfeito!"
  ];

  const [currentPhrase, setCurrentPhrase] = useState(message || defaultPhrases[0]);

  // Rotaciona as frases divertidas se o carregamento demorar e nenhuma mensagem fixa for passada
  useEffect(() => {
    if (message) {
      setCurrentPhrase(message);
      return;
    }

    const interval = setInterval(() => {
      setCurrentPhrase((prev) => {
        const currentIndex = defaultPhrases.indexOf(prev);
        const nextIndex = (currentIndex + 1) % defaultPhrases.length;
        return defaultPhrases[nextIndex];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [message]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-6 bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300 z-50 select-none">

      {/* Wrapper Central da Animação */}
      <div className="relative flex items-center justify-center h-28 w-28 mb-6">

        {/* Círculo Pulsante Traseiro */}
        <div className="absolute inset-0 bg-teal-500/10 dark:bg-teal-500/5 rounded-full animate-ping opacity-60" />

        {/* Círculo Rotativo Frontal com Linha Tracejada */}
        <div className="absolute inset-0 border-2 border-dashed border-teal-500/40 dark:border-teal-500/20 rounded-full animate-spin [animation-duration:8s]" />

        {/* Ícone de Casa Central com Brilhos */}
        <div className="relative p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-md text-teal-600 dark:text-teal-400">
          <Home className="h-8 w-8 stroke-[2.2]" />
          <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-amber-400 animate-pulse" />
        </div>

        {/* Micro-ícone de confirmação flutuando na borda do card */}
        <div className="absolute -bottom-1 -left-1 p-1.5 bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 rounded-lg text-slate-400 shadow-sm animate-bounce [animation-duration:2s]">
          <CheckCircle2 className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Textos Informativos */}
      <div className="text-center space-y-1.5 max-w-xs">
        <h3 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1.5">
          <Sparkles className="h-4 w-4 text-amber-400 animate-spin [animation-duration:4s]" />
          Shine House
        </h3>

        {/* Frase dinâmica ou customizada com efeito fade sutil */}
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 tracking-wide min-h-[16px] animate-in fade-in duration-300">
          {currentPhrase}
        </p>
      </div>
    </div>
  );
};

export default CleaningLoader;
