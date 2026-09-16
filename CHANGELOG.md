# Changelog

OxeeOffice versions correspond to the upstream [GenOffice](https://github.com/genspark-ai/genoffice)
release they are built from, plus the Oxeegen layer. The first build on upstream
`vX.Y.Z` is OxeeOffice `X.Y.Z`; an Oxeegen-only fix bumps the patch number so installed
apps receive it through auto-update.

---

## OxeeOffice 0.10.488 — unreleased

**Upstream: [GenOffice v0.10.488](https://github.com/genspark-ai/genoffice/releases/tag/v0.10.488)** (2026-09-16),
which also brings in [v0.10.63](https://github.com/genspark-ai/genoffice/releases/tag/v0.10.63) (2026-09-13) · Windows x64, Linux x64

### OxeeOffice is now built from source

Up to 0.9.431, OxeeOffice was produced by patching upstream's compiled application
after installing it. This repository is now a fork of GenOffice with the full upstream
history, and every Oxeegen change lives in reviewable commits under
[`brand/`](brand/README.md).

- **Automatic updates.** Installed apps check this repository's releases and offer
  new versions: the Windows installer and the Linux AppImage update in place. The
  previous builds had updates switched off, because an upstream update would have
  reverted the patches.
- **Linux.** AppImage, deb and rpm, alongside Windows.
- **No more "GenOffice" in the app.** Window and taskbar titles, dialogs, every UI
  language, the installer, the settings folder (`%APPDATA%\OxeeOffice`,
  `~/.config/OxeeOffice`) say OxeeOffice. A build fails if any
  visible upstream name survives.
- **Icons:** a new `.html` file-type icon in the same set.
- Built and published by GitHub Actions from a tag, with each package verified before
  release.

Settings live in a new folder. Anyone moving from a build that ran as "GenOffice"
underneath can copy `%APPDATA%\GenOffice\ai-settings.json` into
`%APPDATA%\OxeeOffice\`.

### From upstream v0.10.63 and v0.10.488

- **Command line and agent skill.** A bundled command line runs the office engines
  headless, so coding agents (Claude Code, Codex, Cursor, …) can create, convert, read,
  render and edit Office files locally. Settings → Integrations installs the skill.
- **MCP.** Agents can drive the suite over the Model Context Protocol — through the
  command line, or through a server inside the app that edits the open document live.
- **Docs:** Zotero citations, paste options, clickable checkboxes, streamed AI writing,
  export as images, picture watermarks, much faster long CJK documents.
- **Sheets:** print and PDF export draw charts and pictures; AutoSum, Sort & Filter and
  AutoFit on Home; theme colors, pattern and gradient fills; typed CSV import.
- **Slides:** numbering and picture bullets, Insert Table dialog, AI-edited decks open
  in PowerPoint without repair, clickable hyperlinks in exported PDFs.
- **HTML:** Insert menu, resize and drag-to-reorder, export as single-file HTML.
- **PDF:** print range dialog, editable PDF → PPTX, heading-derived outline, 800% zoom.
- **Markdown:** large files open in linear time, spellcheck toggle, resizable outline.
- **App:** faster file opening, a Folders panel on Home, version in Help → About.

### Not yet carried over from 0.9.431

The Oxeegen AI integration is being moved into source and is not in this build yet:
Oxeegen as the provider in AI Model, AI Search and AI Media; the live model list and
the model picker in each editor; Brave search; native slide-deck building. Progress is
tracked in [brand/README.md](brand/README.md#porting-status). Until then, AI features
are configured with upstream's providers in Settings.

---

## OxeeOffice 0.9.431

**Upstream: [GenOffice v0.9.431](https://github.com/genspark-ai/genoffice/releases/tag/v0.9.431)** (2026-09-09) · Windows x64

### New: the HTML app

A sixth editor joins Documents, Spreadsheets, Slides, PDF and Markdown.

- **AI Design** builds visual pages — landing pages, dashboards, slide-style layouts — from a brief plus style directions.
- **AI Document** writes long-form documents as HTML.
- Both share a live preview where clicking any element restyles it or sends just that part to the AI, plus a layer tree, a present mode, and export to Word.

### Application

- **Global AutoSave.**
- AI panel text size and spellcheck settings; Ask AI now quotes and highlights the selected text.
- Czech added to the interface languages.

### Documents

- **Export as HTML.**
- Edit comments in place; spellcheck fixes.

### Spreadsheets

- Find no longer freezes on large grids.
- External-workbook formulas keep their cached values; Excel-style paste repeat; a range of fidelity fixes.

### Slides

- PDF export works for large decks.
- Better font resolution for EMF/WMF pictures and East Asian themes.

### PDF and Markdown

- **Find and replace**, and **Mermaid diagrams**.
- Highlight geometry now aligns correctly.

### Oxeegen layer

Upstream absorbed image generation and media analysis as configurable BYOK capabilities this release, so a large part of the Oxeegen patch set was deleted in favour of upstream's own mechanism.

- **Oxeegen is now a first-class provider in the native Settings panes** — AI Model (chat), AI Search and AI Media — instead of bespoke Oxeegen rows bolted onto the Account page. Each capability is configured where the application expects it.
- **Video analysis is new.** Image and video analysis both run on Oxeegen Pro / Flash / Instant; previously only still images were wired up.
- **Image generation stays on OpenAI** `gpt-image-2`, because Oxeegen has no image model.
- **Search stays on Brave.** Upstream added serper, tavily, exa and bing, none of which is Brave, so this remains an Oxeegen change.
- The new HTML app receives the Oxeegen layer along with the other five.

### Not included

Upstream's Windows on Arm (ARM64) installer is not built for OxeeOffice; this is Windows x64 only. Upstream's new Codex App Server provider does not apply — OxeeOffice routes chat through Oxeegen.

---

## OxeeOffice 0.9.10

**Upstream: [GenOffice v0.9.10](https://github.com/genspark-ai/genoffice/releases/tag/v0.9.10)** (2026-09-06) · Windows x64

This release jumps seven upstream releases ahead of OxeeOffice 0.8.21
(`v0.8.358` → `v0.9.10`). Everything below lands at once.

### Documents

- Long documents open **much faster**, and large exports no longer stall or produce blank pages.
- **AI edits preserve formatting** — rewritten paragraphs and tables keep their fonts, widths, borders and shading.
- Comment balloons and page borders now appear in print preview and PDF export.
- Word-style **dark page** in dark theme; print, PDF export and clipboard keep the original colors.
- Spellcheck toggle, editing of existing hyperlinks, per-side table borders, and URLs that auto-linkify as you type.
- Embedded DOCX fonts load; floating-table layout overhauled.
- Extensive Word-fidelity work: cross-page tables, row heights across page breaks, per-section margins, headers/footers, anchored pictures, lists, footnotes, drop caps, hidden text, shading, WordArt and VML pictures, doughnut charts, justified spacing, and CJK typed-grid and punctuation compression.

### Spreadsheets

- **Merge workbooks** — append sheets from other files, or attach spreadsheets in the AI chat.
- **CSV support** — export the active sheet as CSV and open CSV files directly.
- Million-cell copies are about **twice as fast** with live formulas; large workbooks scroll and load more smoothly.
- More reliable AI edits: sort, copy and fill operate on raw cell values, and edits that would break formulas or produce oversized files are rejected up front.
- Formula values stay intact across recalculation and save; recalculation waits for streaming to finish.
- Excel-standard navigation keys and shortcuts, with cell shortcuts kept out of the AI chat and dialog fields.
- Zoom persists through save; workbooks with leading-slash ZIP entries open; `$` in headers/footers no longer corrupts page setup; "No fill" saves correctly.
- Fidelity fixes for charts, combo charts, fills, pivot styles, pictures, validation dropdowns, conditional formatting and RTL.

### Slides

- Saves are **serialized**, so concurrent writes can no longer corrupt the file; agent runs survive lifecycle boundaries.
- **Right-to-left support** — paragraph and table direction toggles, mirrored bullets, complex-script shaping.
- Chart fidelity: manual plot layouts, RTL-aware legends, theme-override colors.
- WordArt text warp, PowerPoint-matched font substitution, rotated table cell editing.
- Compressed embedded fonts (MTX) decode; EMF+ pictures and pattern brushes render.
- Scrollable notes pane at a readable height; text fidelity fixes for embedded fonts, gradients, baselines, Symbol bullets, theme colors, CJK/Latin font selection and slide-number fields.

### PDF

- New AI tools for **watermarks, headers/footers, page move/reverse/rotate, metadata, markup removal, sticky notes, form check boxes and text block alignment**.

### AI and limits

- The **output token cap is now a setting** (default 32768, adjustable to 131072) instead of a hard 8192 limit, and truncated replies are flagged and recover rather than coming back empty.
- The system prompt knows the current date.

### Application

- **Collapsible ribbon**, like Office, in every editor.
- AI chat renders tables and code blocks; "New chat" fully clears history and attachments; AI panels are RTL-aware.
- Open documents by **dropping them onto the app window**.
- Per-document-type file icons.

### Not included

Upstream's Windows on Arm (ARM64) installer, added in `v0.8.1360` and promoted to
stable in `v0.9.10`, is not built for OxeeOffice. OxeeOffice ships Windows x64 only.

Upstream also added AI providers in this range (Gemini fixes, OpenCode Zen, Go, and a
Tavily web-search fallback). These do not apply to OxeeOffice, which routes all AI
through Oxeegen and uses Brave for search.

### Oxeegen layer

- The forced 65536-token output cap has been **retired**: upstream `v0.8.1039` turned
  this into a real setting with a Settings control, so OxeeOffice now uses the upstream
  control instead of patching the value. Raise it in Settings if you need more than the
  32768-token default.
- The remaining Oxeegen customisations — Oxeegen endpoint and model list, no sign-in,
  image generation, vision, Brave search, native deck building, branding and disabled
  auto-update — carry forward unchanged.

---

## OxeeOffice 0.8.21

**Upstream: [GenOffice v0.8.262](https://github.com/genspark-ai/genoffice/releases/tag/v0.8.262)** (2026-08-25) · Windows x64

First widely distributed OxeeOffice build. Establishes the Oxeegen layer:

- Chat routed to Oxeegen `/v1/chat/completions`, with a per-user region endpoint (EU/US).
- Model dropdown populated live from Oxeegen `/v1/models`, filtered to chat-capable models.
- GenSpark sign-in removed — no accounts, one shared organization key.
- Response cap raised from 8192 to 65536 tokens, so long answers are no longer truncated.
- Image generation and vision wired to the Oxeegen configuration; Brave Search ahead of the stock provider chain.
- Native slide-deck building unblocked; agent turn limit raised from 24 to 120.
- OxeeOffice branding: application and per-file-type icons, product name, links to oxeegen.com.
- Auto-update disabled, so an upstream update cannot silently revert the Oxeegen layer.

---

## Upstream releases covered

| Upstream | Date | Headline |
|---|---|---|
| [v0.10.488](https://github.com/genspark-ai/genoffice/releases/tag/v0.10.488) | 2026-09-16 | MCP support, more CLI operations, Docs export as images |
| [v0.10.63](https://github.com/genspark-ai/genoffice/releases/tag/v0.10.63) | 2026-09-13 | Command line + agent skill, Zotero citations, Sheets print with charts |
| [v0.9.431](https://github.com/genspark-ai/genoffice/releases/tag/v0.9.431) | 2026-09-09 | New HTML app, global AutoSave, find and replace in PDF/Markdown |
| [v0.9.10](https://github.com/genspark-ai/genoffice/releases/tag/v0.9.10) | 2026-09-06 | Collapsible ribbon, faster large documents, PDF AI tools, ARM64 stable |
| [v0.8.1360](https://github.com/genspark-ai/genoffice/releases/tag/v0.8.1360) | 2026-09-05 | Windows on Arm preview *(not shipped in OxeeOffice)* |
| [v0.8.1039](https://github.com/genspark-ai/genoffice/releases/tag/v0.8.1039) | 2026-09-03 | Dark page in Docs, Slides font/picture fidelity, Sheets page-setup fixes |
| [v0.8.970](https://github.com/genspark-ai/genoffice/releases/tag/v0.8.970) | 2026-09-02 | Format-preserving AI edits, workbook merge, WordArt warp |
| [v0.8.667](https://github.com/genspark-ai/genoffice/releases/tag/v0.8.667) | 2026-08-30 | Slides RTL, floating-table overhaul, 2× faster large copies |
| [v0.8.440](https://github.com/genspark-ai/genoffice/releases/tag/v0.8.440) | 2026-08-27 | Reliable Sheets AI edits, drag-and-drop open, Docs layout fidelity |
| [v0.8.358](https://github.com/genspark-ai/genoffice/releases/tag/v0.8.358) | 2026-08-26 | CSV support, Excel chart/pivot fidelity, DOCX image anchoring |
| [v0.8.262](https://github.com/genspark-ai/genoffice/releases/tag/v0.8.262) | 2026-08-25 | Baseline for OxeeOffice 0.8.21 |
