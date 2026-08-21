
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight, Home, Clock, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


// const OnboardingSteps = [
//   {
//     title: "Bem-vindo ao Shine House",
//     description: "Vamos organizar sua casa seguindo o método FlyLady, sem estresse e com resultados reais!",
//     content: (
//       <div className="space-y-4 mt-2">
//         <p className="text-muted-foreground">
//           O método FlyLady ajuda você a organizar sua casa com pequenas tarefas diárias e semanais, tornando a limpeza mais fácil e menos estressante.
//         </p>
//         <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
//           <CheckCircle2 className="h-8 w-8 text-shine-teal" />
//           <div>
//             <p className="font-medium">Pequenos passos</p>
//             <p className="text-sm text-muted-foreground">Trabalhe por 15 minutos de cada vez, sem tentar fazer tudo de uma vez. Feito, é melhor que perfeito!</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
//           <Home className="h-8 w-8 text-shine-teal" />
//           <div>
//             <p className="font-medium">Zonas da casa</p>
//             <p className="text-sm text-muted-foreground">Foco em uma área por semana</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
//           <Clock className="h-8 w-8 text-shine-teal" />
//           <div>
//             <p className="font-medium">Rotinas simples e customizáveis</p>
//             <p className="text-sm text-muted-foreground">Tarefas diárias e semanais consistentes</p>
//           </div>
//         </div>
//       </div>
//     )
//   },
//   {
//     title: "Como funciona",
//     description: "O Shine House organiza as tarefas em três categorias:",
//     content: (
//       <div className="space-y-4 mt-2">
//         <Tabs defaultValue="daily">
//           <TabsList className="grid grid-cols-3">
//             <TabsTrigger value="daily">Diárias</TabsTrigger>
//             <TabsTrigger value="weekly">Semanais</TabsTrigger>
//             <TabsTrigger value="zone">Zonas</TabsTrigger>
//           </TabsList>
//           <TabsContent value="daily" className="space-y-2 mt-2">
//             <div className="bg-muted/50 p-3 rounded-lg">
//               <p className="font-medium">Rotina diária</p>
//               <p className="text-sm text-muted-foreground">Pequenas tarefas para fazer todos os dias, como arrumar a cama e lavar a louça.</p>
//             </div>
//             <ul className="space-y-2">
//               <li className="flex items-center gap-2 text-sm">
//                 <CheckCircle2 className="h-4 w-4 text-shine-teal" /> Arrumar a cama
//               </li>
//               <li className="flex items-center gap-2 text-sm">
//                 <CheckCircle2 className="h-4 w-4 text-shine-teal" /> Lavar a louça
//               </li>
//               <li className="flex items-center gap-2 text-sm">
//                 <CheckCircle2 className="h-4 w-4 text-shine-teal" /> Limpar a pia do banheiro
//               </li>
//             </ul>
//           </TabsContent>
//           <TabsContent value="weekly" className="space-y-2 mt-2">
//             <div className="bg-muted/50 p-3 rounded-lg">
//               <p className="font-medium">Tarefas semanais</p>
//               <p className="text-sm text-muted-foreground">Tarefas para fazer uma vez por semana em toda a casa.</p>
//             </div>
//             <ul className="space-y-2">
//               <li className="flex items-center gap-2 text-sm">
//                 <CheckCircle2 className="h-4 w-4 text-shine-teal" /> Limpar os armários
//               </li>
//               <li className="flex items-center gap-2 text-sm">
//                 <CheckCircle2 className="h-4 w-4 text-shine-teal" /> Lavar roupas de cama
//               </li>
//               <li className="flex items-center gap-2 text-sm">
//                 <CheckCircle2 className="h-4 w-4 text-shine-teal" /> Limpar vidros
//               </li>
//             </ul>
//           </TabsContent>
//           <TabsContent value="zone" className="space-y-2 mt-2">
//             <div className="bg-muted/50 p-3 rounded-lg">
//               <p className="font-medium">Zonas da casa</p>
//               <p className="text-sm text-muted-foreground">Cada semana focamos em uma zona específica da casa para uma limpeza mais profunda.</p>
//             </div>
//             <ul className="space-y-2">
//               <li className="flex items-center gap-2 text-sm">
//                 <CheckCircle2 className="h-4 w-4 text-shine-teal" /> Cozinha: limpar fogão, geladeira
//               </li>
//               <li className="flex items-center gap-2 text-sm">
//                 <CheckCircle2 className="h-4 w-4 text-shine-teal" /> Sala: aspirar sofá, limpar prateleiras
//               </li>
//               <li className="flex items-center gap-2 text-sm">
//                 <CheckCircle2 className="h-4 w-4 text-shine-teal" /> Quarto: organizar gavetas, limpar embaixo da cama
//               </li>
//             </ul>
//           </TabsContent>
//         </Tabs>
//       </div>
//     )
//   },
//   {
//     title: "Vamos começar!",
//     description: "O Shine House já preparou uma lista inicial baseada nas zonas comuns de uma casa.",
//     content: (
//       <div className="space-y-4 mt-2">
//         <p className="text-muted-foreground">
//           Você pode personalizar tudo após este tutorial:
//         </p>
//         <div className="grid grid-cols-2 gap-2">
//           <div className="bg-muted/50 p-3 rounded-lg">
//             <p className="font-medium">Cozinha</p>
//             <p className="text-xs text-muted-foreground mt-1">2 tarefas de zona</p>
//           </div>
//           <div className="bg-muted/50 p-3 rounded-lg">
//             <p className="font-medium">Sala</p>
//             <p className="text-xs text-muted-foreground mt-1">2 tarefas de zona</p>
//           </div>
//           <div className="bg-muted/50 p-3 rounded-lg">
//             <p className="font-medium">Quarto</p>
//             <p className="text-xs text-muted-foreground mt-1">2 tarefas de zona</p>
//           </div>
//           <div className="bg-muted/50 p-3 rounded-lg">
//             <p className="font-medium">Banheiro</p>
//             <p className="text-xs text-muted-foreground mt-1">2 tarefas de zona</p>
//           </div>
//         </div>
//         <div className="bg-muted/50 p-3 rounded-lg">
//           <p className="font-medium">Mais 3 tarefas diárias</p>
//           <p className="text-sm text-muted-foreground">Para manter sua casa organizada todos os dias</p>
//         </div>
//         <div className="bg-muted/50 p-3 rounded-lg">
//           <p className="font-medium">Mais 3 tarefas semanais</p>
//           <p className="text-sm text-muted-foreground">Para manter sua casa limpa toda semana</p>
//         </div>
//       </div>
//     )
//   }
// ];
const OnboardingSteps = [
  {
    title: "Bem-vindo ao Shine House",
    description: "Vamos organizar sua casa seguindo um método customizável, que funcione para você!",
    content: (
      <div className="space-y-3.5 mt-3 animate-in fade-in-50 duration-300">
        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Vamos te ajudar a organizar sua casa com pequenas tarefas diárias e semanais, tornando a manutenção doméstica menos cansativa, fazendo um pouco por vez.
        </p>

        {/* Bloco 1 */}
        <div className="flex items-start gap-3.5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-3.5 rounded-xl shadow-sm">
          <div className="p-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl shrink-0 mt-0.5">
            <CheckCircle2 className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">Pequenos passos</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">Trabalhe por 15 minutos de cada vez, sem tentar fazer tudo de uma vez. Feito é melhor que perfeito! Mas tente cumprir todas as tarefas no prazo determinado!</p>
          </div>
        </div>

        {/* Bloco 2 */}
        <div className="flex items-start gap-3.5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-3.5 rounded-xl shadow-sm">
          <div className="p-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl shrink-0 mt-0.5">
            <Home className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">Zonas da casa</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">Foco total em apenas uma área específica por semana para evitar apenas um dia pro faxinão.</p>
          </div>
        </div>

        {/* Bloco 3 */}
        <div className="flex items-start gap-3.5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-3.5 rounded-xl shadow-sm">
          <div className="p-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl shrink-0 mt-0.5">
            <Clock className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">Rotinas simples e customizáveis</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">Construa hábitos diários e semanais consistentes que se encaixam na sua rotina.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Como funciona",
    description: "O Shine House organiza as tarefas em três categorias:",
    content: (
      <div className="space-y-4 mt-3 animate-in fade-in-50 duration-300">
        <Tabs defaultValue="daily" className="w-full">
          {/* Menu de Abas Interno */}
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-950 rounded-xl p-1 h-10 border border-slate-200/20 dark:border-slate-800/40">
            <TabsTrigger value="daily" className="rounded-lg text-xs font-semibold tracking-tight data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
              Diárias
            </TabsTrigger>
            <TabsTrigger value="weekly" className="rounded-lg text-xs font-semibold tracking-tight data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
              Semanais
            </TabsTrigger>
            <TabsTrigger value="zone" className="rounded-lg text-xs font-semibold tracking-tight data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
              Zonas
            </TabsTrigger>
          </TabsList>

          {/* Conteúdo Aba Diárias */}
          <TabsContent value="daily" className="space-y-3.5 mt-3 focus-visible:outline-none focus-visible:ring-0">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-3.5 rounded-xl shadow-sm">
              <p className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">Rotina diária</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">Pequenas tarefas rápidas para fazer todos os dias, como arrumar a cama e manter a pia limpa.</p>
            </div>
            <ul className="space-y-2.5 pl-1.5">
              <li className="flex items-center gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" /> Arrumar a cama ao levantar
              </li>
              <li className="flex items-center gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" /> Lavar e guardar a louça das refeições
              </li>
              <li className="flex items-center gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" /> Passar um pano rápido na pia do banheiro
              </li>
            </ul>
          </TabsContent>

          {/* Conteúdo Aba Semanais */}
          <TabsContent value="weekly" className="space-y-3.5 mt-3 focus-visible:outline-none focus-visible:ring-0">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-3.5 rounded-xl shadow-sm">
              <p className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">Tarefas semanais</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">Tarefas mais amplas focadas na manutenção geral da casa, realizadas apenas uma vez por semana.</p>
            </div>
            <ul className="space-y-2.5 pl-1.5">
              <li className="flex items-center gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" /> Organizar e limpar superfícies dos armários
              </li>
              <li className="flex items-center gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" /> Trocar e lavar as roupas de cama e banho
              </li>
              <li className="flex items-center gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" /> Limpar poeira de vidros e espelhos principais
              </li>
            </ul>
          </TabsContent>

          {/* Conteúdo Aba Zonas */}
          <TabsContent value="zone" className="space-y-3.5 mt-3 focus-visible:outline-none focus-visible:ring-0">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-3.5 rounded-xl shadow-sm">
              <p className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">Zonas da casa</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">Cada semana focamos em uma região isolada para fazer uma limpeza detalhada, sem pressa.</p>
            </div>
            <ul className="space-y-2.5 pl-1.5">
              <li className="flex items-center gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" /> <span className="font-semibold">Cozinha:</span> Limpar interior do fogão e geladeira
              </li>
              <li className="flex items-center gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" /> <span className="font-semibold">Sala:</span> Aspirar estofados do sofá e espanar prateleiras
              </li>
              <li className="flex items-center gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" /> <span className="font-semibold">Quarto:</span> Organizar gavetas internas e limpar sob o estrado
              </li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    )
  },
  {
    title: "Vamos começar!",
    description: "O Shine House já preparou uma lista inicial baseada nas zonas comuns de uma casa.",
    content: (
      <div className="space-y-4 mt-3 animate-in fade-in-50 duration-300">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Você pode personalizar tudo após este tutorial:
        </p>

        {/* Grid de Cômodos Predefinidos */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-3 rounded-xl shadow-sm">
            <p className="text-xs font-bold tracking-tight text-slate-800 dark:text-slate-200">Cozinha</p>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">2 tarefas de zona</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-3 rounded-xl shadow-sm">
            <p className="text-xs font-bold tracking-tight text-slate-800 dark:text-slate-200">Sala</p>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">2 tarefas de zona</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-3 rounded-xl shadow-sm">
            <p className="text-xs font-bold tracking-tight text-slate-800 dark:text-slate-200">Quarto</p>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">2 tarefas de zona</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-3 rounded-xl shadow-sm">
            <p className="text-xs font-bold tracking-tight text-slate-800 dark:text-slate-200">Banheiro</p>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">2 tarefas de zona</p>
          </div>
        </div>

        {/* Sumário Inferior de Tarefas */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-3 rounded-xl shadow-sm">
          <div className="p-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-lg">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Mais 3 tarefas diárias</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Para manter sua casa organizada todos os dias</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-3 rounded-xl shadow-sm">
          <div className="p-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-lg">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Mais 3 tarefas semanais</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Para manter sua casa limpa toda semana</p>
          </div>
        </div>
      </div>
    )
  }

];

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = OnboardingSteps[currentStep];

  const handleNext = () => {
    if (currentStep < OnboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in transition-colors duration-300">
      <Card className="w-full max-w-md mx-auto border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl transition-all duration-300">
        <CardHeader className="space-y-1.5 pt-6 pb-2 px-6">
          <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {step.title}
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            {step.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-2">
          {step.content}
        </CardContent>

        <CardFooter className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-4 px-6 pb-6">
          {currentStep === 0 ? (
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="rounded-xl h-9 text-xs font-semibold px-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Pular
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="rounded-xl border-slate-200 dark:border-slate-800 h-9 text-xs font-semibold px-4"
            >
              Voltar
            </Button>
          )}

          <Button
            onClick={handleNext}
            className="shine-gradient rounded-xl h-9 text-xs font-semibold px-5 transition-transform active:scale-[0.98]"
          >
            {currentStep === OnboardingSteps.length - 1 ? "Começar" : "Próximo"}
            <ChevronRight className="ml-1 h-3.5 w-3.5 stroke-[2.2]" />
          </Button>
        </CardFooter>
      </Card>
    </div>

  );
};

export default Onboarding;
