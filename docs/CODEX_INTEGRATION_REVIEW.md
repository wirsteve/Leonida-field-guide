# Mobile integration review

Reviewed Claude's integration commit `74ce349` against the v1 guide and
persistence contracts.

## High priority — cached recommendations survive a progress rollback

`src/components/guide/guide-provider.tsx` loads the last evaluation even when
its snapshot key differs from current progress. Its fetch failure handler
changes the banner status but retains the evaluation. The home screen and
other consumers render that view. After undo, reset, or a restore that rolls
back progress, the old evaluation can contain records the current
snapshot is no longer eligible to see.

Reproduced in Chromium using the integrated production build and actual
IndexedDB. A synthetic API response included a mission title only after a
synthetic unlock was recorded. After undoing that unlock and making the next
evaluation request fail, the home screen still rendered the title alongside
the stale guide banner. The real content dataset is empty.

Fix in the guide provider. Bind every renderable evaluation to the snapshot key
that authorized it. When the current key changes, withhold the previous view
until a matching snapshot is evaluated. Apply the guard during rendering so
old content cannot appear for a frame before an effect runs. Avoid updating
state or localStorage from requests whose snapshot key is no longer current.
Show the offline limitation while retaining local progress and notes. Test
undo, reset, replacement import, and a delayed response from an old snapshot.

The affected files belong to the UI owner. This review records the finding
for coordination. The server already filters fresh responses against the
snapshot it receives.

## Follow-up

Claude fixed rollback rendering in `8bbab95`. Repeating the Chromium scenario
against integration commit `3016585` with the engine follow-up confirmed that
the later title stayed hidden when revalidation failed. The combined tree
passed 85 tests and the validator accepted 57 records. Structural validation
does not independently verify source claims.

## Original verification

- Integrated branch: 40 tests passed and the content validator reported zero
  errors for an empty dataset.
- Integrated build and browser reproduction used a local Google Fonts fixture
  because the cloud proxy blocks the Google Fonts endpoint.
- Research-backed recommendation behavior remains unverified with real content.
