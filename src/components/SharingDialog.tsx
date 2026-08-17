import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useHousehold } from "@/hooks/useHousehold";
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
import { AlertCircle, Copy, Loader2, Users, Trash, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { createShareApi } from "@/lib/api/sharing";
// import type { PendingMemberResponse } from "@/lib/api/households";

interface SharingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Erro desconhecido";

const SharingDialog: React.FC<SharingDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { user, isAuthenticated, activeHouseholdId } = useAuth();
  const queryClient = useQueryClient();
  const { members, refetchMembers } = useHousehold();
  const currentMemberRole = members.find((member) => member.user_id === user?.id)?.role;

  const updateActiveHousehold = useCallback((householdId: string | null) => {
    queryClient.setQueryData(["auth", "me"], (prev: { user?: typeof user; active_household_id?: string | null } | undefined) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        active_household_id: householdId,
      };
    });

    if (householdId) {
      localStorage.setItem("sh_active_household", householdId);
      return;
    }

    localStorage.removeItem("sh_active_household");
  }, [queryClient, user]);

  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const shareApi = useMemo(
      () => (activeHouseholdId ? createShareApi(activeHouseholdId) : null),
      [activeHouseholdId]
    );
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadHouseholdData = useCallback(async () => {

    if (!activeHouseholdId || !shareApi ) return;

    try {
      const [inviteRes] = await Promise.all([
        shareApi.getInviteCode(),
      ]);
      setInviteCode(inviteRes.active_invite.invite_key);
      await refetchMembers();
      console.log("-------  ",members," =======")
    } catch (err) {
      console.error("Erro ao carregar dados da residência:", err);
    }
  }, [activeHouseholdId]);

  useEffect(() => {
    if (open) {
      setJoinCode("");
      setError(null);
      loadHouseholdData();
    }
  }, [open, loadHouseholdData]);


  // TODO: Criar handle de  revoke de compartilhamento

  // const handleRejectUser = async (userId: string) => {
  //   if (!activeHouseholdId) return;
  //   setApprovingUserId(userId);
  //   try {
  //     await householdsApi.rejectPendingMember(activeHouseholdId, userId);
  //     toast.success("Solicitação rejeitada");
  //     await loadHouseholdData();
  //   } catch (err) {
  //     console.error("Erro ao rejeitar usuário:", err);
  //     toast.error("Erro ao rejeitar solicitação");
  //   } finally {
  //     setApprovingUserId(null);
  //   }
  // };

  const handleCopyCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      toast.success("Código copiado para a área de transferência!");
    }
  };

  const handleRegenerateCode = async () => {
    if (!activeHouseholdId || !shareApi ) return;
    setIsLoading(true);
    try {
      const res = await shareApi.getNewInviteCode();
      setInviteCode(res.invite_key);
      toast.success("Novo código gerado!");
    } catch (err) {
      console.error("Erro ao gerar novo código:", err);
      toast.error("Erro ao gerar novo código");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinHousehold = async () => {
    if (!joinCode.trim()) {
      setError("Digite um código de convite");
      return;
    }

    if (inviteCode && joinCode.trim() === inviteCode) {
      setError("Você não pode entrar na sua própria residência");
      return;
    }

    if (!isAuthenticated) {
      setError("Você precisa estar logado para entrar em uma residência compartilhada");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      if (!shareApi ) return;

      const result = await shareApi.joinHouseholdByInviteCode(joinCode.trim());
      updateActiveHousehold(result.household_id);
      await queryClient.invalidateQueries({ queryKey: ["household"] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      await refetchMembers();
      toast.success(result.message);

      onOpenChange(false);
    } catch (err) {
      console.error("Erro ao entrar na residência:", err);
      setError(`Não foi possível entrar: ${getErrorMessage(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveHouse = async () => {
    if (!activeHouseholdId || !shareApi ) return;
    if (!confirm("Tem certeza que deseja sair desta casa?")) return;

    try {
      await shareApi.leaveHousehold();
      updateActiveHousehold(null);
      await queryClient.invalidateQueries({ queryKey: ["household"] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      await refetchMembers();
      toast.success("Você saiu da residência com sucesso");
    } catch (err) {
      console.error("Erro ao sair da residência:", err);
      toast.error("Erro ao sair da residência:");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!activeHouseholdId || !shareApi ) return;
    if (!confirm("Tem certeza que deseja removber esse usuário?")) return;

    try {
      await shareApi.removeMember(userId);
      await queryClient.invalidateQueries({ queryKey: ["household"] });
      await refetchMembers();
      toast.success("Usuário removido com sucesso");
    } catch (err) {
      console.error("Erro ao remover usuário:", err);
      toast.error("Erro ao remover usuário");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-107">
        <DialogHeader>
          <DialogTitle>Compartilhamento</DialogTitle>
          <DialogDescription>
            Compartilhe sua residência com outras pessoas
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

        <Tabs defaultValue="my-household">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-household">Minha Residência</TabsTrigger>
            <TabsTrigger value="join">Entrar</TabsTrigger>
          </TabsList>

          <TabsContent value="my-household" className="space-y-4 pt-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <p className="text-sm">
              Compartilhe o código abaixo para convidar outras pessoas para sua residência:
            </p>

            <div className="flex space-x-2">
              <Input value={inviteCode || ""} readOnly />
              <Button size="icon" variant="outline" onClick={handleCopyCode} disabled={!inviteCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerateCode}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Gerar novo código
            </Button>

            {members.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Pessoas conectadas</p>
                  </div>
                  {currentMemberRole && currentMemberRole !== "owner" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={handleLeaveHouse}
                    >
                      Sair da residência
                    </Button>
                  )}
                </div>
                <Separator />
                <div className="space-y-2">
                  {members.map((member) => (

                    <div key={member.user_id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-shine-teal/10">
                          {member.user_id === user?.id ? user?.name ?? "Você" : member.name}
                        </Badge>
                        {member.role === "owner" && (
                          <span className="text-xs text-muted-foreground">(Dono)</span>
                        )}
                      </div>
                      {member.role !== "owner" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveMember(member.user_id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}

{/* TODO: ADICIONAR BOTÃO DE LEAVE HOUSEHOLD
                      {member.role !== "owner" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleLeaveHouse()}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                        */}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isAuthenticated && (
              <Alert className="mt-2">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Cada vez que alguém marca uma tarefa como concluída, isso será refletido para todos na residência.
                </AlertDescription>
              </Alert>
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
              Digite o código de convite que você recebeu:
            </p>

            <Input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Ex: shine-abc123"
            />

            <Button
              className="w-full shine-gradient"
              onClick={handleJoinHousehold}
              disabled={isLoading || !isAuthenticated}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar na Residência
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SharingDialog;