<p align="center">
  <img src="brand/assets/icon.png" alt="OxeeOffice" width="128">
</p>

<h1 align="center">OxeeOffice</h1>

<p align="center"><b>Oxeegen's AI office suite.</b><br>
Word, Excel, PowerPoint and PDF files, edited by you and your AI, saved back in the real formats —
running on Oxeegen's own models.</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/github/license/Oxeegen/OxeeOffice?color=5E4AF5" alt="License: Apache-2.0"></a>
  <a href="https://github.com/Oxeegen/OxeeOffice/releases/latest"><img src="https://img.shields.io/github/v/release/Oxeegen/OxeeOffice?color=5E4AF5" alt="Latest release"></a>
  <a href="https://github.com/Oxeegen/OxeeOffice/releases"><img src="https://img.shields.io/github/downloads/Oxeegen/OxeeOffice/total?color=5E4AF5" alt="Downloads"></a>
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20Linux-5E4AF5" alt="Platform: Windows and Linux">
</p>

<p align="center">
  <a href="#download"><b>Download</b></a> ·
  <a href="#command-line-and-agent-skill"><b>CLI</b></a> ·
  <a href="#mcp-server"><b>MCP</b></a> ·
  <a href="https://www.oxeegen.com"><b>Oxeegen</b></a> ·
  <a href="PRIVACY.md"><b>Privacy</b></a>
</p>

OxeeOffice is a desktop office suite for Windows and Linux. It opens and saves
native `.docx`, `.xlsx` and `.pptx` files, edits PDF, Markdown and HTML, and puts
an AI agent next to every document — not a chat box bolted on the side, but an
editor that reads the file, makes the change, and shows you exactly what it
touched.

- **Real formats, byte-preserving.** Only what you edit is rewritten. Everything
  else in the file survives byte-for-byte, so documents keep working in Word,
  Excel and PowerPoint.
- **AI you can review.** Edits land as tracked changes and diffs with one-click
  rollback. Spreadsheets get live formulas, not pasted numbers. Decks and pages
  are generated onto the canvas and stay fully editable.
- **Local by design.** Files open, edit, save and convert on your machine.
  PDF → Word / Excel / PowerPoint, Markdown → Word and HTML → Word all run
  on-device. Only the AI calls leave the machine, to the provider you choose.
- **Oxeegen models by default.** AI runs on Oxeegen's self-hosted,
  OpenAI-compatible inference. You can also bring your own key for Claude,
  OpenAI, Gemini, DeepSeek, Mistral, OpenRouter and others, or any
  OpenAI-compatible endpoint, local servers included.
- **Scriptable and agent-ready.** The app ships a command line and a skill for
  Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot, OpenCode and Windsurf,
  so a coding agent can create, convert, read and edit real Office files on your
  machine without opening a window.
- **Updates itself.** Installed apps check this repository's releases and offer
  each new version.

