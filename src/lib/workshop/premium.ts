"use client";

/**
 * Premium gate — the single seam where paid features will plug in.
 *
 * Every tool routes its export/download actions through `runExport()`. Today
 * the gate always allows the action (everything is free). When the Paystack
 * pay-per-use flow lands, only `checkEntitlement()` needs to change: it will
 * ask /api/entitlement whether this action is free (e.g. under a page or file
 * limit) or needs a pass, and open the Paystack checkout when it does. Tool
 * code won't need to change.
 */

export interface ExportAction {
  /** Tool slug, e.g. "merge-pdf". */
  tool: string;
  /** What is being exported, e.g. "download", "download-zip". */
  action: string;
  /** Size of the job (files, pages, images) so future limits can be "N free, more with a pass". */
  units?: number;
}

export type GateDecision = { allowed: true } | { allowed: false; reason: string };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function checkEntitlement(_action: ExportAction): Promise<GateDecision> {
  return { allowed: true };
}

/** Runs `fn` if the action is allowed. Returns false (and does nothing) if the gate declines. */
export async function runExport(action: ExportAction, fn: () => void | Promise<void>): Promise<boolean> {
  const decision = await checkEntitlement(action);
  if (!decision.allowed) return false;
  await fn();
  return true;
}
