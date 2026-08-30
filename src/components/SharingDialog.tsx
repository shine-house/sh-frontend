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
import { AlertCircle, Copy, Loader2, Users, Trash, Home} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createShareApi } from "@/lib/api/sharing";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { cn } from "@/lib/utils";

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
      return { ...prev, active_household_id: householdId };
    });
  }, [queryClient, user]);

  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const shareApi = useMemo(
    () => (activeHouseholdId ? createShareApi(activeHouseholdId) : null),
    [activeHouseholdId]
  );
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isRemoveMemberDialogOpen, setIsRemoveMemberDialogOpen] = useState(false);
  const [selectedMemberIdToRemove, setSelectedMemberIdToRemove] = useState<string | null>(null);

  const loadHouseholdData = useCallback(async () => {
    if (!activeHouseholdId || !shareApi) return;

    try {
      const [inviteRes] = await Promise.all([
        shareApi.getInviteCode(),
      ]);
      setInviteCode(inviteRes.active_invite.invite_key);
      await refetchMembers();
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


  const handleCopyCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      toast.success("Código copiado para a área de transferência!");
    }
  };

  const handleRegenerateCode = async () => {
    if (!activeHouseholdId || !shareApi) return;
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
      if (!shareApi) return;

      const result = await shareApi.joinHouseholdByInviteCode(joinCode.trim());
      updateActiveHousehold(result.household_id);
      await queryClient.invalidateQueries({ queryKey: ["household"] });
      await queryClient.invalidateQueries({ queryKey: ["rooms"] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
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

  const handleLeaveHouseConfirmed = async () => {
    if (!activeHouseholdId || !shareApi) return;
    try {
      await shareApi.leaveHousehold();
      updateActiveHousehold(null);
      await queryClient.invalidateQueries({ queryKey: ["household"] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      await refetchMembers();
      toast.success("Você saiu da residência com sucesso");
    } catch (err) {
      console.error("Erro ao sair da residência:", err);
      toast.error("Erro ao sair da residência");
    }
  };

  const handleRemoveMemberConfirmed = async () => {
    if (!activeHouseholdId || !shareApi || !selectedMemberIdToRemove) return;
    try {
      await shareApi.removeMember(selectedMemberIdToRemove);
      await queryClient.invalidateQueries({ queryKey: ["household"] });
      await refetchMembers();
      toast.success("Usuário removido com sucesso");
    } catch (err) {
      console.error("Erro ao remover usuário:", err);
      toast.error("Erro ao remover usuário");
    } finally {
      setSelectedMemberIdToRemove(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[420px] rounded-2xl p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl gap-0">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Compartilhamento
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Compartilhe sua residência e gerencie os membros do ambiente.
            </DialogDescription>
          </DialogHeader>

          {!isAuthenticated && (
            <Alert className="mb-4 rounded-xl border-rose-100 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-900/50 text-rose-900 dark:text-rose-200" variant="destructive">
              <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              <AlertTitle className="font-semibold text-xs uppercase tracking-wider mb-1">Login necessário</AlertTitle>
              <AlertDescription className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Você precisa estar logado para usar o compartilhamento entre dispositivos.
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="my-household" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl h-10">
              <TabsTrigger
                value="my-household"
                className="rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-50 data-[state=active]:shadow-sm transition-all"
              >
                Minha Residência
              </TabsTrigger>
              <TabsTrigger
                value="join"
                className="rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-50 data-[state=active]:shadow-sm transition-all"
              >
                Entrar em Casa
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-household" className="space-y-5 pt-4 outline-none">
              {error && (
                <Alert variant="destructive" className="rounded-xl border-rose-100 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-900/50">
                  <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  <AlertDescription className="text-xs font-medium text-rose-700 dark:text-rose-300">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  Código de Convite
                </label>
                <div className="flex gap-2">
                  <Input
                    value={inviteCode || ""}
                    readOnly
                    className="rounded-xl font-mono text-sm tracking-wider font-semibold border-slate-200/80 focus-visible:ring-teal-500 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 h-10"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopyCode}
                    disabled={!inviteCode}
                    className="rounded-xl h-10 w-10 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerateCode}
                  disabled={isLoading}
                  className="rounded-xl border-slate-200 dark:border-slate-800 text-xs font-semibold h-8 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {isLoading ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Renovar código
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-semibold rounded-xl h-8 px-3"
                  onClick={() => setIsLeaveDialogOpen(true)}
                >
                  Sair da residência
                </Button>
              </div>

              {members.length > 0 && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Membros ativos ({members.length})
                    </p>
                  </div>

                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                    {members.map((member) => {
                      const isMe = member.user_id === user?.id;
                      return (
                        <div
                          key={member.user_id}
                          className="flex justify-between items-center p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {member.name} {isMe && <span className="text-xs text-slate-400 font-normal ml-0.5">(você)</span>}
                            </span>
                            <div>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "rounded-md px-1.5 py-0 text-[10px] font-bold tracking-wide uppercase",
                                  member.role === "owner"
                                    ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20"
                                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-transparent"
                                )}
                              >
                                {member.role}
                              </Badge>
                            </div>
                          </div>

                          {currentMemberRole === "owner" && !isMe && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg shrink-0 transition-colors"
                              onClick={() => {
                                setSelectedMemberIdToRemove(member.user_id);
                                setIsRemoveMemberDialogOpen(true);
                              }}
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="join" className="space-y-4 pt-4 outline-none">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                    Código da nova residência
                  </label>
                  <Input
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Ex: ABC-123"
                    className="rounded-xl border-slate-200/80 focus-visible:ring-teal-500 focus-visible:border-teal-500 dark:border-slate-800 h-10 font-mono tracking-wider placeholder:font-sans placeholder:tracking-normal"
                  />
                </div>

                <Button
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white dark:bg-teal-600 dark:hover:bg-teal-700 text-xs font-semibold rounded-xl h-10 transition-all shadow-sm"
                  onClick={handleJoinHousehold}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Home className="mr-2 h-4 w-4" />
                  )}
                  Vincular e entrar na casa
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        isOpen={isLeaveDialogOpen}
        onOpenChange={setIsLeaveDialogOpen}
        onConfirm={handleLeaveHouseConfirmed}
        title="Sair da Residência"
        description="Tem certeza de que deseja sair desta casa? Você perderá o acesso às tarefas e cômodos vinculados a ela."
        confirmLabel="Sair da casa"
        cancelLabel="Cancelar"
        variant="danger"
      />

      <ConfirmationDialog
        isOpen={isRemoveMemberDialogOpen}
        onOpenChange={setIsRemoveMemberDialogOpen}
        onConfirm={handleRemoveMemberConfirmed}
        title="Remover Membro"
        description="Tem certeza que deseja remover esse usuário do ambiente compartilhado? Ele perderá acesso imediato."
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        variant="danger"
      />
    </>
  );
}

export default SharingDialog;