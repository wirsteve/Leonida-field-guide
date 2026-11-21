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
/** Chapter 2 missions required to finish it (two optional-order errands are confirmed separately). */
const CHAPTER_TWO_DONE = [...CHAPTER_ONE, ...range(201, 204), ...range(206, 209), ...range(211, 215)];
const CHAPTER_THREE_DONE = [...CHAPTER_TWO_DONE, ...range(301, 327)];
const CHAPTER_FOUR_DONE = [...CHAPTER_THREE_DONE, ...range(401, 428)];

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
  { id: "chapter-two-done", label: "Just finished Chapter 2", detail: "The start of Chapter 3.", through: "story-215", storyIds: CHAPTER_TWO_DONE },
  { id: "chapter-three-done", label: "Just finished Chapter 3", detail: "The start of Chapter 4.", through: "story-327", storyIds: CHAPTER_THREE_DONE },
  { id: "chapter-four-done", label: "Just finished Chapter 4", detail: "The start of Chapter 5.", through: "story-428", storyIds: CHAPTER_FOUR_DONE },
];
