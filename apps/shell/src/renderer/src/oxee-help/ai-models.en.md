# AI models and settings

## Providers and models

Models and keys are configured in Settings (the **Settings** button at the bottom left of Home):

![The Settings window](img/settings-general.png)

- **Oxeegen** is the default provider. In **Settings ▸ AI Model**, pick your region with **US** or **EU** (each region has its own keys), paste your Oxeegen API key, and the endpoint is filled in for you. The models are **Oxee Max** (default), **Pro**, **Flash** and **Instant**.
- **Switch model at any time** from the model chip at the bottom of any AI panel; the choice applies in every open editor. **Manage models…** at the end of its list opens this page of Settings.
- Oxee models run with their own server settings: OxeeOffice sends no temperature or output limit. Steps that carry out a plan — writing slides, checking slide layout, writing long documents — ask the model to answer without its reasoning pass, so they take seconds.
- **Custom endpoints (BYOK)**: Settings ▸ AI takes a base URL and API key per protocol — OpenAI-compatible, Anthropic, Gemini, DeepSeek, DashScope (qwen) and more. Keys are stored in the app's settings file on this machine and sent only in request headers.
- A different provider can be picked per capability under **Settings ▸ AI Media & Search**: web and image search run on **Brave** (paste a Brave API key into the Oxeegen search entry), image generation on **OpenAI** `gpt-image-2.5-flare` with your OpenAI key, and image and video analysis on Oxee models.
- **Connection test**: verify endpoint reachability and model visibility before saving.
- Base URLs may carry a path and query string (gateway-style); endpoint paths are appended correctly.

## CLI integration (Codex-class)

- Settings accept a local CLI program path (non-ASCII home directories and a ~ prefix work; ~ is expanded automatically); Detect models probes the CLI's available models.
- Validation checks existence only — no charset restrictions.

## When changes apply

- Model and endpoint changes apply immediately; an in-flight conversation keeps the old configuration until its next turn.
