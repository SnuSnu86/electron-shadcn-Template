import type { ProcessAction } from "@/shared/domain";

interface PadRunUrlInput {
  environmentId?: string;
  padEnvironmentId?: string;
  padWorkflowId?: string;
  workflowId?: string;
}

export function buildPadRunUrl(action: PadRunUrlInput): string | null {
  const environmentId = (
    action.padEnvironmentId ?? action.environmentId
  )?.trim();
  const workflowId = (action.padWorkflowId ?? action.workflowId)?.trim();
  if (!(environmentId && workflowId)) {
    return null;
  }

  const params = new URLSearchParams({
    environmentid: environmentId,
    workflowid: workflowId,
    source: "Other",
  });

  return `ms-powerautomate:/console/flow/run?${params.toString()}`;
}

export function resolvePadUrl(action: ProcessAction): string {
  return buildPadRunUrl(action) ?? action.padUrl ?? "ms-powerautomate:";
}
