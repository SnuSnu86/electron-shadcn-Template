import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ipc } from "@/ipc/manager";
import type { UserRole } from "@/shared/domain";

type Client = typeof ipc.client;

export type ProcessFilterInput = NonNullable<
  Parameters<Client["catalog"]["listProcesses"]>[0]
>;
export type ProcessInput = Parameters<Client["catalog"]["createProcess"]>[0];
export type ParameterInput = Parameters<
  Client["catalog"]["upsertParameter"]
>[0];

export const queryKeys = {
  processes: (filter?: ProcessFilterInput) =>
    ["processes", filter ?? {}] as const,
  process: (id: number) => ["process", id] as const,
  parameters: (processId: number) => ["parameters", processId] as const,
  technicalArtifacts: (processId: number) =>
    ["technical-artifacts", processId] as const,
  categories: ["categories"] as const,
  tags: ["tags"] as const,
  runsByProcess: (processId: number) => ["runs", "process", processId] as const,
  recentRuns: ["runs", "recent"] as const,
  run: (runId: number) => ["run", runId] as const,
  logs: (runId: number) => ["logs", runId] as const,
  tutorial: (processId: number) => ["tutorial", processId] as const,
  dashboard: ["dashboard"] as const,
  role: ["role"] as const,
};

export function useProcesses(filter?: ProcessFilterInput) {
  return useQuery({
    queryKey: queryKeys.processes(filter),
    queryFn: () => ipc.client.catalog.listProcesses(filter),
  });
}

export function useProcess(id: number) {
  return useQuery({
    queryKey: queryKeys.process(id),
    queryFn: () => ipc.client.catalog.getProcess({ id }),
  });
}

export function useParameters(processId: number) {
  return useQuery({
    queryKey: queryKeys.parameters(processId),
    queryFn: () => ipc.client.catalog.listParameters({ id: processId }),
  });
}

export function useTechnicalArtifacts(processId: number) {
  return useQuery({
    queryKey: queryKeys.technicalArtifacts(processId),
    queryFn: () => ipc.client.catalog.listTechnicalArtifacts({ id: processId }),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => ipc.client.catalog.listCategories(),
  });
}

export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags,
    queryFn: () => ipc.client.catalog.listTags(),
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: () => ipc.client.workspace.getDashboardStats(),
    refetchInterval: 5000,
  });
}

export function useRole() {
  return useQuery({
    queryKey: queryKeys.role,
    queryFn: () => ipc.client.workspace.getRole(),
  });
}

export function useRunsByProcess(processId: number) {
  return useQuery({
    queryKey: queryKeys.runsByProcess(processId),
    queryFn: () => ipc.client.runs.listByProcess({ processId }),
  });
}

export function useRun(runId: number | null, live = false) {
  return useQuery({
    queryKey: queryKeys.run(runId ?? -1),
    queryFn: () => ipc.client.runs.getRun({ runId: runId as number }),
    enabled: runId !== null,
    refetchInterval: live ? 700 : false,
  });
}

export function useRunLogs(runId: number | null, live = false) {
  return useQuery({
    queryKey: queryKeys.logs(runId ?? -1),
    queryFn: () => ipc.client.runs.getLogs({ runId: runId as number }),
    enabled: runId !== null,
    refetchInterval: live ? 700 : false,
  });
}

export function useTutorial(processId: number) {
  return useQuery({
    queryKey: queryKeys.tutorial(processId),
    queryFn: () => ipc.client.tutorials.getByProcess({ processId }),
  });
}

export function useInvalidateProcessData() {
  const queryClient = useQueryClient();
  return (processId?: number) => {
    queryClient.invalidateQueries({ queryKey: ["processes"] });
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    if (processId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.process(processId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.parameters(processId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.technicalArtifacts(processId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.runsByProcess(processId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tutorial(processId),
      });
    }
  };
}

export function useStartRun() {
  const invalidate = useInvalidateProcessData();
  return useMutation({
    mutationFn: (input: {
      processId: number;
      overrides: Record<string, string>;
    }) => ipc.client.runs.startRun(input),
    onSuccess: (_runId, vars) => invalidate(vars.processId),
  });
}

export function useCancelRun() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (runId: number) => ipc.client.runs.cancel({ runId }),
    onSuccess: (_ok, runId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.run(runId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.logs(runId) });
      queryClient.invalidateQueries({ queryKey: ["runs"] });
    },
  });
}

export function useSetRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (role: UserRole) => ipc.client.workspace.setRole({ role }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.role }),
  });
}