**Get it:** [Windows](https://github.com/Oxeegen/OxeeOffice/releases/latest) (x64) ·
[Linux](https://github.com/Oxeegen/OxeeOffice/releases/latest) (deb, rpm, AppImage) —
details and requirements in [Download](#download).

> **Porting in progress.** Up to 0.9.431, OxeeOffice was built by patching the
> compiled application. It is now built from source, and the Oxeegen AI layer —
> Oxeegen as the provider in every AI settings pane, the live model list, the
> model picker in each editor, Brave search — is being moved across. Status:
> [brand/README.md](brand/README.md#porting-status).

## The apps

Six editors, one AI panel, and a command line for your coding agent.
<sub>Screenshots of OxeeOffice will be added once the Oxeegen AI layer is in place.</sub>

### 1 · Docs — open and edit `.docx` with an AI you can review

**Opens the file as Word lays it out** — two-column sections, full-bleed images,
shaded tables, headers and footers, pagination on Word's line metrics. Styles,
comments, tracked changes, equations and ink round-trip untouched.

**Ask for the edit** — the AI reads the blocks it needs, rewrites a section and
inserts new content. Every AI turn is a snapshot you can roll back; with
**Track changes** on, edits arrive as Word-style revisions.

### 2 · Sheets — `.xlsx` with live formulas and charts, not pasted numbers

**Build it** — from one sentence the agent adds a summary sheet with real
`SUMIF`s, inserts a chart, and applies the changes as a single undoable batch.

**Ask it** — questions about the workbook come back with the reasoning and the
exact cells used as clickable citations. Under the hood: a Rust `.xlsx` engine,
pivot tables, slicers, conditional formatting and formula tracing.

### 3 · Slides — from a prompt to a `.pptx` deck

**One line in** — describe the deck. OxeeOffice plans the storyline and drafts
every slide onto the canvas as a real `.pptx`.

**Keep editing** — masters, layouts, smart guides and non-destructive cropping,
or ask the panel to restyle, rewrite and reorder.

### 4 · PDF — edit PDF text in place, convert PDF to Word on-device

**Edit inside the page** — Edit text mode outlines every text block for in-place
retyping; the content stream is rewritten through PDFium with the original
fonts, not a cover-up annotation. Ask the AI about a long report and get answers
with page citations.

**Convert on-device** — **PDF Converter → PDF to Word** produces an editable
`.docx` that opens in Docs next to the source. Excel and PowerPoint targets work
the same way; scanned pages go through the system OCR.

### 5 · HTML — an AI page and UI builder, design brief first

Say what the page is for and who it is for. The AI proposes a **design brief**
first — hook, palette, typography and style directions — then builds a single
self-contained `.html` file against those tokens. Click any element to restyle
it, double-click to edit text, or switch to the source view. One **Restyle**
request swaps the brief's tokens and the page follows. Present fullscreen, or
export as PDF or a native editable Word document.

### 6 · Markdown — a block editor over plain `.md`, with Ask AI

**Ask AI about a selection** — select any passage and an **Ask AI** chip appears:
type an instruction or pick a suggestion, send it now, or queue several anchored
edits and run them in one pass. The same entry exists in every app.

**Rendered, saved as plain Markdown** — headings, lists, tables, images, code
blocks and Mermaid diagrams, written back as plain `.md`, with a fully local
**Markdown → Word** export.

### 7 · CLI and MCP — your coding agent drives OxeeOffice, on your machine

OxeeOffice ships a command line, an agent skill and an MCP server. Claude Code,
Claude Desktop, Codex, Cursor and other agents can create, convert, read and
edit real Office files through the same engines as the apps, without opening a
window. See [Command line and agent skill](#command-line-and-agent-skill) and
[MCP server](#mcp-server).

## Why OxeeOffice

- **Runs on Oxeegen.** AI on Oxeegen's own inference, with the region endpoint
  configurable per user — no third-party account or subscription.
- **Yours to run.** Native apps for Windows and Linux; files stay on your disk
  and every edit, save and conversion happens on your machine.
- **Real Office files.** Native `.docx`, `.xlsx` and `.pptx`, byte-preserving:
  the parts of a file you did not touch are copied exactly as they were.
- **An AI that edits the document itself.** Tracked changes in Docs, live
  formulas and charts in Sheets, slides drawn onto the canvas, every AI turn a
  snapshot you can roll back.
- **PDF done properly.** Edit text inside the page, and convert PDF to Word,
  Excel or PowerPoint on-device, with system OCR for scans.
- **Markdown and HTML too**, with the same AI panel and local export to Word.
- **Scriptable.** A command line, an agent skill and an MCP server put every
  engine at the service of your coding agents, still on-device.
- **Open source**, Apache-2.0, and free.

## AI backends

**Oxeegen** is the default provider: chat, image and video analysis run on
Oxeegen's models through its OpenAI-compatible endpoint. Enter your Oxeegen API
key and endpoint in **Settings** — keys are never bundled, because releases are
public.

**Or bring your own key.** Settings → AI Model also lists Claude, OpenAI,
Gemini, DeepSeek, Kimi, GLM, Qwen, Doubao, MiniMax, Grok, Mistral, OpenRouter,
Requesty and OpenCode Zen/Go, plus a custom slot for any OpenAI-compatible
endpoint (base URL + key), including local model servers. Search and media have
their own per-capability providers under **AI Media & Search**.

The whole suite ships light, dark and system themes. Themes only change what is
on screen: exports, prints and saved files always keep the document's own
colors.

## Command line and agent skill

Everything the apps can do to a file, the command line can do from a terminal:
inspect, convert, create, read and edit Word, Excel, PowerPoint, PDF, Markdown
and HTML on the same engines, headless. It installs with OxeeOffice, needs no
runtime of its own, and never sends a document anywhere. Paired with the bundled
**agent skill**, it turns a coding agent into a document worker that produces
real Office files instead of Markdown approximations.

> The command is still called **`genoffice`** in this release; it becomes
> `oxeeoffice` in an upcoming one, together with the MCP server name and the
> skill. The examples below use the current name.

**Works with:** Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot, OpenCode
and Windsurf out of the box, any other agent that reads skills, and, through the
[MCP server](#mcp-server), Claude Desktop and every MCP client.

### Install the skill

| How | What happens |
| --- | --- |
| **Settings → Integrations** in the app | Lists the agents found on this computer; one click writes the skill into each one you choose. An **Update** button appears when a release ships a newer skill. |
| **Download as zip** on the same page | The layout claude.ai, the Claude desktop apps and other assistants accept as an uploaded skill. |
| `npx skills add Oxeegen/OxeeOffice` | Installs from this repository into any skills-compatible agent. |

Then start a new chat and ask for a document. The skill teaches the agent when to
reach for the command line, how to read a file before editing it, and how to
check its own work.

### Quickstart from the terminal

```bash
genoffice --version
genoffice info report.docx --json                  # headings and blocks; or sheets, slides, pages
genoffice convert report.md --to pdf               # md/html/docx/xlsx/pptx → pdf, pdf → docx/xlsx/pptx, …
genoffice create --type docx --from notes.md --out notes.docx
genoffice create --type xlsx --from table.json --out sales.xlsx   # "=SUM(B2:B9)" cells stay live formulas
genoffice docs read report.docx --range 0-9 --json # then `docs apply --ops edits.json` edits in place
genoffice render report.docx --out shots/          # one PNG per page, to look at what you made
genoffice open sales.xlsx                          # hand the result to the editor
```

Every command prints a one-line summary, or a single JSON object with `--json`.
Edits are atomic: a rejected op leaves the file untouched and comes back with a
guided error. `genoffice help` lists the current command surface; the full
reference is [packages/cli/README.md](packages/cli/README.md).

### Building a deck from an agent

An agent following the skill's staged workflow runs something like this, and the
command line checks every stage before the next one starts:

```bash
genoffice capabilities --json                        # which cloud tools are configured
genoffice guide slides design                        # the deck workflow and layout library
genoffice slides check deck/outline.json --json      # outline checked
genoffice slides check deck/pages/01.json --json     # builds one slide, audits overflow and overlap
…                                                    # one page file per slide, fixed until each check is clean
genoffice create --type pptx --spec deck/pages --outline deck/outline.json --out deck/briefing.pptx --json
genoffice slides render deck/briefing.pptx --out deck/shots --json
genoffice slides audit deck/briefing.pptx --json
genoffice open deck/briefing.pptx
```

No model call happens inside the command line: the agent does the thinking, the
command line does the building and the checking, and the result opens in
OxeeOffice or PowerPoint as an ordinary `.pptx`.

## MCP server

The same commands are available as [Model Context Protocol](https://modelcontextprotocol.io)
tools, for assistants that cannot run a terminal or that you would rather not give
one. There are two ways in, both shown with copy-ready snippets in
**Settings → Integrations → MCP**:

| Way | What it is |
| --- | --- |
| **A · `genoffice mcp`** (recommended) | A stdio server the assistant starts itself; OxeeOffice does not need to be open. One tool per command (`info`, `convert`, `create_*`, `docs_*`, `sheet_*`, `slides_*`, `render`, `guide`, `search`, `image`, `media`, `open`) plus the staged deck flow `deck_start` → `deck_page` → `deck_build` → `deck_replace`. |
| **B · Local HTTP server** | Runs inside the app on `http://127.0.0.1:3093/mcp`. Its tools drive a visible Word editor tab, so you watch the document take shape. Off by default; switch it on in the same settings pane. |

```bash
# Claude Code
claude mcp add --transport stdio genoffice -- genoffice mcp
```

```jsonc
// Cursor, Claude Desktop or any other MCP client
{ "mcpServers": { "genoffice": { "command": "genoffice", "args": ["mcp"] } } }
```

`genoffice` here is the command line shipped inside the app — on Windows
`%LOCALAPPDATA%\Programs\OxeeOffice\resources\cli\genoffice.cmd`, on Linux
`/usr/bin/genoffice`; the settings pane prints the exact path for your install.
Cloud features (`search`, `image`, `media`) go through the provider configured in
OxeeOffice; everything else runs locally, and `GENOFFICE_ALLOWED_ROOTS` confines
every tool to the folders you list.

## Download

| Platform | Requirements | Download |
| --- | --- | --- |
| **Windows** (x64) | Windows 10+, Intel/AMD | [`OxeeOffice-<version>-setup.exe`](https://github.com/Oxeegen/OxeeOffice/releases/latest) |
| **Linux** — Debian / Ubuntu | x86_64, glibc 2.34+ (Ubuntu 22.04 or newer) | [`oxeeoffice_<version>_amd64.deb`](https://github.com/Oxeegen/OxeeOffice/releases/latest) |
| **Linux** — Fedora / RHEL / openSUSE | x86_64, glibc 2.34+ (Fedora 35+, RHEL 9+, Leap 15.6+) | [`oxeeoffice-<version>.x86_64.rpm`](https://github.com/Oxeegen/OxeeOffice/releases/latest) |
| **Linux** — other distributions | x86_64, glibc 2.34+, FUSE 2 | [`OxeeOffice-<version>.AppImage`](https://github.com/Oxeegen/OxeeOffice/releases/latest) |

The Windows installer and the AppImage update themselves; deb and rpm installs
update through the package manager. The installers are unsigned: on first run,
Windows SmartScreen warns — choose **More info → Run anyway**. macOS is not built,
because without an Apple Developer certificate Gatekeeper refuses the app.

The version tracks the upstream release it is built from — `0.10.488` is built on
upstream `v0.10.488` — and a patch bump is an Oxeegen-only fix. See
[CHANGELOG.md](CHANGELOG.md).

<details>
<summary><b>Installing on Linux</b></summary>

The deb installs with apt — it pulls in the dependencies and adds OxeeOffice to
the applications menu:

```bash
sudo apt install ./oxeeoffice_<version>_amd64.deb
```

On Fedora / RHEL-family / openSUSE, install the rpm instead:

```bash
sudo dnf install ./oxeeoffice-<version>.x86_64.rpm     # Fedora / RHEL family
sudo zypper install ./oxeeoffice-<version>.x86_64.rpm  # openSUSE
```

The AppImage runs in place: install the FUSE 2 runtime (`sudo apt install libfuse2`;
on Ubuntu 24.04 the package is `libfuse2t64`), make the file executable, then run it:

```bash
chmod +x OxeeOffice-<version>.AppImage
./OxeeOffice-<version>.AppImage
```

</details>

## How it works

Seven Electron apps — Docs, Sheets, Slides, PDF, Markdown, HTML and the tabbed
shell — share one engine layer of pure TypeScript packages plus a Rust sidecar
for `.xlsx`. The original file is always the source of truth: edits are applied
as narrow patches, and everything the editor did not touch survives the round
trip untouched.

```
open docx ─► archive original by hash (never touched)
          ─► parse word/document.xml into a block tree, each block anchored to its original XML
          ─► Tiptap editor (manual + AI editing, dirty tracking)
save      ─► dirty blocks → OOXML fragments (referencing existing styles only)
          ─► splice into the original document.xml; untouched blocks keep their bytes
          ─► repack the zip; every other entry is copied byte-for-byte
```

Everything specific to OxeeOffice — naming, icons, the update feed, packaging and
the Oxeegen AI layer — lives in [`brand/`](brand/README.md), on top of an
otherwise unmodified upstream tree.

## Development

```bash
npm install
npm test             # engine + app unit tests
npm run typecheck    # tsc --noEmit across every workspace
npm run dev          # all six editors + shell against Vite dev servers
npm run dev:docs     # a single app (same pattern works per workspace)
```

The Sheets app needs a Rust toolchain for its xlsx sidecar (`cargo` on PATH).
Installers are built by the release workflow; how that works, every OxeeOffice
change to upstream files, and how to take a new upstream release are in
[brand/README.md](brand/README.md). Setup, checks and pull requests are in
[CONTRIBUTING.md](CONTRIBUTING.md).

## Support

- **Report a bug or request a feature** in
  [GitHub Issues](https://github.com/Oxeegen/OxeeOffice/issues).
- Report OxeeOffice problems here, not to the upstream project.

## FAQ

<details>
<summary><b>Is OxeeOffice free?</b></summary>

Yes. The apps are free and open source under the Apache-2.0 license. AI features
use Oxeegen inference or the provider key you configure.

</details>

<details>
<summary><b>Can OxeeOffice open Microsoft Word, Excel and PowerPoint files?</b></summary>

Yes. OxeeOffice opens and saves native `.docx`, `.xlsx` and `.pptx` files. Saving is
byte-preserving: parts of the file you didn't touch are written back byte-for-byte,
so documents keep working in Microsoft Office.

</details>

<details>
<summary><b>Does OxeeOffice work offline?</b></summary>

Document editing is fully local — files never leave your machine to be opened,
edited, saved or converted. The AI features need a network connection to Oxeegen
or to the provider you configured.

</details>

<details>
<summary><b>Can OxeeOffice edit PDF files, or convert them to Word?</b></summary>

Yes to both: real PDF text and image editing that rewrites the page content
stream with the original fonts, and PDF → Word / Excel / PowerPoint conversion
entirely on-device, with system OCR for scanned pages.

</details>

<details>
<summary><b>Can I use a different AI model or my own API key?</b></summary>

Yes. Oxeegen is the default, and Settings also accepts keys for Claude, OpenAI,
Gemini, DeepSeek and others, or any OpenAI-compatible endpoint, including local
model servers.

</details>

<details>
<summary><b>Can I drive OxeeOffice from Claude Code, Codex, Cursor or a script?</b></summary>

Yes, through the bundled command line and agent skill, or the MCP server. See
[Command line and agent skill](#command-line-and-agent-skill).

</details>

<details>
<summary><b>Does OxeeOffice collect any data?</b></summary>

No. OxeeOffice builds send no usage analytics: upstream's reporting only runs
when a build is given analytics credentials, and ours never are — the release
workflow fails if a package carries them. Documents stay on your machine; only
the AI requests you make are sent, to the provider you configured.
See [PRIVACY.md](PRIVACY.md).

</details>

<details>
<summary><b>How does OxeeOffice relate to GenOffice?</b></summary>

OxeeOffice is Oxeegen's fork of [GenOffice](https://github.com/genspark-ai/genoffice),
the open-source office suite by Mainfunc, Inc. (Apache-2.0). Upstream releases are
merged in, and Oxeegen's changes are kept on top in [`brand/`](brand/README.md).
OxeeOffice is not affiliated with, endorsed by, or supported by Mainfunc, Inc. or
Genspark.

</details>

## Security

See [SECURITY.md](SECURITY.md) for how to report a vulnerability, the process
security posture (renderer sandboxing, IPC validation, external-link gating) and
the threat models for AI-generated content.

## Acknowledgements

OxeeOffice is built on [GenOffice](https://github.com/genspark-ai/genoffice) by
Mainfunc, Inc., and on these open-source projects:

- [Electron](https://www.electronjs.org/) — the desktop runtime for every app.
- [Univer](https://github.com/dream-num/univer) (Apache-2.0) — the spreadsheet UI core that Sheets extends.
- [PDFium](https://pdfium.googlesource.com/pdfium/) (BSD-3-Clause, bundled via [@embedpdf/pdfium](https://github.com/embedpdf/embed-pdf-viewer)) — the content-stream engine behind PDF text and image editing.
- [pdf.js](https://github.com/mozilla/pdf.js) (Apache-2.0) and [pdf-lib](https://github.com/Hopding/pdf-lib) (MIT) — PDF rendering and document assembly.
- [Tiptap](https://tiptap.dev/) / [ProseMirror](https://prosemirror.net/) — the block editors in Docs and Markdown.
- [CodeMirror](https://codemirror.net/) (MIT) — the source editor in HTML.
- [Konva](https://konvajs.org/) — canvas rendering for Slides and Sheets charts.
- [HarfBuzz](https://github.com/harfbuzz/harfbuzz) (wasm) — text-shaping metrics for complex scripts.
- [calamine](https://github.com/tafia/calamine) and [IronCalc](https://github.com/ironcalc/IronCalc) — the read and calc layers of the Rust xlsx sidecar.
- [libeot](https://github.com/umanwizard/libeot) (MPL-2.0) — the MicroType Express decoder for embedded PowerPoint fonts, ported to TypeScript.
- [React](https://react.dev/) (MIT) — the UI layer of every app.
- [Mermaid](https://mermaid.js.org/) (MIT) and [KaTeX](https://katex.org/) (MIT) — diagrams and math in Markdown and Docs.
- [opentype.js](https://opentype.js.org/) (MIT) — font parsing for metrics and glyph lookup.
- [JSZip](https://stuk.github.io/jszip/) (MIT) and [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser) (MIT) — the OOXML container and XML layers.
- [Fluent UI System Icons](https://github.com/microsoft/fluentui-system-icons) (MIT) — the icon set across the ribbons.
- [electron-updater](https://www.electron.build/) (MIT) — in-app updates.
- Liberation, Carlito, Caladea, and Noto CJK fonts (OFL/Apache-2.0) — bundled document fonts.

## License

OxeeOffice is licensed under the [Apache License 2.0](LICENSE), inherited from
GenOffice. Attribution and third-party notices are in [NOTICE](NOTICE).

The `ee/` directory is covered by the separate GenOffice Enterprise License
([ee/LICENSE](ee/LICENSE)) and is not part of OxeeOffice builds.

GenOffice and Genspark are trademarks of Mainfunc, Inc. OxeeOffice uses its own
name and branding and is not affiliated with Mainfunc, Inc.
