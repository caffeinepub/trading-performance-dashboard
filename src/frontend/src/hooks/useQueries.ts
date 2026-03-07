import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ClientAccount,
  InstrumentStats,
  PerformanceMetrics,
} from "../backend.d";
import { useActor } from "./useActor";

// ── Performance Metrics ──────────────────────────────────────────────────────

export function usePerformanceMetrics() {
  const { actor, isFetching } = useActor();
  return useQuery<PerformanceMetrics>({
    queryKey: ["performanceMetrics"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getPerformanceMetrics();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useUpdatePerformanceMetrics() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (metrics: PerformanceMetrics) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updatePerformanceMetrics(metrics);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["performanceMetrics"] });
    },
  });
}

// ── Instrument Stats ──────────────────────────────────────────────────────────

export function useInstrumentStats(symbol: string) {
  const { actor, isFetching } = useActor();
  return useQuery<InstrumentStats>({
    queryKey: ["instrumentStats", symbol],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getInstrumentStats(symbol);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useUpdateInstrumentStats() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      symbol,
      stats,
    }: {
      symbol: string;
      stats: InstrumentStats;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateInstrumentStats(symbol, stats);
    },
    onSuccess: (_data, { symbol }) => {
      void queryClient.invalidateQueries({
        queryKey: ["instrumentStats", symbol],
      });
    },
  });
}

// ── Client Accounts ───────────────────────────────────────────────────────────

export function useClientAccounts() {
  const { actor, isFetching } = useActor();
  return useQuery<ClientAccount[]>({
    queryKey: ["clientAccounts"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getAllClientAccounts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useAddClientAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (account: ClientAccount) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addClientAccount(account);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["clientAccounts"] });
    },
  });
}

export function useEditClientAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      account,
    }: {
      id: bigint;
      account: ClientAccount;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.editClientAccount(id, account);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["clientAccounts"] });
    },
  });
}

export function useDeleteClientAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteClientAccount(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["clientAccounts"] });
    },
  });
}

// ── Weekly Scalp Summary ──────────────────────────────────────────────────────

export function useWeeklyScalpSummary() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["weeklyScalpSummary"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getWeeklyScalpSummary();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ── Admin Check ───────────────────────────────────────────────────────────────

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}
