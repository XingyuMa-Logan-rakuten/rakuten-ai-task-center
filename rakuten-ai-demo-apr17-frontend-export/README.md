# Rakuten AI demo — subscription & tasks export (2026-04-17)

This folder is a **snapshot of `frontend/src/`** from the `rakuten-ai-demo` repository at commit **b20f53b** (*tasks: rename LINE task, remove dual-tone email and hoikuen deck Aoi cases*), packaged for the Task Center repo so product/design can diff or cherry-pick without cloning the full Vite app.

## Intended source repo

- Path used when exporting: `Documents/rakuten-ai-demo`
- Commit: `b20f53b29f53c5f9cffb330404de3a8bc546dd4a`

## What is included

- Subscription / credits UI: `subscriptionUtils.ts`, `types.ts`, `components/CreditsPage.tsx`, `components/SubscriptionPage.tsx`, `components/UsageLimitModal.tsx`, `components/UserProfileMenu.tsx`, wiring in `App.tsx` / `ChatView.tsx`, styles in `index.css`.
- Task catalog & gallery: `data/tasks.ts`, `data/connectors.ts`, `components/GalleryView.tsx`, `components/TaskCover.tsx`, `components/TaskModal.tsx`, `components/MyTasksView.tsx`, and related shared components under `src/components/`.

## How to use

Copy files from `src/` into `rakuten-ai-demo/frontend/src/` (same relative paths), then run the demo’s frontend build as usual. This Task Center site does not compile TypeScript; treat this export as a **portable source bundle** only.

## Branch name note

Git branch names cannot contain `&`. The remote branch is **`subscription-Task-Update-Apr-17`**, which corresponds to the requested label *subscription & Task Update - Apr 17*.
