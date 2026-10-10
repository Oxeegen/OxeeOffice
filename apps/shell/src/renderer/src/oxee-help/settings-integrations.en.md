# Settings, language, theme and MCP integrations

## Opening settings

The **Settings** button at the bottom left of Home opens the settings panel. It has five sections: AI Model, AI Media & Search, General, Integrations and About.

![Settings ▸ General, where language, theme and AutoSave live](img/settings-general.png)

AI model configuration has its own article; **AI Media & Search** is where you turn image generation, image analysis, video analysis, web search and local file search on per provider.

## Language

- The settings offer **21 UI languages**: English, Simplified Chinese, Japanese, Korean, French, German, Spanish, Thai, Indonesian, Russian, Arabic, Portuguese, Italian, Polish, Czech, Dutch, Malay, Hebrew, Hindi, Traditional Chinese, Vietnamese.
- Switching applies immediately and persists; the native menu bar rebuilds with the language.

## Theme

Light / Dark / System. System follows the OS appearance, and the editors re-skin in sync without flashing.

## General

OxeeOffice sends no usage statistics, so General has no switch for them.

- **AI sidebar position** (left or right), **AI panel text size**, and **Spell check in AI chat**.
- **Open the AI panel in new documents** — off, a new document starts with the panel collapsed and one click away.
- **Auto-save all documents** turns AutoSave on by default in every editor; you can still switch it off for one window.
- **Save Location** with a **Change** button, and **Default app for Office documents** to claim .docx / .xlsx / .pptx for OxeeOffice.

## AI Media & Search

Not switches — each capability picks the vendor that serves it, and a vendor's key and base URL are entered once and shared:

- **Web search**, **Image generation**, **Image analysis** and **Video analysis**, each with a provider, a model, a key and a base URL.
- **Local file search** runs on this machine. Under it, **Jev search reranking** is **off by default**. Switch it on and the excerpts of the top 20 local hits — up to 1,200 characters of each document, plus the file and folder names — are sent to TypeSafe's Jev model to be reordered by relevance. With it off, nothing leaves the device.

## About

- **Version**, the project's GitHub link and a **Star on GitHub** button.
- **Update Channel**: OxeeOffice publishes one channel, so Stable and Beta receive the same releases. When a newer release is published, OxeeOffice offers it; **Help ▸ Check for Updates** checks on demand.

## Default app bindings

Settings can register OxeeOffice as the handler for .docx / .xlsx / .pptx / .pdf and friends (platform-level default-app registration; confirm when prompted).

## Third-party notices and updates

- Help ▸ Third-party notices: the full OSS license inventory shipped with the app.
- Help ▸ Check for updates: triggers a manual check; a newer version prompts to install.

## MCP integration (for advanced users / AI clients)

**Integrations** is the pane that connects OxeeOffice to a coding agent, and it has its own article: Connecting a coding agent. The short version — pick a route (the command line, or MCP), follow that section, then start a new chat and ask.

![Settings ▸ Integrations: the three steps, then the skill rows and the MCP options](img/settings-integrations.png)

Under **Local HTTP server** the app can run the server itself — an enable switch, a port — and **Advanced** adds the health-check URL and the log file. It listens on localhost only.

## Command-line cheat sheet

| Command            | What it does               |
| ------------------ | -------------------------- |
| `genoffice <file>` | open a file                |
| `genoffice mcp`    | start the local MCP server |
| `genoffice --help` | every command and flag     |
