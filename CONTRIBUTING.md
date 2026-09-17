# Contributing to OxeeOffice

Thanks for your interest in contributing. This document covers the local
setup, the checks a change must pass, and the conventions used in this
repository.

## Working in this repository

```bash
git clone https://github.com/Oxeegen/OxeeOffice.git
cd OxeeOffice
gh repo set-default Oxeegen/OxeeOffice
```

**Run `gh repo set-default` once per clone**, so `gh pr create` opens pull
requests against this repository.

- Branch from `main` and open a pull request against `Oxeegen/OxeeOffice` `main`.
- Brand checks run on every PR (`brand-ci.yml`). Locally:
  `node brand/scripts/check-hooks.mjs` and `node brand/scripts/check-ee.mjs`.
- Packaging, releases, the Oxeegen AI layer and every marked hook
  (`OxeeOffice brand hook`) are documented in [`brand/README.md`](brand/README.md).
  Add each new hook to `brand/scripts/check-hooks.mjs` and to the table there.
- Never commit API keys: the repository and its releases are public.
- Do not add or copy code under `ee/`. It is under a separate license, not
  Apache-2.0, and OxeeOffice may not distribute it.
- Report bugs and request features in this repository's
  [issues](https://github.com/Oxeegen/OxeeOffice/issues).

## Repository layout

- `apps/*` — the seven Electron apps (docs, sheets, slides, pdf, markdown, html, shell).
  Each app is an npm workspace with its own `src/main` (Electron main
  process), `src/renderer` (React UI), and `tests/`.
- `packages/*` — pure TypeScript engine and shared packages (no Electron
  dependency, unit-tested): docx/pptx engines, AI agent core, providers,
  i18n, UI kit.
- `apps/sheets/native/xlsx-engine` — Rust xlsx engine (runs as a sidecar process) for xlsx import/export.
- `brand/` — OxeeOffice packaging, update feed, icons and the Oxeegen AI layer.

## Engine packages

All pure TypeScript, no Electron dependency, unit-tested (except the UI kit):

- `packages/docx-engine` — docx parsing → block tree (with `docxIndex`
  anchors and passthrough), OOXML fragment generation, byte-level paragraph
  patching.
- `packages/pptx-engine` / `packages/pptx-render` — pptx model and rendering.
- `packages/pdf2docx` — local PDF → DOCX conversion: PDFium character-level
  extraction, pure-geometry layout analysis, rebuild through `docx-engine`;
  the same analysis drives the PDF app's PowerPoint and Excel exports.
- `packages/html2docx` — local HTML → DOCX conversion: the page is rendered in
  the app's own Chromium, reduced in-browser to a document intent tree, and
  written as native OOXML with the `docx` library; only visuals with no Word
  counterpart are screenshotted. Drives the HTML app's Export as Word.
- `packages/file-parse` — text extraction for AI attachments (office formats,
  text formats).
- `packages/agent-core` — the AI agent loop and skill composition shared by
  every app.
- `packages/ai-provider` — provider abstraction and streaming for the model
  backends.
- `packages/ai-search` — web and image search tools.
- `packages/i18n`, `packages/ui`, `packages/project-store`,
  `packages/electron-utils` — shared i18n core, React UI kit, recent-files
  store, and Electron main-process helpers.

### Architecture notes (docx round trip)

```
open docx ─► archive original by hash (never touched)
          ─► docx-engine parses word/document.xml top-level elements (w:p / w:tbl / …)
          ─► Block tree, each block anchored by docxIndex + original XML slice
          ─► Tiptap streaming editor (manual + AI editing, dirty tracking)
save      ─► dirty blocks → OOXML fragments (referencing existing styles only)
          ─► splice into original document.xml (untouched blocks keep original bytes)
          ─► repack zip; all other entries copied byte-for-byte
```

The same philosophy holds in sheets and slides: the original file is the
source of truth, edits are applied as narrow patches, and everything the
editor didn't touch survives the round trip untouched.

## Getting started

Prerequisites: Node 22+, npm 10+, and a Rust toolchain (`cargo` on PATH,
needed only for the sheets xlsx sidecar).

```bash
npm install
npm run fixtures     # generate test .docx fixtures (one-time, and after docx-engine changes)
npm run dev          # all editors + shell against Vite dev servers
npm run dev:docs     # or run a single app
```

## Checks every change must pass

Run these locally before opening a pull request:

```bash
npm run format:check # Prettier check for uncommitted changed/new files
npm run lint         # ESLint across the repo (0 errors required; warnings allowed)
npm run typecheck    # tsc --noEmit across every workspace
npm test             # engine + app unit tests (also runs the Rust sidecar tests)
npm run licenses     # production dependency licenses within the permissive allowlist
```

Formatting is intentionally incremental: existing files are not reformatted
unless they are part of your change. Run these exact commands before committing:

```bash
npm run format                              # format uncommitted changed/new files
npm run format:check                        # verify uncommitted changed/new files
npm run format:check -- --base origin/main  # verify committed files on your branch
```

## Building installers

Release installers for Windows and Linux are built and published by the
release workflow — see [brand/README.md → Releasing](brand/README.md#releasing),
including its test-build mode.

To package locally, run from the repository root:

```bash
npm run dist:win     # nsis installer
npm run dist:linux   # AppImage, deb, rpm
```

These produce unsigned artifacts, which is the expected result for a
contributor build.

`dist:win` expects the xlsx sidecar at the MinGW cross-compilation path.
Building on Windows leaves it under the MSVC target instead, so stage it
first:

```bash
cargo build --release --target x86_64-pc-windows-gnu   # from apps/sheets/native/xlsx-engine
```

or copy an existing `target/release/xlsx-sidecar.exe` to
`target/x86_64-pc-windows-gnu/release/`.

## Environment variables

None are required — the apps run with all of these unset. They exist for
testing and local overrides:

| Variable                                                 | Effect                                                                        |
| -------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `BUILD_DIR`                                              | Override the electron-builder output directory (default `apps/shell/release`) |
| `GENOFFICE_USER_DATA`                                    | Override the Electron userData directory (test isolation)                     |
| `GENOFFICE_LANG`                                         | Force the UI language instead of following the OS locale                      |
| `GENOFFICE_FAKE_UPDATE`                                  | Exercise the updater UI without a real release feed                           |
| `SERPER_API_KEY`, `TAVILY_API_KEY`                       | Supply a Serper or Tavily search key                                          |
| `XLSX_SIDECAR_PATH`, `XLSX_OPEN_PATH`, `XLSX_DEBUG_PORT` | Point at a locally built xlsx sidecar and its debug port                      |
| `*_DEV_PORT`, `*_RENDERER_URL`                           | Per-app Vite dev server ports and renderer URLs (set by `npm run dev`)        |

AI features degrade rather than break without credentials, and web search
falls back to a keyless backend.

## Coding conventions

- **English only** in code, comments, commit messages, and docs. User-facing
  strings go through the i18n resources (`src/renderer/i18n/`, plus the inline
  main-process dictionaries in `src/main/`), which are the only places
  non-English text belongs (plus test fixture text and README translations).
- TypeScript everywhere; avoid adding new `any` surfaces where a precise type
  is cheap.
- Tests live in `apps/*/tests` and `packages/*/tests` (vitest). New engine
  behavior needs a unit test; renderer-only UI tweaks generally don't.
- Playwright/Electron acceptance drivers and Office-app comparison scripts
  (anything that drives the built app or Word/Excel/PowerPoint on your
  machine) are local, on-demand tools: keep them out of the tree (they are
  gitignored) and never wire them into CI.
- Keep files from growing without bound: if you are adding a substantial new
  concern to an already-large file, prefer a new module.

## Commit and PR guidelines

- Small, focused commits with imperative English subject lines
  (e.g. `fix docx table border round-trip`, `add slides chart legend parsing`).
- A PR should explain _why_ the change is needed, and mention which of the
  checks above you ran.
- File format fidelity is the core product promise: for changes touching
  open/save paths (docx/xlsx/pptx), include a round-trip test proving
  untouched content survives byte-for-byte.

## Reporting bugs and requesting features

Use the issue templates. For suspected security issues, do **not** open a
public issue — follow [SECURITY.md](SECURITY.md).

## Code of conduct

All community spaces follow the
[Contributor Covenant](CODE_OF_CONDUCT.md); participation implies acceptance.

## License

There is no CLA (contributor license agreement). By contributing, you agree
that your contributions are licensed under the [Apache License 2.0](LICENSE)
that covers this project — inbound = outbound, per Apache-2.0 §5.

The `ee/` directory is under a [separate license](ee/LICENSE) and does not
accept contributions.
