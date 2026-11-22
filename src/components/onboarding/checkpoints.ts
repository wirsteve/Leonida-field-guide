/**
 * One-tap starting points for onboarding (owner: Claude).
 *
 * Each checkpoint lists the opaque ids of the story missions that are
 * necessarily complete at that point. Ids are opaque (`story-<n>`) and only
 * cover missions BEFORE the checkpoint, so nothing ahead is disclosed.
 * tests/contracts/checkpoints.test.ts keeps these in sync with the dataset's
 * gating: each list must equal the transitive story prerequisites of `through`.
 */
export interface Checkpoint {
  id: string;
  /** Spoiler-safe label in the player's own terms. */
  label: string;
  detail: string;
  /** The last story mission completed at this checkpoint. */
  through: string;
  storyIds: string[];
}

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => `story-${from + i}`);
const CHAPTER_ONE = range(101, 122);


export const CHECKPOINTS: Checkpoint[] = [
  {
    id: "after-breakfast-stickup",
    label: "Just finished the breakfast stickup",
    detail: "The milestone you described when this guide was set up.",
    through: "story-212",
    storyIds: [...CHAPTER_ONE, "story-201", "story-202", "story-203", "story-204", "story-206", "story-207", "story-208", "story-209", "story-211", "story-212"],
  },
  {
    id: "chapter-one-done",
    label: "Just finished Chapter 1",
    detail: "The start of Chapter 2.",
    through: "story-122",
    storyIds: CHAPTER_ONE,
  },
];
// No later-chapter checkpoints: listing them would reveal how many chapters the
// game has. Players further along type the last mission they finished instead.

/**
 * Catch-up checkpoints, reached only through a direct link (`/catch-up?to=<id>`)
 * sent to a player who reported their progress. They're never listed in the UI,
 * so they can't reveal what comes later. Ids are opaque.
 */
export const LINK_CHECKPOINTS: Checkpoint[] = [
  {
    id: "cp-214",
    label: "Caught up to where you told me",
    detail: "Your latest story progress.",
    through: "story-214",
    storyIds: [...CHECKPOINTS[0].storyIds, "story-213", "story-214"],
  },
];
