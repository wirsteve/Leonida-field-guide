import "server-only";
import { z } from "zod";
import { loadGuideDataset } from "@/content/guide";
import type { GuideApiError, GuideDataset } from "@/contracts";
import { progressSnapshotSchema } from "@/contracts/schemas";
import { evaluateGuide } from "./evaluate";
import { validateDataset } from "./validate";
import { checkMission, identifyMission, suggestMissions } from "./missions";

const headers = { "Cache-Control": "no-store" };
const snapshot = progressSnapshotSchema;
const query = z.string().max(160);
const maxBodyBytes = 512 * 1024;
let dataset: GuideDataset | undefined;

function error(status: number, code: GuideApiError["error"]["code"], message: string): Response {
  return Response.json({ error: { code, message } } satisfies GuideApiError, { status, headers });
}

async function readJson(request: Request): Promise<unknown> {
  if (!request.body) throw new Error("Missing request body");
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let text = "";
  try {
    for (;;) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > maxBodyBytes) throw new Error("Request body too large");
      text += decoder.decode(chunk.value, { stream: true });
    }
    return JSON.parse(text + decoder.decode()) as unknown;
  } catch (issue) {
    await reader.cancel().catch(() => undefined);
    throw issue;
  } finally {
    reader.releaseLock();
  }
}

function endpoint<Input>(schema: z.ZodType<Input>, run: (data: GuideDataset, input: Input) => unknown) {
  return async (request: Request): Promise<Response> => {
    let body: unknown;
    try {
      body = await readJson(request);
    } catch {
      return error(400, "invalid-request", "Provide a valid guide request.");
    }
    const input = schema.safeParse(body);
    if (!input.success) {
      const version = z.object({ snapshot: z.object({ schemaVersion: z.number() }) }).safeParse(body);
      if (version.success && version.data.snapshot.schemaVersion !== 1) {
        return error(400, "unsupported-version", "This progress version is unsupported.");
      }
      return error(400, "invalid-request", "Provide a valid guide request.");
    }
    try {
      dataset ??= validateDataset(loadGuideDataset());
      return Response.json(run(dataset, input.data), { headers });
    } catch {
      return error(500, "internal", "Guide information is temporarily unavailable.");
    }
  };
}

export const evaluatePost = endpoint(z.object({ snapshot }),
  (data, input) => evaluateGuide(data, input.snapshot));
export const suggestPost = endpoint(z.object({ snapshot, query, limit: z.number().int().min(1).max(25).optional() }),
  suggestMissions);
export const identifyPost = endpoint(z.object({ snapshot, query }), identifyMission);
export const checkPost = endpoint(z.object({
  snapshot, query: query.optional(), recordId: z.string().regex(/^[a-z0-9][a-z0-9-]*$/).max(120).optional(),
}).refine(input => Boolean(input.query?.trim() || input.recordId)),
(data, input) => checkMission(data, input.snapshot, input));
