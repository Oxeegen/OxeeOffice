# Changelog

What changed in each OxeeOffice release. Installers are on the
[Releases](https://github.com/Oxeegen/OxeeOffice/releases) page.

---

## OxeeOffice 0.10.488 — 2026-09-16

Windows x64, Linux x64

### Automatic updates and Linux

- **Automatic updates.** Installed apps check this repository's releases and offer
  new versions: the Windows installer and the Linux AppImage update in place.
  Previous builds had updates switched off, so 0.10.488 is installed once by hand.
  On Windows it upgrades an existing OxeeOffice install in place, keeping its settings.
- **Linux.** AppImage, deb and rpm, alongside Windows.
- **OxeeOffice throughout.** Window and taskbar titles, dialogs, every UI language,
  the installer and the settings folder (`%APPDATA%\OxeeOffice`,
  `~/.config/OxeeOffice`) all say OxeeOffice.
- **Icons:** the app icon is OxeeOffice's purple one; file-type icons use the
  familiar colors (blue W, green X, red P, the PDF mark, M↓, <>), so documents are
  easy to tell apart.
- Built and published by GitHub Actions from a tag, with each package verified before
  release.

### New in the editors

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

### Oxeegen AI

- **Oxeegen is the provider** in Settings → AI Model and AI Media & Search, with
  **US / EU** buttons that fill in the endpoint. Only the API key needs pasting.
  Upgrading from 0.9.431 keeps your key, endpoint and model.
- **Model picker in every editor.** The top of each AI panel (Docs, Sheets, Slides,
  PDF, Markdown, HTML) switches between Oxee Max, Pro, Flash and Instant; the choice
  applies in every open tab.
- **Oxeegen models use their server settings.** OxeeOffice sends no temperature or
  output-token cap, and hides the Max output tokens field for Oxeegen.
- **Faster, consistent decks and documents.** Every AI step uses the model in the picker.
  It plans with reasoning on (the chat, Slides style and outline), then writes each slide,
  checks the layout and writes long Docs, Markdown and HTML content with reasoning off.
  Slides are written one after another, each matching the slides before it. Long chats
  are summarized with Oxee Instant. Every Oxee model can read images.
- **Web and image search on Brave**, behind the Oxeegen search entry.
- **Image generation on OpenAI** `gpt-image-2.5-flare` at medium quality, faster than
  `gpt-image-2` (which it replaces, also in saved settings); image and video analysis on
  any Oxee model (Pro by default).
- **Slide decks are built by Oxeegen** from a prompt, entirely on your machine.
- **No sign-in, account page, credits or cloud tools.** Logins that other applications
  keep on the computer are ignored.
- **No usage analytics**; the first-run slides and Settings no longer mention them.
- **Wider Markdown page**, so tables no longer squeeze into tall, narrow cells.

Not in this release: renaming the `genoffice` command line, MCP server and agent
skill to `oxeeoffice` (planned for 0.10.489), and the tab-bar theme toggle from
earlier builds.

---

## OxeeOffice 0.9.431

Windows x64

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

### Oxeegen AI

- **Oxeegen is now a first-class provider in the native Settings panes** — AI Model (chat), AI Search and AI Media — instead of separate Oxeegen rows on the Account page. Each capability is configured where the application expects it.
- **Video analysis is new.** Image and video analysis both run on Oxeegen Pro / Flash / Instant; previously only still images were supported.
- **Image generation on OpenAI** `gpt-image-2`, while Oxeegen has no image model.
- **Search on Brave.**
- The new HTML app uses Oxeegen like the other five.

Windows x64 only; there is no Windows on Arm build.

---

## OxeeOffice 0.9.10

Windows x64

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

### Oxeegen AI

- The output token cap is now the setting above rather than a fixed 65536 tokens.
  Raise it in Settings if you need more than the 32768-token default.
- Everything else — Oxeegen endpoint and model list, no sign-in, image generation,
  vision, Brave search, native deck building and in-app updates switched off — carries
  forward unchanged. All AI runs through Oxeegen.

Windows x64 only; there is no Windows on Arm build.

---

## OxeeOffice 0.8.21

Windows x64

First widely distributed OxeeOffice build:

- Chat on Oxeegen `/v1/chat/completions`, with a per-user region endpoint (EU/US).
- Model dropdown populated live from Oxeegen `/v1/models`, filtered to chat-capable models.
- No sign-in or accounts — one shared organization key.
- Responses of up to 65536 tokens, so long answers are not truncated.
- Image generation and vision on the Oxeegen configuration; web search on Brave Search.
- Native slide-deck building, with agent runs of up to 120 turns.
- Application and per-file-type icons; links to oxeegen.com.
- Updates are installed from the Releases page rather than from inside the app.
