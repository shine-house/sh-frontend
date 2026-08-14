import React, { useState, useEffect, useCallback } from "react";
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
import * as householdsApi from "@/lib/api/households";
import type { MemberResponse } from "@/lib/api/types/user-types";
import type { PendingMemberResponse } from "@/lib/api/households";

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

  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [members, setMembers] = useState<MemberResponse[]>([]);
  const [pendingMembers, setPendingMembers] = useState<PendingMemberResponse[]>([]);
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [approvingUserId, setApprovingUserId] = useState<string | null>(null);

  const loadHouseholdData = useCallback(async () => {
    if (!activeHouseholdId) return;
    try {
      const [inviteRes, membersRes, pendingRes] = await Promise.all([
        householdsApi.getInviteCode(activeHouseholdId),
        householdsApi.listMembers(activeHouseholdId),
        householdsApi.listPendingMembers(activeHouseholdId),
      ]);
      setInviteCode(inviteRes.invite_code);
      setMembers(membersRes.members);
      setPendingMembers(pendingRes.items);
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

  // Poll for pending join requests while the dialog is open
  useEffect(() => {
    if (open && activeHouseholdId) {
      const interval = setInterval(loadHouseholdData, 5000);
      return () => clearInterval(interval);
    }
  }, [open, activeHouseholdId, loadHouseholdData]);

  const handleApproveUser = async (userId: string) => {
    if (!activeHouseholdId) return;
    setApprovingUserId(userId);
    try {
      await householdsApi.approvePendingMember(activeHouseholdId, userId);
      toast.success("Usuário aprovado com sucesso!");
      await loadHouseholdData();
    } catch (err) {
      console.error("Erro ao aprovar usuário:", err);
      toast.error("Erro ao aprovar usuário");
    } finally {
      setApprovingUserId(null);
    }
  };

  const handleRejectUser = async (userId: string) => {
    if (!activeHouseholdId) return;
    setApprovingUserId(userId);
    try {
      await householdsApi.rejectPendingMember(activeHouseholdId, userId);
      toast.success("Solicitação rejeitada");
      await loadHouseholdData();
    } catch (err) {
      console.error("Erro ao rejeitar usuário:", err);
      toast.error("Erro ao rejeitar solicitação");
    } finally {
      setApprovingUserId(null);
    }
  };

  const handleCopyCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      toast.success("Código copiado para a área de transferência!");
    }
  };

  const handleRegenerateCode = async () => {
    if (!activeHouseholdId) return;
    setIsLoading(true);
    try {
      const res = await householdsApi.regenerateInviteCode(activeHouseholdId);
      setInviteCode(res.invite_code);
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
      const result = await householdsApi.joinHouseholdByInviteCode(joinCode.trim());
      if (result.status === "pending") {
        toast.success("Solicitação enviada! Aguarde a aprovação do dono da residência.");
      } else {
        toast.success("Você entrou na residência compartilhada!");
      }
      onOpenChange(false);
    } catch (err) {
      console.error("Erro ao entrar na residência:", err);
      setError(`Não foi possível entrar: ${getErrorMessage(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!activeHouseholdId) return;
    if (!confirm("Tem certeza que deseja remover este usuário?")) return;

    try {
      await householdsApi.removeMember(activeHouseholdId, userId);
      setMembers((prev) => prev.filter((m) => m.user_id !== userId));
      toast.success("Usuário removido com sucesso");
    } catch (err) {
      console.error("Erro ao remover usuário:", err);
      toast.error("Erro ao remover usuário");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
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

            {pendingMembers.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <p className="text-sm font-medium">Solicitações pendentes</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  {pendingMembers.map((pending) => (
                    <div key={pending.user_id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-orange-50">
                          {pending.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground">aguardando aprovação</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600 hover:text-green-700"
                          onClick={() => handleApproveUser(pending.user_id)}
                          disabled={approvingUserId === pending.user_id}
                        >
                          {approvingUserId === pending.user_id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={() => handleRejectUser(pending.user_id)}
                          disabled={approvingUserId === pending.user_id}
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {members.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Pessoas conectadas</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  {members.map((member) => (
                    <div key={member.user_id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-shine-teal/10">
                          {member.user_id === user?.id ? user?.name ?? "Você" : member.user_id}
                        </Badge>
                        {member.user_id === user?.id && (
                          <span className="text-xs text-muted-foreground">(Você)</span>
                        )}
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