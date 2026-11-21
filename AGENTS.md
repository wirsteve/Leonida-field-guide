<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Leonida Field Guide — agent rules

Two agents work in this repository: Claude Code (lead, UI, content) and Codex (engine, persistence, gateway). Before changing anything, read:

- `docs/COLLABORATION.md`: file ownership. Don't edit the other agent's paths without coordinating.
- `docs/CONTRACTS.md` and `src/contracts/`: the shared, versioned interfaces. Change them only through a dedicated contract PR.
- `docs/ARCHITECTURE.md`: the spoiler boundary. Guide research is server-only, and only `Public*` types reach the client.

Never force-push over the other agent's commits. Run `npm run check && npm run build` before opening a PR.
