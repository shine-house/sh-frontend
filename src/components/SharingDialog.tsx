import React, { useState, useEffect } from "react";
import { useTask } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Copy, Loader2, Users, Trash, Info, UserCheck, UserX } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
// TODO: Remove supabase
import { getPendingApprovals, approveShareRequest, rejectShareRequest } from "@/lib/supabase";

interface SharingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SharingDialog: React.FC<SharingDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { user, isAuthenticated } = useAuth();
  const { 
    sharingKey, 
    isSharingEnabled, 
    enableSharing, 
    disableSharing, 
    loadSharedTasks,
    connectedUsers,
    removeConnectedUser
  } = useTask();
  
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [approvingUser, setApprovingUser] = useState<string | null>(null);
  
  useEffect(() => {
    if (open) {
      setJoinCode("");
      setError(null);
      loadPendingApprovals();
    }
  }, [open]);

  // Polling para atualizar solicitações pendentes
  useEffect(() => {
    if (open && isSharingEnabled && sharingKey) {
      const interval = setInterval(loadPendingApprovals, 5000);
      return () => clearInterval(interval);
    }
  }, [open, isSharingEnabled, sharingKey]);

  const loadPendingApprovals = async () => {
    if (!sharingKey || !isSharingEnabled) return;
    
    try {
      const pending = await getPendingApprovals(sharingKey);
      setPendingApprovals(pending);
    } catch (err) {
      console.error("Erro ao carregar solicitações pendentes:", err);
    }
  };

  const handleApproveUser = async (userId: string) => {
    if (!sharingKey) return;
    
    setApprovingUser(userId);
    try {
      const success = await approveShareRequest(sharingKey, userId);
      if (success) {
        toast.success("Usuário aprovado com sucesso!");
        await loadPendingApprovals();
      } else {
        toast.error("Erro ao aprovar usuário");
      }
    } catch (err) {
      console.error("Erro ao aprovar usuário:", err);
      toast.error("Erro ao aprovar usuário");
    } finally {
      setApprovingUser(null);
    }
  };

  const handleRejectUser = async (userId: string) => {
    if (!sharingKey) return;
    
    setApprovingUser(userId);
    try {
      const success = await rejectShareRequest(sharingKey, userId);
      if (success) {
        toast.success("Solicitação rejeitada");
        await loadPendingApprovals();
      } else {
        toast.error("Erro ao rejeitar solicitação");
      }
    } catch (err) {
      console.error("Erro ao rejeitar usuário:", err);
      toast.error("Erro ao rejeitar solicitação");
    } finally {
      setApprovingUser(null);
    }
  };
  
  const handleCopyCode = () => {
    if (sharingKey) {
      navigator.clipboard.writeText(sharingKey);
      toast.success("Código copiado para a área de transferência!");
    }
  };
  
  const handleJoinSharedList = async () => {
    if (!joinCode.trim()) {
      setError("Digite um código de compartilhamento");
      return;
    }
    
    if (sharingKey && joinCode.trim() === sharingKey) {
      setError("Você não pode entrar na sua própria lista");
      return;
    }
    
    if (!isAuthenticated) {
      setError("Você precisa estar logado para entrar em uma lista compartilhada");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      const success = await loadSharedTasks(joinCode);
      if (success) {
        toast.success("Solicitação enviada! Aguarde a aprovação do dono da lista.");
        onOpenChange(false);
      } else {
        setError("Código de compartilhamento inválido ou expirado");
      }
    } catch (err: any) {
      console.error("Erro ao carregar lista:", err);
      const errorMessage = err.message || 'Erro desconhecido';
      setError(`Não foi possível entrar na lista compartilhada: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = (userId: string) => {
    if (confirm("Tem certeza que deseja remover este usuário?")) {
      removeConnectedUser(userId);
    }
  };

  const handleEnableSharing = async () => {
    if (!isAuthenticated) {
      setError("Você precisa estar logado para compartilhar sua lista");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await enableSharing();
      toast.success("Compartilhamento ativado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao ativar compartilhamento:", err);
      const errorMessage = err.message || 'Erro desconhecido';
      setError(`Não foi possível ativar o compartilhamento: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Compartilhamento</DialogTitle>
          <DialogDescription>
            Compartilhe sua lista de tarefas com outras pessoas
          </DialogDescription>
        </DialogHeader>
        
        {!isAuthenticated && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Login necessário</AlertTitle>
            <AlertDescription>
              Você precisa estar logado para usar o compartilhamento entre dispositivos.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue={isSharingEnabled ? "my-list" : "join"}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-list">Minha Lista</TabsTrigger>
            <TabsTrigger value="join">Entrar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-list" className="space-y-4 pt-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {isSharingEnabled ? (
              <>
                <p className="text-sm">
                  Sua lista está sendo compartilhada. Compartilhe o código abaixo com até 3 pessoas:
                </p>
                
                <div className="flex space-x-2">
                  <Input value={sharingKey || ""} readOnly />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopyCode}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {pendingApprovals && pendingApprovals.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <p className="text-sm font-medium">Solicitações pendentes</p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      {pendingApprovals.map((approval) => (
                        <div key={approval.user_id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-orange-50">
                              {approval.name}
                            </Badge>
                            <span className="text-xs text-muted-foreground">aguardando aprovação</span>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-green-600 hover:text-green-700"
                              onClick={() => handleApproveUser(approval.user_id)}
                              disabled={approvingUser === approval.user_id}
                            >
                              {approvingUser === approval.user_id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <UserCheck className="h-4 w-4" />
                              )}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-600 hover:text-red-700"
                              onClick={() => handleRejectUser(approval.user_id)}
                              disabled={approvingUser === approval.user_id}
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {connectedUsers && connectedUsers.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">Pessoas conectadas</p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      {connectedUsers.map((connectedUser) => (
                        <div key={connectedUser.id} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-shine-teal/10">
                              {connectedUser.name}
                            </Badge>
                            {connectedUser.id === user?.id && (
                              <span className="text-xs text-muted-foreground">(Você)</span>
                            )}
                            {connectedUser.isOwner && (
                              <span className="text-xs text-muted-foreground">(Dono)</span>
                            )}
                          </div>
                          {!connectedUser.isOwner && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleRemoveUser(connectedUser.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={disableSharing}
                >
                  Desativar Compartilhamento
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm">
                  Compartilhe sua lista de tarefas com até 3 pessoas. Cada vez que alguém marca uma tarefa como concluída, isso será refletido para todos.
                </p>
                
                <Button 
                  className="w-full shine-gradient" 
                  onClick={handleEnableSharing}
                  disabled={isLoading || !isAuthenticated}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ativar Compartilhamento
                </Button>
                
                {isAuthenticated && (
                  <Alert className="mt-2">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Este processo pode levar alguns instantes na primeira vez, enquanto preparamos seu ambiente de compartilhamento.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="join" className="space-y-4 pt-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <p className="text-sm">
              Digite o código de compartilhamento que você recebeu:
            </p>
            
            <Input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Ex: shine-abc123"
            />
            
            <Button 
              className="w-full shine-gradient" 
              onClick={handleJoinSharedList}
              disabled={isLoading || !isAuthenticated}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar na Lista Compartilhada
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SharingDialog;
