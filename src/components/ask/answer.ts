import type { GuideEvaluation, PublicGuideRecord } from "@/contracts";
import { cashGoalOf } from "@/components/money/plan";

/**
 * "Ask the guide": answers common questions from the player's own evaluation.
 * No AI and no network. It only reads records the server already projected for
 * this player, so it can't reveal anything ahead of them.
 */
export type AskAction =
  | { kind: "record"; recordId: string; label: string }
  | { kind: "link"; href: string; label: string }
  | { kind: "check"; label: string }
  | { kind: "cash"; label: string };

export interface AskAnswer {
  topic: "money" | "next" | "advance" | "missable" | "fun" | "pastime" | "completion" | "save" | "search" | "none";
  headline: string;
  body?: string;
  actions: AskAction[];
}

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const open = (r: PublicGuideRecord) => r.status === "available" || r.status === "unsure";
const isFun = (r: PublicGuideRecord) => r.tags.includes("try-this");
const isPastime = (r: PublicGuideRecord) => r.tags.includes("pastime");

export function normalize(text: string): string {
  return text.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9$%]+/g, " ").trim();
}

const has = (q: string, re: RegExp) => re.test(q);

const INTENTS: { topic: AskAnswer["topic"]; re: RegExp }[] = [
  { topic: "save", re: /\b(save|saving|backup slot|manual save)\b/ },
  { topic: "missable", re: /\b(miss|missable|missed|last chance|lose|lost forever|permanent|point of no return)\b/ },
  { topic: "advance", re: /\b(ready|safe to|before (i |we )?(leave|move|go|advance|start|continue)|move on|moving on|leave|leaving|advance|how much more|anything left|done here|finish (up )?here|next chapter|push on)\b/ },
  { topic: "money", re: /(\$|\b\d+ ?k\b|\b(money|cash|earn|rich|broke|buck ?me|bank|grind|pay|paid|afford|savings|income|make bank|dollars?)\b)/ },
  { topic: "completion", re: /\b(100|100%|percent|completion|collectibles?|trophy|trophies|achievements?|checklist)\b/ },
  { topic: "fun", re: /\b(fun|bored|stupid|crazy|chaos|viral|stunt|funny|wild|mess around|random|wreck)\b/ },
  { topic: "next", re: /\b(what (now|next|should)|next|now what|where (do|should) i|what do i do|todo|to do|priority|priorities)\b/ },
];

export function answer(query: string, evaluation: GuideEvaluation): AskAnswer {
  const q = normalize(query);
  if (!q) return { topic: "none", headline: "Ask about money, what to do next, or anything you've unlocked.", actions: [] };
  const records = evaluation.records;

  // A specific record named in the question beats a generic intent ("is golf missable?" still wants golf).
  const hits = search(q, records);
  const intent = INTENTS.find((i) => has(q, i.re))?.topic;

  if (!intent && hits.length > 0 && isPastime(hits[0])) return pastimeAnswer(hits.filter(isPastime));

  switch (intent) {
    case "money":
      return moneyAnswer(evaluation);
    case "next":
      return nextAnswer(evaluation);
    case "advance":
      return advanceAnswer(evaluation);
    case "missable":
      return missableAnswer(evaluation);
    case "fun":
      return funAnswer(records, q);
    case "completion":
      return completionAnswer(records);
    case "save":
      return saveAnswer(evaluation);
  }

  if (hits.length > 0) {
    return {
      topic: "search",
      headline: hits.length === 1 ? `Here's what matches: ${hits[0].name}` : `${hits.length} things match`,
      actions: hits.slice(0, 5).map((r) => ({ kind: "record", recordId: r.id, label: r.name })),
    };
  }
  return {
    topic: "none",
    headline: "Nothing you've unlocked matches that.",
    body: "Try asking about money, what to do next, whether it's safe to move on, or something fun to do. To check a specific mission, use Check before starting.",
    actions: [{ kind: "check", label: "Check before starting" }],
  };
}

