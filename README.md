<p align="center">
  <img src="brand/assets/icon.png" alt="OxeeOffice" width="120" />
</p>

<h1 align="center">OxeeOffice</h1>

<p align="center">
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20Linux-lightgrey?style=flat" alt="Platform" />
  <img src="https://img.shields.io/badge/models-Oxeegen-5E4AF5?style=flat" alt="Oxeegen models" />
  <a href="https://github.com/genspark-ai/genoffice"><img src="https://img.shields.io/badge/based%20on-GenOffice-3178c6?style=flat" alt="Based on GenOffice" /></a>
  <img src="https://img.shields.io/badge/license-Apache--2.0-08C?style=flat" alt="License: Apache-2.0" />
</p>

<p align="center">
  Oxeegen's AI office suite — documents, spreadsheets, slides, PDF, Markdown and HTML on the desktop,<br/>
  running on <strong>Oxeegen's self-hosted AI models</strong>.
</p>

<h3 align="center"><a href="https://github.com/Oxeegen/OxeeOffice/releases/latest"><ins>Download the latest release</ins></a></h3>

---

**OxeeOffice** is a full office suite with an AI agent in every editor. It opens and saves
real `.docx`, `.xlsx`, `.pptx` and `.pdf` files, so it drops into an existing Microsoft
Office workflow without converting anything.

> OxeeOffice is a fork of **[GenOffice](https://github.com/genspark-ai/genoffice)**
> (Apache-2.0) by Mainfunc, Inc. Upstream releases are merged in and the Oxeegen layer
> in [`brand/`](brand/README.md) is kept on top. See [Built on GenOffice](#built-on-genoffice).

## Download

Installers are on the [**Releases**](https://github.com/Oxeegen/OxeeOffice/releases) page.

| Platform | File | Updates |
| --- | --- | --- |
| Windows x64 | `OxeeOffice-<version>-setup.exe` | Automatic |
| Linux (any distro) | `OxeeOffice-<version>.AppImage` | Automatic |
| Debian / Ubuntu | `oxeeoffice_<version>_amd64.deb` | `sudo apt install ./oxeeoffice_<version>_amd64.deb` |
| Fedora / RHEL | `oxeeoffice-<version>.x86_64.rpm` | `sudo dnf install ./oxeeoffice-<version>.x86_64.rpm` |

Installed apps check this repository's releases and offer each new version.

The installers are unsigned. On Windows, SmartScreen warns on first run: choose
**More info → Run anyway**. macOS is not built: without an Apple Developer certificate
Gatekeeper refuses the app.

API keys are never bundled: releases are public. Enter your Oxeegen key in
**Settings** after installing.

The OxeeOffice version tracks the upstream release it is built from. `0.10.488` is
built on upstream `v0.10.488`; a patch bump (`0.10.489`) is an Oxeegen-only fix.
Full history is in [CHANGELOG.md](CHANGELOG.md).

## Features

- **Documents** — full `.docx` editing with an AI agent that rewrites, restructures and reformats in place while preserving fonts, tables, borders and shading
- **Spreadsheets** — `.xlsx` with formulas, pivots, charts, conditional formatting, CSV import/export
- **Slides** — `.pptx` authoring with chart and WordArt fidelity and speaker notes
- **PDF** — annotation and AI tooling for watermarks, headers/footers, page reordering, metadata and form fields
- **Markdown** — editor with find and replace and Mermaid diagrams
- **HTML** — build visual pages or long-form documents with AI, restyle any element by clicking it, export to Word
- **Command line and MCP** — coding agents (Claude Code, Codex, Cursor, …) can create, convert and edit Office files locally through the bundled command line or MCP server
- **Vision, image generation and web search** — configured per capability in Settings

## What Oxeegen changes

| Area | Change |
| --- | --- |
| Branding | OxeeOffice name, icons and file-type icons throughout the app and installers |
| Updates | Delivered from this repository's GitHub Releases |
| Platforms | Windows x64 and Linux (AppImage, deb, rpm) |
| AI | Oxeegen inference as the default provider (being ported to the source fork — see below) |

### Porting status

Up to 0.9.431, OxeeOffice was produced by patching upstream's compiled application.
From 0.10.488 it is built from source. The branding, update and packaging layers are in
place; the Oxeegen AI integration from 0.9.431 (Oxeegen as the provider in every AI
settings pane, live model list, Brave search, the model picker in each editor) is being
moved into source. The current state is tracked in
[brand/README.md](brand/README.md#porting-status).

## Working on OxeeOffice

- [`brand/README.md`](brand/README.md) — how the fork is structured, every hook into
  upstream files, releasing, and taking a new upstream release
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — setup, checks and pull requests

## Built on GenOffice

OxeeOffice is a derivative work of **[genspark-ai/genoffice](https://github.com/genspark-ai/genoffice)**,
the open-source AI office suite by Mainfunc, Inc., licensed under Apache-2.0.
Document handling, file fidelity and the editors themselves are upstream's work.

OxeeOffice is not affiliated with, endorsed by, or supported by Mainfunc, Inc. or
GenSpark. **Report OxeeOffice problems here, not upstream.**

## License

[Apache-2.0](LICENSE), inherited from GenOffice. Attribution and third-party notices
are in [NOTICE](NOTICE). The `ee/` directory is under a separate enterprise licence and
is not part of OxeeOffice builds.
