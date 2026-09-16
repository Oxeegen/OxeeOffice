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
| `scripts/verify-package.mjs` | Checks a **packaged** app: productName, version, update feed, exe name, visible names. |
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
| `README.md`, `PRIVACY.md` | Replaced outright with OxeeOffice versions (structure follows upstream's README). On an upstream merge, take ours and port any new upstream section worth having. Upstream's screenshots and translated READMEs under `docs/` show GenOffice branding and are not linked. |
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

## Releasing

1. Update `CHANGELOG.md` (include the upstream base).
2. Tag and push — the annotated tag message becomes the release notes:
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
bundles. That behaviour is being moved into source here:

| Area | Status |
| --- | --- |
| Visible product name, window/taskbar identity, userData folder | Done |
| Icons, file-type icons, wordmark, dark-mode logo | Done |
| Auto-update from GitHub Releases | Done |
| Windows + Linux release workflow | Done — first CI run pending |
| Oxeegen as the single provider in AI Model, AI Search and AI Media; no Genspark sign-in, credits or cloud projects. **Blocks the 0.10.488 release:** PRIVACY.md lists every outbound destination, and `www.genspark.ai` (sign-in proxy, cloud projects, image CDN referer) and the `genoffice.ai` link must be gone first | To do |
| Live model list, Brave search, oxeegen.com links | To do |
| Model picker in each AI panel, theme toggle, native slide-deck building, Markdown page width | To do |
| `genoffice` command line, MCP server name and agent skill → `oxeeoffice` (one unit, with the Linux executable name) | To do |

Until the command-line row is done, the CLI, `~/.genoffice/launcher` and the Linux
executable keep upstream's lowercase name on purpose: they locate each other by it,
so renaming only some of them would break the CLI.