/** Word-overlap search across what the player can see. */
export function search(q: string, records: PublicGuideRecord[]): PublicGuideRecord[] {
  const words = q.split(" ").filter((w) => w.length > 2 && !STOP.has(w));
  if (words.length === 0) return [];
  const scored = records
    .filter((r) => r.kind !== "stage" && !r.nameWithheld && r.name !== "Spoiler")
    .map((r) => {
      const title = normalize([r.name, ...r.aliases].join(" "));
      const text = normalize(`${r.summary} ${r.tags.join(" ")} ${r.area?.label ?? ""}`);
      let score = 0;
      for (const w of words) {
        const stem = w.replace(/(ing|s)$/, "");
        if (title.includes(stem)) score += 3;
        else if (text.includes(stem)) score += 1;
      }
      return { r, score };
    })
    .filter((x) => x.score >= Math.max(2, words.length))
    .sort((a, b) => b.score - a.score || Number(open(b.r)) - Number(open(a.r)));
  return scored.map((x) => x.r);
}

const STOP = new Set([
  "the", "and", "for", "can", "how", "what", "where", "when", "who", "why", "does", "should", "could", "would", "with",
  "you", "your", "are", "there", "any", "get", "about", "this", "that", "from", "into", "have", "has", "out", "way",
  "best", "good", "some", "thing", "things", "want", "need", "doing", "just", "like", "game", "find", "place", "spot",
]);

function moneyAnswer(e: GuideEvaluation): AskAnswer {
  const goal = e.records.find((r) => cashGoalOf(r) !== null && open(r));
  const target = (goal ? cashGoalOf(goal) : null) ?? e.money.target;
  const best = e.money.bestMethodId ? e.records.find((r) => r.id === e.money.bestMethodId) : undefined;
  const actions: AskAction[] = [];
  if (goal) actions.push({ kind: "record", recordId: goal.id, label: `See your plan to ${usd(target!)}` });
  if (best) actions.push({ kind: "record", recordId: best.id, label: best.name });
  actions.push({ kind: "link", href: "/money", label: "Open Money" });
  if (e.money.cash === null) actions.push({ kind: "cash", label: "Tell the guide your cash" });

  if (target !== null && e.money.cash !== null) {
    const gap = Math.max(0, target - e.money.cash);
    return {
      topic: "money",
      headline: gap === 0 ? `You've got the ${usd(target)}.` : `${usd(gap)} to go to reach ${usd(target)}.`,
      body: best ? `Best earner right now: ${best.name}. ${best.guidance}` : e.money.body,
      actions,
    };
  }
  return {
    topic: "money",
    headline: best ? `Best way to earn now: ${best.name}` : e.money.headline,
    body: best ? best.guidance : e.money.body,
    actions,
  };
}

function nextAnswer(e: GuideEvaluation): AskAnswer {
  const move = e.queue.find((q) => q.priority !== "wait" && !(q.recordId && isFunId(e, q.recordId))) ?? e.nextBestMove;
  if (!move) return { topic: "next", headline: "Nothing verified to recommend yet.", body: e.coverageNote, actions: [] };
  const then = e.queue.filter((q) => q.id !== move.id && q.priority === "do-now" && q.recordId).slice(0, 3);
  return {
    topic: "next",
    headline: move.title,
    body: move.body,
    actions: [
      ...(move.recordId ? [{ kind: "record" as const, recordId: move.recordId, label: "Open it" }] : []),
      ...then.map((q) => ({ kind: "record" as const, recordId: q.recordId!, label: `Then: ${q.title}` })),
    ],
  };
}

function isFunId(e: GuideEvaluation, id: string) {
  const r = e.records.find((x) => x.id === id);
  return r ? isFun(r) || isPastime(r) : false;
}

