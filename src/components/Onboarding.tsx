
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, ChevronRight, Home, Clock } from "lucide-react";

const OnboardingSteps = [
  {
    title: "Bem-vindo ao Shine House",
    description: "Vamos organizar sua casa seguindo o método FlyLady, sem estresse e com resultados reais!",
    content: (
      <div className="space-y-4 mt-2">
        <p className="text-muted-foreground">
          O método FlyLady ajuda você a organizar sua casa com pequenas tarefas diárias e semanais, tornando a limpeza mais fácil e menos estressante.
        </p>
        <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
          <CheckCircle2 className="h-8 w-8 text-shine-teal" />
          <div>
            <p className="font-medium">Pequenos passos</p>
            <p className="text-sm text-muted-foreground">Trabalhe por 15 minutos de cada vez, sem tentar fazer tudo de uma vez. Feito, é melhor que perfeito!</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
          <Home className="h-8 w-8 text-shine-teal" />
          <div>
            <p className="font-medium">Zonas da casa</p>
            <p className="text-sm text-muted-foreground">Foco em uma área por semana</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
          <Clock className="h-8 w-8 text-shine-teal" />
          <div>
            <p className="font-medium">Rotinas simples e customizáveis</p>
            <p className="text-sm text-muted-foreground">Tarefas diárias e semanais consistentes</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Como funciona",
    description: "O Shine House organiza as tarefas em três categorias:",
    content: (
      <div className="space-y-4 mt-2">
        <Tabs defaultValue="daily">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="daily">Diárias</TabsTrigger>
            <TabsTrigger value="weekly">Semanais</TabsTrigger>
            <TabsTrigger value="zone">Zonas</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="space-y-2 mt-2">
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="font-medium">Rotina diária</p>
              <p className="text-sm text-muted-foreground">Pequenas tarefas para fazer todos os dias, como arrumar a cama e lavar a louça.</p>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-shine-teal" /> Arrumar a cama
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-shine-teal" /> Lavar a louça
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-shine-teal" /> Limpar a pia do banheiro
              </li>
            </ul>
          </TabsContent>
          <TabsContent value="weekly" className="space-y-2 mt-2">
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="font-medium">Tarefas semanais</p>
              <p className="text-sm text-muted-foreground">Tarefas para fazer uma vez por semana em toda a casa.</p>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-shine-teal" /> Limpar os armários
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-shine-teal" /> Lavar roupas de cama
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-shine-teal" /> Limpar vidros
              </li>
            </ul>
          </TabsContent>
          <TabsContent value="zone" className="space-y-2 mt-2">
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="font-medium">Zonas da casa</p>
              <p className="text-sm text-muted-foreground">Cada semana focamos em uma zona específica da casa para uma limpeza mais profunda.</p>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-shine-teal" /> Cozinha: limpar fogão, geladeira
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-shine-teal" /> Sala: aspirar sofá, limpar prateleiras
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-shine-teal" /> Quarto: organizar gavetas, limpar embaixo da cama
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
      <div className="space-y-4 mt-2">
        <p className="text-muted-foreground">
          Você pode personalizar tudo após este tutorial:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="font-medium">Cozinha</p>
            <p className="text-xs text-muted-foreground mt-1">2 tarefas de zona</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="font-medium">Sala</p>
            <p className="text-xs text-muted-foreground mt-1">2 tarefas de zona</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="font-medium">Quarto</p>
            <p className="text-xs text-muted-foreground mt-1">2 tarefas de zona</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="font-medium">Banheiro</p>
            <p className="text-xs text-muted-foreground mt-1">2 tarefas de zona</p>
          </div>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="font-medium">Mais 3 tarefas diárias</p>
          <p className="text-sm text-muted-foreground">Para manter sua casa organizada todos os dias</p>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="font-medium">Mais 3 tarefas semanais</p>
          <p className="text-sm text-muted-foreground">Para manter sua casa limpa toda semana</p>
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
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">{step.title}</CardTitle>
          <CardDescription>{step.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {step.content}
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentStep === 0 ? (
            <Button variant="ghost" onClick={handleSkip}>Pular</Button>
          ) : (
            <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>Voltar</Button>
          )}
          <Button
            onClick={handleNext}
            className="shine-gradient"
          >
            {currentStep === OnboardingSteps.length - 1 ? "Começar" : "Próximo"}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Onboarding;
