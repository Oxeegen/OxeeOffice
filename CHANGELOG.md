# Changelog

What changed in each OxeeOffice release. Installers are on the
[Releases](https://github.com/Oxeegen/OxeeOffice/releases) page.

---

## OxeeOffice 0.11.0 — 2026-10-05

Windows x64, Linux x64

### New in the editors

- **Docs:** large documents with many sections open without maxing out the processor,
  and a watchdog offers to close a document that runs away.
- **Sheets:** statistics in the status bar, Excel-style; a new spreadsheet gets its file
  when you first save it instead of in the default folder.
- **Slides:** shapes can be flipped horizontally and vertically; a cancelled deck no
  longer reports its pages as done.
- **Markdown and HTML:** escaped currency signs are no longer read as maths.
- **App:** Vietnamese interface (some new strings still appear in English); the Linux
  `.rpm` installs alongside other apps without file conflicts.
- **AI:** Serply joins the web and image search options for anyone using their own key.
- **Under the hood:** a large batch of engine fixes across the editors.

### Oxeegen AI

Unchanged: Oxee models with the picker in every editor, reasoning off for slides, layout
checks and long writing, Brave search, and OpenAI `gpt-image-2.5-flare` images. Dragging
a tab out of the strip still opens it in its own window, for every editor.

---

## OxeeOffice 0.10.1467 — 2026-09-27

Windows x64, Linux x64

### New in the editors

- **Docs, a big step towards Word:** spelling suggestions and AutoCorrect; Find & Replace
  with wildcards and regular expressions; a Navigation pane; rich header and footer
  editing; ruler handles for indents and margins; the advanced tabs of the Font and
  Paragraph dialogs; list numbering tools; table Design and Layout groups on the ribbon;
  the Simple Markup review view; zoom from 10 to 500%; many layout fixes for Asian text,
  tables, floating pictures and page breaks.
- **Sheets:** Ctrl + drag on the fill handle fills a series from a single number;
  lowercase formula references shift correctly.
- **Slides:** the layout check also flags elements that sit off the slide or are
  stretched; long presentations use less memory.
- **Markdown and HTML:** Word export embeds SVG, WebP, BMP, AVIF and online pictures;
  single-file HTML export keeps stylesheets and fonts.
- **App:** a setting to make OxeeOffice the default app for Office documents; the ribbon
  collapses like Word's; settings are written safely even if the computer stops
  mid-save; accessibility fixes for find panels, comments and colour grids.
- **AI:** an AI edit whose instructions arrive incomplete is retried instead of failing;
  secrets are removed from more places before anything is logged.
- **Command line and agents:** one command registers OxeeOffice's tools with coding
  agents; fill `{{placeholders}}` in Word, PowerPoint and Excel templates; read PDF text
  without opening the app.

### Reliability

- A damaged or hand-edited settings file no longer stops OxeeOffice from starting; it
  falls back to the defaults.

### Oxeegen AI

Unchanged: Oxee models with the picker in every editor, reasoning off for slides, layout
checks and long writing, Brave search, and OpenAI `gpt-image-2.5-flare` images.

---

## OxeeOffice 0.10.1038 — 2026-09-22

Windows x64, Linux x64

### Windows of your own

- **Drag a tab down out of the strip** to give that document its own window. Pull it
  back up and it stays where it was. The tab's right-click menu still offers
  **Open in New Window**.
- **Every editor can be detached** — documents, spreadsheets, presentations, PDFs,
  Markdown and HTML — not just documents and spreadsheets. Running a slideshow from a
  detached window fills the screen from that window and leaves the main one alone.

### New in the editors

- **Search from Home:** names, folders and the full text of your Word, Excel,
  PowerPoint, PDF, Markdown and HTML files, from a local index, Chinese, Japanese and
  Korean included.
- **Slides:** charts much closer to PowerPoint — pie of pie, logarithmic and date axes,
  per-point labels, axis titles, legend order, chart fonts; 3D bevel lighting; Korean
  line breaking; tight text boxes stay draggable; curved arrows fit their box.
- **Docs:** large documents open and type faster; EMF pictures render correctly; the
  cursor lands in the document when it opens; saving a new document into a Home folder
  works on the second save.
- **Sheets:** cross-sheet references imported without quotes are repaired; print titles
  are clamped to a sane range.
- **App:** add any folder to the Home tree as an extra root; custom OpenAI-compatible
  endpoints list their own models; Test connection and Save stay in view in AI settings;
  large remote media downloads stop at the size cap while streaming.
- **Under the hood:** another round of input-validation and bounds fixes across file
  parsing, the internal message channels and AI paths.

### Oxeegen AI

Unchanged: Oxee models with the picker in every editor, reasoning off for slides, layout
checks and long writing, Brave search, and OpenAI `gpt-image-2.5-flare` images. Web
search gains a Parallel option for anyone using their own key instead of Oxeegen's.

---

## OxeeOffice 0.10.915 — 2026-09-22

Windows x64, Linux x64

### New in the editors

- **Slides:** keyboard shortcuts, mouse modifiers, context menus and insert sizes match
  PowerPoint; Edit Points, Section and Summary Zoom, Save as Picture, and media
  animations during the show; PDF export writes sharp vector pages with searchable text.
- **Docs:** long documents open in stages and stay editable while the rest loads, with
  typing and page switching several times faster; separate East Asian and Latin fonts;
  the AI can see the pictures in the document and edit footnotes in place; the outline
  picks up headings numbered by style.
- **Sheets:** statistics in the status bar for streamed workbooks; the Format Cells
  dialog fits long labels.
- **Markdown:** tables, code fences and lists are written back exactly as they were;
  PNG export can span several pages.
- **PDF:** editing text no longer covers the page; areas can be redacted permanently.
- **App:** a tab can be detached into its own window; Ctrl + mouse wheel zooms in steps;
  the Windows Explorer New menu offers Office documents; update prompts appear again in
  the background.
- **Under the hood:** dozens of input-validation and bounds fixes across file parsing,
  the internal message channels and AI streams.

### Oxeegen AI

Unchanged from 0.10.639: Oxee models with the picker in every editor, reasoning off for
slides, layout checks and long writing, Brave search, and OpenAI `gpt-image-2.5-flare`
images.

---

## OxeeOffice 0.10.639 — 2026-09-17

Windows x64, Linux x64

### Updating

- **Installed 0.10.488 apps offer this version** on their own, and **Help → Check for
  Updates** now checks on demand. Settings, keys and history are kept.

### New in the editors

- **MCP over HTTP.** The command line's MCP server can also run as an HTTP server, so
  agents on another machine (a container, a sandbox, a shared box) use the same tools.
  Files travel with the calls: upload one, pass any file as a URL, and written files
  come back as download links. A token protects it. Agents can also read PDF text,
  edit the open document and drive the visible Sheets grid.
- **Docs:** documents full of pictures open lazily, so gigabyte files open in seconds;
  files over 512 MB are refused with a message instead of a crash; long documents open
  and type much faster; many Word-fidelity fixes for tables, anchored pictures and text
  boxes, header and footer spacing, chart labels, Japanese font substitution, italic and
  right-to-left text.
- **Markdown:** saving keeps unchanged blocks byte for byte and writes edited blocks in
  the document's own style; `wavedrom` code blocks render as timing diagrams.
- **Sheets:** smooth scrolling, and faster duplicate and large-range copy in big
  workbooks; context-menu submenus reopen reliably.
- **AI panel:** docks on either side of the editor.
- **App:** the Files pane inside the editors is gone; the Folders panel on Home remains.
- **Bring your own key:** DeepSeek V4.1 Flash, gpt-6-astra and Opper join the provider
  list.
- **PowerPoint files:** chart dates using the 1904 system, slide text in presentation
  order, and more files that parse cleanly.

### Oxeegen AI

Unchanged from 0.10.488: Oxeegen models with the picker in every editor, reasoning off
for slides, layout checks and long writing, Brave search, and OpenAI
`gpt-image-2.5-flare` images.

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
