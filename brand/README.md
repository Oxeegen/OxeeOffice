# brand/

Everything specific to the OxeeOffice fork of upstream
[GenOffice](https://github.com/genspark-ai/genoffice) lives here. The goal is a
**small, stable diff against upstream**: upstream source stays untouched wherever
possible, and the few upstream files that must change carry a marked one-line hook.
Merging a new upstream release should be mechanical.

This mirrors the layout used by the OxeeUI fork of Orca.

## Layout

| Path | Purpose |
| --- | --- |
| `config/brand.config.json` | Single source of truth: product name, appId, description, GitHub publish target, release tag prefix, Linux package names. |
| `rename/core.mjs` | Rewrites `GenOffice` → `OxeeOffice`, `Genspark` → `Oxeegen` inside **string literals** of built JS. Shared by the renamer and the scanner. |
| `rename/roots.mjs` | Which build outputs are renamed and scanned, plus the reasoned allowlist. |
| `scripts/rename-built-output.mjs` | Applies the rename to `apps/*/out` and the CLI bundle, in place, idempotently. |
| `scripts/scan-visible-names.mjs` | Fails (`--fail`) when a user-visible upstream name survives. Also scans an extracted package. |
| `scripts/apply-brand-assets.mjs` | Copies icons and the wordmark over upstream's files before the build. `--restore` puts upstream's back. |
| `scripts/make-icons.ps1` | Regenerates `assets/build/` from `assets/icon.png` (Windows, GDI+). Outputs are committed. |
| `scripts/check-ee.mjs` | Licence guard: fails if code appears under upstream's enterprise-licensed `ee/`. |
| `scripts/check-hooks.mjs` | Fails if a merge dropped a hook, or upstream added a new reference to its own repo. |
| `scripts/verify-package.mjs` | Checks a **packaged** app: productName, version, update feed, exe name, no analytics credentials, visible names. |
| `scripts/smoke-launch.mjs` | **Launches** the packaged app (or `--dev` build): Home renders, preload bridge up, Oxeegen is the default provider. |
| `scripts/render-svg.mjs` | Dev helper: rasterize an SVG through the system browser to eyeball it. |
| `assets/` | `icon.png` master, generated `build/` icon set, renderer app icon and wordmark. |
| `theme/shell.css` | Style overrides layered after upstream's shell CSS. |
| `linux/after-*.sh` | deb/rpm scripts: expose the CLI without clobbering a real GenOffice install. |

Outside this directory, fork-owned files:

| Path | Purpose |
| --- | --- |
| `apps/shell/electron-builder.brand.cjs` | Wraps upstream's `electron-builder.cjs`: identity, GitHub update feed, artifact and package names, brand steps in `beforePack`. Sits next to upstream's file because electron-builder resolves resource paths against the app directory. |
| `.github/workflows/release-oxeeoffice.yml` | Tag `oxeeoffice-vX.Y.Z` → Windows + Linux build, verify, publish. |
| `.github/workflows/brand-ci.yml` | `check-ee` + `check-hooks` on every push and PR. |
| `packages/ai-provider/src/oxeegen.ts` (+ `tests/oxeegen.test.ts`) | The Oxeegen AI layer: chat/media/search catalogue entries, US/EU endpoints, models, adapter, defaults, settings migration, layer switch. |
| `packages/ai-search/src/brave.ts` (+ `tests/oxeegen-search.test.ts`) | Brave web and image search behind the Oxeegen search entry. |
| `apps/shell/src/renderer/src/oxeegen-settings.tsx` | Settings pieces: region buttons, hints, hidden Account section, Settings button glyph, onboarding slide filter. |
| `packages/ui/src/oxee-model-picker.tsx`, `oxee-mark.ts` | Model picker for the editors' AI panels, cross-tab settings refresh, the Oxee mark. |
| `README.md`, `PRIVACY.md` | Replaced outright with OxeeOffice versions (structure follows upstream's README). On an upstream merge, take ours and port any new upstream section worth having. The README uses upstream's app screenshots from `docs/assets/readme/` (Oxeegen's decision; they are credited to GenOffice), but not the hero banner or the translated READMEs. |
| `NOTICE`, `CHANGELOG.md`, `CONTRIBUTING.md` | Upstream notice kept in full with an Oxeegen section appended; changelog is ours; contributing guide has a fork section prepended. |

## How the product name is changed

The built apps carry ~1,800 user-visible occurrences of the upstream names:
window and tab titles, dialogs, the 21-language UI catalogues, MCP server names,
the AI User-Agent. Editing upstream source for each would conflict on every merge and
break upstream's tests, which assert upstream's strings. Instead the **built output**
is rewritten after `build:all` and before packaging:

- **String literals only.** `GenOffice` and `Genspark` are also identifiers
  (`GensparkMark`, `GENOFFICE_USER_DATA`), and only literal AST nodes are visited.
- **Case-sensitive, capitalized names only.** Lowercase `genoffice` / `genspark` are
  load-bearing contracts: the `@genoffice/*` npm scope, IPC channels, storage keys, a
  clipboard MIME type, `genspark.ai` API hosts, the `genoffice` CLI. None can match.
- **Font aliases are protected.** Upstream names CSS fallback faces
  `'GenOffice Batang'`, `'GenOffice Poppins'`, … and references them from JS. They are
  never shown to users, but renaming one side breaks font loading. The protected set
  is derived from what the build's CSS declares, because a hand-kept list went stale
  within one release.
- **Module paths and object keys are reported, never rewritten.**

`scan-visible-names.mjs --fail` then proves nothing visible survived, and
`verify-package.mjs` repeats that on the extracted installer contents.

Images carry no text, so the wordmark and icons are swapped by an explicit list in
`apply-brand-assets.mjs`, which fails if upstream moves one.

## The Oxeegen AI layer

Upstream defaults to a **Genspark sign-in provider**: a special `genspark` entry in
the chat, media and search catalogues that routes through Genspark's cloud. OxeeOffice
adds **Oxeegen as an ordinary own-key provider** instead of re-purposing that entry.
Upstream's generic path then handles its settings fields, key checks, Test button and
error messages, and every `provider === 'genspark'` branch in upstream code simply
never runs:

- `oxeegen` is first in all three catalogues; the Genspark entry is removed from
  media/search and hidden from the chat picker (kept so old ids still resolve).
- Defaults and the unusable-selection fallback are Oxeegen; images default to OpenAI.
- **Stored settings migrate on read** (`migrateToOxeegen`): 0.9.431 kept the Oxeegen
  chat config under `genspark`, so upgrades keep their key, endpoint and model. The
  settings file itself is only rewritten when the user saves.
- A stray `genspark` id resolves to Oxeegen, never to Genspark's proxy.
- `gskApiKey()` is always empty: a Genspark CLI login elsewhere on the machine must not
  switch Genspark cloud tools back on. With it empty, Slides' `generate_deck` takes
  upstream's **local** deck pipeline through the app's own AI (Oxeegen).
- Search: the Oxeegen entry's key is a **Brave** key (`brave.ts`).
- Images: OpenAI **gpt-image-2.5-flare** at **medium** quality. It replaces gpt-image-2 in the
  OpenAI list and in saved settings; `oxeegenImageRequestFields` adds `quality` to
  generations and edits (hook in `media-protocols.ts`). Measured 9.6 s against 15.3 s.
- Models: Max (default), Pro, Flash, Instant. All four read images and video; analysis
  defaults to Pro in AI Media & Search.
  Endpoints: US `inference-02`, EU `inference-04` (each region has its own keys).
- **Requests carry no sampling or length settings.** Oxeegen's endpoint sets
  `omitTemperature` and `omitMaxTokens`, so a chat body is only `model`, `messages`,
  `stream` and `tools`: temperature, output cap and reasoning are configured on the vLLM
  side. The Max output tokens field is hidden for Oxeegen because it has no effect.
- **One model, reasoning switched per step** (`OXEEGEN_ROLES` in `oxeegen.ts`). Every
  step uses the model in the picker. Planning keeps reasoning on: the chat agent, Slides
  style and outline, the HTML brief. Steps that carry out a plan turn it off with
  `chat_template_kwargs: {enable_thinking: false}` (the only switch the Oxee vLLM models
  honour): Slides page specs, the Slides layout check, the Docs / Markdown / HTML writers.
  `oxeegenRoleSettings` puts `thinking: false` on a request-only copy of the settings;
  `oxeegenEndpoint` turns it into `bodyExtras`. Measured on one slide spec: 2-5 s with
  reasoning off, 50-99 s with it on, both valid. The summary written when a long chat is
  compacted runs on **Oxee-instant**, in every editor (tagged in agent-core, routed in the
  shell's `ai:stream` handler in `docs-main.ts`; the standalone Slides/Sheets dev handlers
  are not routed). Upstream's Slides swap to a larger Anthropic model is off.
- **Slides pages are written one at a time**, each request carrying the JSON specs of the
  pages already written (`oxee-deck-references.ts`: page 1 plus the most recent pages,
  24k characters). Upstream writes 2 pages in parallel from the style text alone; pages
  written in parallel came out visibly mismatched.

**Testing.** The layer is **off under vitest** (`oxeegenLayerEnabled()`), so upstream's
test suites keep asserting upstream's defaults and their files never need merging.
`tests/oxeegen.test.ts` and `tests/oxeegen-search.test.ts` set `OXEEGEN_LAYER=1` and
test what ships.

**Two traps, both hit once:**
- The switch reads `process` through a computed name. A bundler rewrote
  `globalThis.process?.env` into `globalThis.process.env`, which throws in a sandboxed
  preload and left the shell a blank window — while every file-based check passed.
  That is why the release workflow now **launches** the packaged app
  (`smoke-launch.mjs`).
- Docs, Sheets and Slides read AI settings once at mount (upstream behaviour), so a
  model picked in another tab was ignored until reload. They re-read on focus and when
  a picker saves (`useAiSettingsRefresh`).

## Hooks in upstream files

If a merge conflicts, these are the places to re-apply. `check-hooks.mjs` fails when
one is lost to a silent resolution rather than a visible conflict. Each carries the
comment `OxeeOffice brand hook`.

| File | Hook |
| --- | --- |
| `apps/shell/src/renderer/src/main.tsx` | Imports `brand/theme/shell.css` after upstream's stylesheets. |
| `apps/shell/src/main/updater.ts` | Manual-download page → our releases; `beta` channel maps to the published `latest` feed. |
| `apps/shell/src/main/index.ts` | About-page star count from our repository. |
| `apps/shell/src/renderer/src/SettingsModal.tsx` | About-page repository label. |
| `apps/shell/src/renderer/src/IntegrationsPane.tsx` | `npx skills add Oxeegen/OxeeOffice`. |
| `packages/electron-utils/src/github-menu.ts` | Help-menu / star CTA repository URL. |
| `.github/workflows/ci.yml` | Upstream's CI runs in the fork only on demand. |
| `SECURITY.md` | Vulnerability reports go to this repository's advisories. |
| `apps/shell/tests/updater.test.ts`, `…/settings-integrations.test.ts` | Assert the hooked values. |
| `packages/ai-provider/src/{types,providers,registry,media,search-settings,index,browser}.ts` | Oxeegen ids; catalogue wrappers (`withOxeegen*`), defaults, `activeProvider` fallback, `migrateToOxeegen` on read; exports. |
| `packages/ai-search/src/{index,search-tools,gsk}.ts` | Brave first for the Oxeegen search entry; Test button against Brave; `gskApiKey()` empty. |
| `apps/shell/src/preload/index.ts` | Genspark sign-in provider filtered out of the picker. |
| `apps/shell/src/renderer/src/SettingsModal.tsx` | Account section hidden, opens on AI Model; US/EU region rows; no cloud-tools or analytics switch; Oxeegen and Brave hints. |
| `apps/shell/src/renderer/src/{Home,Onboarding,provider-logos}.tsx` | Sidebar button is Settings; no GenTeam/credits slide or analytics notice; Oxeegen logo. |
| `apps/shell/tests/privacy-doc.test.ts` | Asserts PRIVACY.md's no-analytics statement instead of an event list. |
| AI panels of docs, sheets, slides, pdf, markdown, html | Model picker in place of the title; `GensparkMark` renders the Oxee mark. |
| `apps/{docs,sheets,slides}/src/renderer/App.tsx` | Re-read AI settings on focus / picker change. |
| `apps/{pdf,markdown,html}/src/{preload/index,shared/ipc}.ts` | `setAiSettings`, so their picker can save. |
| `packages/ui/src/{index.ts,dropdown.css}` | Picker exports and sizing. |
| `apps/markdown/src/renderer/styles.css` | Page width 90% instead of 860px. |

## Releasing

1. Update `CHANGELOG.md` (include the upstream base there).
2. Tag and push — the annotated tag message becomes the release notes. **Release
   notes never mention GenOffice, Mainfunc or the upstream repository** (no
   "Built from GenOffice vX", no "Built on GenOffice … Mainfunc"); the workflow
   refuses to publish notes that do. Attribution lives in README, NOTICE and LICENSE.
   ```bash
   git tag -a oxeeoffice-v0.10.488 -m "OxeeOffice 0.10.488"
   git push origin oxeeoffice-v0.10.488
   ```
3. The workflow builds Windows (NSIS) and Linux (AppImage, deb, rpm), verifies each
   package, and publishes one release with `latest.yml` / `latest-linux.yml`. Installed
   apps pick it up from there.

For a **test build** without publishing: Actions → *Release (OxeeOffice)* → Run
workflow, leave *Publish* unchecked, and download the artifacts from the run.

Auto-update covers the Windows installer and the Linux AppImage. deb and rpm installs
update through the package manager, as upstream.

### Versioning

The first build on upstream `vX.Y.Z` is OxeeOffice `X.Y.Z`. An Oxeegen-only fix bumps
the patch (`0.10.489`) so installed apps receive it. On the next upstream release, take
its number if it is higher. Auto-update only installs a strictly higher version.

## Taking a new upstream release

GenOffice release tags are linear on `main` (each release is ahead of the previous,
never behind), so a plain merge works:

```bash
git fetch upstream --tags
git merge v0.10.600            # resolve any hook conflicts using the table above
node brand/scripts/check-hooks.mjs
node brand/scripts/check-ee.mjs
```

Then run a test build of the release workflow before tagging. Watch for:

- **`check-ee` failing** — upstream put code under `ee/`, which OxeeOffice may not
  distribute. Stop and decide; do not work around it.
- **`apply-brand-assets` failing** — upstream moved or added an icon.
- **The scan failing** — upstream added visible text the renamer cannot reach
  (for example text inside an image or a structural literal).

## Local development

```bash
npm ci
node brand/scripts/apply-brand-assets.mjs     # optional for dev; --restore to undo
npm run build:all                              # the Sheets sidecar needs Rust (cargo)
node brand/scripts/rename-built-output.mjs
node brand/scripts/scan-visible-names.mjs --fail
```

`npm run dev` runs upstream's unbranded dev build; the rename only applies to built
output. Packaging locally needs Rust for the Sheets sidecar; without it, use the
workflow's test-build mode.

On Windows, a number of upstream unit tests fail identically on pristine upstream
(path separators, dialog mocks). Compare against a baseline before attributing a
failure to the brand layer.

## Porting status

The pre-fork OxeeOffice (≤ 0.9.431) was produced by patching upstream's compiled
bundles. Where that behaviour now lives in source:

| Area | Status |
| --- | --- |
| Visible product name, window/taskbar identity, userData folder | Done |
| Icons, file-type icons, wordmark, dark-mode logo | Done |
| Auto-update from GitHub Releases | Done |
| Windows + Linux release workflow, package check, launch check | Done |
| Oxeegen as the provider in AI Model and AI Media & Search, US/EU endpoints pre-filled; no Genspark sign-in, account page, credits, cloud tools or cloud projects | Done |
| Brave search behind the Oxeegen search entry; OpenAI `gpt-image-2` for images | Done |
| Model picker in each AI panel (Max, Pro, Flash, Instant) | Done |
| Native slide-deck building | Done — upstream builds decks locally when Genspark's cloud is off |
| Markdown page width | Done |
| Onboarding without GenTeam, credits or analytics claims | Done |
| Theme toggle in the tab bar | Not ported (not in the 0.10.488 scope) |
| `genoffice` command line, MCP server name and agent skill → `oxeeoffice` (one unit, with the Linux executable name) | Planned for 0.10.489 |

Until the command-line row is done, the CLI, `~/.genoffice/launcher` and the Linux
executable keep upstream's lowercase name on purpose: they locate each other by it,
so renaming only some of them would break the CLI.