function advanceAnswer(e: GuideEvaluation): AskAnswer {
  const r = e.readiness;
  const lastChance = r.blocking.filter((b) => b.lastChance);
  const rest = r.blocking.filter((b) => !b.lastChance);
  const nothingLost = lastChance.length === 0;
  const parts: string[] = [];
  if (nothingLost) parts.push("Nothing you can reach is marked as lost if you move on.");
  else parts.push(`${lastChance.length} thing${lastChance.length === 1 ? "" : "s"} can be lost if you move on.`);
  if (rest.length > 0) parts.push(`Finish ${rest.length === 1 ? "this" : "these"} first: ${rest.map((b) => b.name).join(", ")}.`);
  if (e.stage?.saveAdvice) parts.push(e.stage.saveAdvice);
  return {
    topic: "advance",
    headline: r.blocking.length === 0 ? "You're clear to move on." : r.headline,
    body: parts.join(" "),
    actions: [
      ...r.blocking.slice(0, 4).map((b) => ({ kind: "record" as const, recordId: b.recordId, label: b.lastChance ? `Last chance: ${b.name}` : b.name })),
      { kind: "check", label: "Check the next mission" },
    ],
  };
}

function missableAnswer(e: GuideEvaluation): AskAnswer {
  const at = e.records.filter((r) => open(r) && (r.lastChance || r.missable === "yes"));
  if (at.length === 0) {
    return {
      topic: "missable",
      headline: "Nothing you can reach right now is missable.",
      body: "The guide only warns when sources confirm something can be lost. The 100% checklist has nothing missable either.",
      actions: [{ kind: "link", href: "/strategy", label: "See the plan" }],
    };
  }
  return {
    topic: "missable",
    headline: `${at.length} thing${at.length === 1 ? "" : "s"} you could miss`,
    body: "Do these before you move the story on.",
    actions: at.slice(0, 5).map((r) => ({ kind: "record", recordId: r.id, label: r.lastChance ? `Last chance: ${r.name}` : r.name })),
  };
}

function funAnswer(records: PublicGuideRecord[], q: string): AskAnswer {
  const pool = records.filter((r) => isFun(r) && r.status !== "completed");
  const matched = search(q, pool);
  const picks = (matched.length > 0 ? matched : shuffle(pool)).slice(0, 3);
  return {
    topic: "fun",
    headline: picks.length ? "Try one of these" : "You've done every stunt the guide knows. Legend.",
    actions: [...picks.map((r) => ({ kind: "record" as const, recordId: r.id, label: r.name })), { kind: "link", href: "/explore", label: "See all fun stuff" }],
  };
}

function pastimeAnswer(hits: PublicGuideRecord[]): AskAnswer {
  const top = hits[0];
  return {
    topic: "pastime",
    headline: top.name,
    body: `${top.summary}${top.area ? ` Closest area: ${top.area.label}.` : ""}`,
    actions: hits.slice(0, 3).map((r) => ({ kind: "record", recordId: r.id, label: r.name })),
  };
}

function completionAnswer(records: PublicGuideRecord[]): AskAnswer {
  const checklist = records.filter((r) => r.kind === "collectible-set");
  const trophies = records.filter((r) => r.kind === "achievement");
  const openChecklist = checklist.filter(open).length;
  const openTrophies = trophies.filter(open).length;
  return {
    topic: "completion",
    headline: `${openChecklist} checklist item${openChecklist === 1 ? "" : "s"} and ${openTrophies} troph${openTrophies === 1 ? "y" : "ies"} still open`,
    body: "None of the 100% checklist can be missed, so there's no rush. Chip away at it whenever you're passing.",
    actions: [{ kind: "link", href: "/explore", label: "Open Explore" }],
  };
}

function saveAnswer(e: GuideEvaluation): AskAnswer {
  return {
    topic: "save",
    headline: "Keep a separate manual save at each chapter start and before big story moments.",
    body: e.stage?.saveAdvice ?? "There's no mission replay, so an old save is your only way back.",
    actions: [{ kind: "check", label: "Check the next mission" }],
  };
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const SUGGESTIONS = ["How do I make money?", "What should I do next?", "Is it safe to move on?", "Something stupid to do", "Where can I golf?"];
