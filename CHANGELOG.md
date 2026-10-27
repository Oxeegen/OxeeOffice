# Changelog

What changed in each OxeeOffice release. Installers are on the
[Releases](https://github.com/Oxeegen/OxeeOffice/releases) page.

---

## OxeeOffice 0.12.115 — 2026-10-26

Windows x64, Linux x64

### New in the editors

- **Docs:** a **Mailings** tab merges a local data source into letters, envelopes and
  labels; compare two documents into a tracked-changes redline; bullets, numbering and
  indents inside text boxes and shapes; accepting or rejecting a formatting change no
  longer leaves residue; inline equations no longer pick up the first-line indent.
- **Sheets:** password-protected workbooks open, save and can change their password;
  pictures in notes; standard deviation and variance in PivotTable Summarize By; hide
  cells from the AI; superscript and subscript display properly; many more Excel
  shortcuts (Shift+Home, Ctrl+Shift+*, Ctrl+2/3/4, Ctrl+Shift+Enter, Alt+↓ and others).
- **Slides:** A4/A3 paper sizes, portrait and custom slide sizes; an editing ribbon for
  the slide master; a save interrupted midway leaves the previous file intact.
- **PDF:** add and edit links (Edit ▸ Link); a comments panel listing every note;
  match-case and whole-word search; text and images drawn through reusable page
  elements can now be selected and edited.
- **Markdown:** footnotes, `==highlight==`, word and character counts in the status bar,
  and clicking a link to a missing note creates it.
- **HTML:** the AI can search for and generate images; justify alignment.

### App

- **Settings ▸ General ▸ Reopen documents from last time** brings back the documents that
  were open when you quit.
- **Settings ▸ About ▸ Check for updates automatically** can be turned off; **Help ▸
  Check for Updates** still works.
- Turkish interface; the Home sidebar can be resized by dragging its edge; no white
  flash while a window loads.
- **Linux:** `.deb` and `.rpm` installs now set up the sandbox helper and the AppArmor
  profile that Ubuntu 24.04 and later need to start the app.

### Oxeegen AI

Unchanged: Oxee models with the picker in every AI panel, slide pages generated one at a
time with reasoning off, layout checks and long writing with reasoning off, Brave search,
and OpenAI `gpt-image-2.5-flare` images, now also in the HTML editor.

---

## OxeeOffice 0.12.29 — 2026-10-22

Windows x64, Linux x64

### Ask AI on Home

- **Builds and edits real files:** ask for a document, spreadsheet or deck and Ask AI
  creates it through the bundled command line, with a task card and labelled tool steps;
  attach files to a question.
- **Conversations are kept** across restarts and listed at the top of the panel: start a
  new one, go back to an earlier one, or delete it.
- The model picker chip sits in the Ask AI composer, as in every editor.

### Skills

- **Settings ▸ Skills:** import a document skill from a folder, a zip or a single
  `SKILL.md`, or pick from 40 recommended ones (business plan, meeting minutes, NDA,
  lesson plan, budget planner and more). The composer menu attaches a skill to a request.
  Importing a skill never runs anything.

### New in the editors

- **Docs:** page breaks land where Word puts them on many more documents; Ctrl+click adds
  another selection range; drag a table row's border to set its height and the corner
  handle to resize the table; edit header and footer table cells in place and insert
  pictures there; the AI and the command line can read and set the document's properties
  (title, author, company, custom fields), for example to clear them before sharing.
- **Sheets:** embed a picture in a cell; VLOOKUP over a table or name no longer goes blank
  after a save; CSV export writes the real values; the status bar shows Sum and Average
  again; password-protected workbooks are reported as such; large workbooks open with
  much less memory.
- **Slides:** **Slide Show ▸ Record** narrates the show slide by slide; real 3D models,
  stored as PowerPoint stores them; charts carry their workbook, so PowerPoint's Edit Data
  works; chart labels, data tables and legends match PowerPoint.
- **Markdown:** `[[` note completion, `![[embeds]]`, a backlinks panel and a graph view
  of your notes; a file reloads when another program changes it.
- **PDF:** signing with Windows certificate-store keys works in place, and visible
  signatures verify in Acrobat.
- **App:** the window remembers its position and size; **Settings ▸ General ▸ Sleep
  inactive tabs** frees the memory of tabs you have not looked at for a while (never
  pinned or unsaved ones); one **Settings** entry (Ctrl+,) in every app's menu; on Linux,
  `.deb` and `.rpm` installs keep each file type's own icon.
- **Search:** Keenable is available as a web-search backend.

### Oxeegen AI

Unchanged: Oxee models with the picker in every AI panel, slide pages generated one at a
time with reasoning off, layout checks and long writing with reasoning off, Brave search,
and OpenAI `gpt-image-2.5-flare` images. Ask AI uses the same Oxeegen settings.

---

## OxeeOffice 0.11.829 — 2026-10-15

Windows x64, Linux x64

### Open OpenDocument files

- **`.odt`, `.ods` and `.odp`** (and the `.ott`/`.ots`/`.otp` templates) open in Docs,
  Sheets and Slides as editable Word, Excel and PowerPoint copies. The original file is
  never changed. Text, headings, lists, tables and images carry over in documents;
  values, formulas and dates in spreadsheets. Footnotes, comments, text boxes, cell
  styles, column widths and charts are not fully kept.

### AI

- **Docs:** the AI can draw an interactive mind map of the document, like Markdown's;
  hide a selection from the AI, as in Markdown and HTML.
- **Turn the AI panel off:** Settings ▸ General ▸ **Show the AI sidebar**. When off, the
  editors hide the AI panel and its side button; an AI action in the ribbon or a menu
  still opens the panel, and new documents never open it.

### New in the editors

- **Tabs:** right-click a tab to save, print, rename, duplicate the saved file, split
  side by side, copy the path or file name, show it in its folder, open it with the
  default app, move it, close other tabs or tabs to the right, or reopen a closed tab;
  hover a tab to see the file's path.
- **Docs:** the status bar shows selected/total words while text is selected, like
  Word; saving keeps the font you were typing with; mail-merge templates keep their
  fields when opened.
- **Markdown:** `[[wiki links]]` resolve to your notes and open on click, including
  `[[note|alias]]`, `[[note#heading]]` and block links.
- **Sheets, Slides and PDF:** the compact icon-only ribbon (Ctrl+Alt+K), as in Docs.
- **Windows:** restoring the window from the taskbar keeps the documents' views.

### Oxeegen AI

Unchanged: Oxee models with the picker in every AI panel, reasoning off for slides,
layout checks and long writing, Brave search, and OpenAI `gpt-image-2.5-flare` images.

---

## OxeeOffice 0.11.727 — 2026-10-13

Windows x64, Linux x64

### AI

- **Token usage:** every AI panel, and Ask AI on Home, shows the tokens each reply used
  and a running total for the session.
- **Ask AI:** save an answer as a Markdown or Word document; a start screen explains how
  to build the knowledge base when no file is starred yet.
- **Markdown:** the AI can draw an interactive mind map of the document, with branches
  you can collapse, citations back to the text and PNG export.
- **Custom endpoints:** each one can set its protocol, compatibility switches (omit
  temperature, echo reasoning, `max_completion_tokens`, vision), extra headers, an idle
  timeout, a key read from an environment variable, and declared models.

### New in the editors

- **Docs:** export as Markdown, images included; the print dialog chooses the printer,
  copies, collation and two-sided printing; table-of-contents and bookmark links work in
  PDF exports; damaged column settings no longer squeeze pages into slivers; the compact
  ribbon no longer cuts off its buttons.
- **Markdown:** paper themes — Notion (light and dark), Drake, Blubook, Nord and
  Newsprint; `.txt` and `.json` files fill the window again.
- **Sheets:** a View-tab switch for a right-to-left grid; fonts load for the workbook you
  open instead of all at start.
- **App:** **View ▸ Interface Zoom In / Out** (Ctrl+Alt+= / Ctrl+Alt+-) enlarges the tab
  bar and the Sheets toolbar up to 150%, separately from the document zoom; the other
  editors follow later. Files the AI fetches from the web connect only to the address
  that was checked as safe.

### Oxeegen AI

Unchanged: Oxee models with the picker in every AI panel, reasoning off for slides,
layout checks and long writing, Brave search, and OpenAI `gpt-image-2.5-flare` images.
Streamed replies now ask the server for their token count, which is what the new usage
display shows; no sampling setting is sent.

---

## OxeeOffice 0.11.564 — 2026-10-11

Windows x64, Linux x64

### Ask your starred files

- **Ask AI on Home:** ask a question about your starred files without opening them. The
  AI searches and reads them with your AI settings, and the answer cites the file and
  folder it came from; click a citation to open that file. The conversation is not kept
  after you quit.

### New in the editors

- **PDF:** sign with a certificate from a `.p12`/`.pfx` file or from the system store (the
  Windows certificate store; the NSS store on Linux), and check the signatures in a file.
  Date fields work like Acrobat's: a date typed in another layout is rewritten in the
  field's format, and a calendar button opens a date picker.
- **Sheets:** filters work on workbooks too large to load in full; the AutoFilter button
  looks like Excel's; Ctrl+←/→ moves word by word in the cell editor and formula bar;
  large workbooks finish loading before printing or PDF export.
- **Slides:** Ctrl+drag duplicates shapes; moving, resizing or rotating several shapes is
  one undo step; Escape cancels a resize; a selection drag released outside the slide
  ends cleanly.
- **Docs:** with track changes on, splitting a paragraph with Enter no longer shows a
  deleted copy of it (rejecting that copy could damage the document); a page break
  inside a table cell turns the page; a style template can set separate East Asian and
  Latin fonts.
- **AI:** messages sent while the AI is still replying are queued and run in turn, in
  every editor; hide a Markdown selection from the AI.
- **App:** the user manual opens from **Help ▸ User Guide** or **F1** (no longer from the
  sidebar); OxeeOffice is offered for `.txt` and `.json` files; a torn-off tab dragged to
  the edge of the screen no longer fails to move.

### Oxeegen AI

Unchanged: Oxee models with the picker in every AI panel, reasoning off for slides,
layout checks and long writing, Brave search, and OpenAI `gpt-image-2.5-flare` images.
Ask AI uses the same Oxeegen settings.

---

## OxeeOffice 0.11.505 — 2026-10-09

Windows x64, Linux x64

### User manual

- **An illustrated user manual is built in:** open **User Guide** on Home or press **F1**.
  It covers every editor, the AI panel, the command line and agents, with search and
  pictures of the app. The pages about OxeeOffice's own setup — installing, Oxeegen AI
  models, the Home screen and Settings — are written for OxeeOffice, in English and
  French; other languages read the English version of those four.

### New in the editors

- **PDF:** a Form Design tab to create fillable text, checkbox, radio, drop-down, date
  and signature fields, edit saved fields, and detect fields from blanks, boxes and label
  gaps; inserting a blank page can be undone; right-click between thumbnails to insert
  pages.
- **Docs:** a Multiple Pages view under View › Zoom; first-line indents measured in
  characters that follow the font size; floating tables anchored to the page lay out
  like Word.
- **Sheets:** large workbooks with formatted empty cells can be filtered again.
- **AI:** keep several custom endpoints and switch between them; hide a selection in
  HTML or a span in Slides from the AI.
- **App:** middle-click closes a tab; starred files can be grouped under names, and
  removing several stars at once works; the keyboard shortcuts listed in the menus all
  work.

### Oxeegen AI

Unchanged: Oxee models with the picker in every AI panel, reasoning off for slides,
layout checks and long writing, Brave search, and OpenAI `gpt-image-2.5-flare` images.

---

## OxeeOffice 0.11.411 — 2026-10-08

Windows x64, Linux x64

### Model picker and windows

- **The model picker moved to the message box** at the bottom of every AI panel. It
  shows the Oxee model in use, switches between Oxee Max, Pro, Flash and Instant, and
  ends with **Manage models…**, which opens Settings → AI Model. A change applies in
  every open editor at once. The panel header shows the Oxee mark and "Oxeegen".
- **Detached windows dock back:** drag a tab off the strip to give it its own window,
  then drag that window back onto the strip to make it a tab again, at the place you
  drop it. Every editor detaches, by dragging or from the tab's right-click menu.

### New in the editors

- **Sheets:** a PivotTable Fields pane with report filters and every summary and
  show-as mode; an Excel-style Function Arguments dialog; Paste Special; Print with
  preview; a Table Design tab with Ctrl+T; worksheet protection with Excel-style
  permissions and passwords; threaded comments; Excel-style context menus for cells,
  headers and sheet tabs, with Pick From Drop-down List. Large workbooks load up to a
  million cells, and edits made during a save carry into the reopened file.
- **Docs:** line heights and baselines match Word, including East Asian text; floating
  tables, cell borders, display equations and Symbol/Wingdings bullets render like Word;
  tracked deletions leave the text flow in every markup view; the Arrange group on the
  Shape Format tab; a dark page you choose is remembered.
- **Markdown:** a source view, and your own image host for pasted pictures.
- **Slides:** speaker notes you are drafting survive an AI edit of the deck.
- **App:** a runaway file can no longer exhaust memory while Home indexes your folders;
  switching the update channel discards a stale download; muted text meets accessibility
  contrast guidelines; Russian strings.

### Oxeegen AI

Slides, layout checks and long writing still run with reasoning off, Brave search and
OpenAI `gpt-image-2.5-flare` images are unchanged. Exa and Firecrawl join the search
options for anyone using their own key.

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
