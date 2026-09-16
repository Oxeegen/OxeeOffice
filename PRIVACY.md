# OxeeOffice Privacy

Last updated: September 16, 2026. Applies to OxeeOffice 0.10.488 and later, the
first releases built from this repository.

OxeeOffice opens, edits, saves and converts documents on your computer. Document
editing does not upload files anywhere.

## No usage analytics

OxeeOffice sends no usage analytics. The upstream code it is built from contains
an analytics reporter that only runs when a build is given analytics credentials;
OxeeOffice builds never are, and the release workflow refuses to publish a package
that carries them (`brand/scripts/verify-package.mjs`).

## What leaves your computer

The application makes these requests, for the reasons given:

| Destination | When | What is sent |
| --- | --- | --- |
| The AI provider you configured (Oxeegen by default) | When you use an AI feature | Your prompt and the document content the AI needs to answer it |
| Brave Search (`api.search.brave.com`), for the Oxeegen search entry — or the other search provider you configured, or DuckDuckGo if no search key is set | When the AI searches the web | The search query |
| The media provider you configured | When the AI generates or analyzes an image or video | The image or video and the instructions |
| The website hosting an image | When the AI inserts an image it found | A download request for that image |
| `github.com` / `api.github.com` | On launch and periodically, to check for updates; when the About page is open, for the repository's star count | Standard HTTPS request metadata; no document or account data |

Documents and HTML pages you open can also reference remote content, such as
linked images or web fonts, which is loaded when they are displayed.

OxeeOffice does not connect to Genspark. The upstream sign-in, cloud tools and
cloud projects are disabled, and a Genspark login or key present elsewhere on
the computer is ignored.

As with any HTTPS request, each recipient sees your public IP address and
connection metadata.

Your API keys are stored locally in the application's settings folder
(`%APPDATA%\OxeeOffice` on Windows, `~/.config/OxeeOffice` on Linux) and are sent
only to the provider they belong to.

## What is never sent

- documents, file names or file paths, except the content you ask the AI to work on
- usage statistics or telemetry
- account identity or email addresses

## The command line and MCP server

The bundled command line and MCP server run locally. Only the `search`, `image`
and `media` tools make network requests, to the provider configured in
OxeeOffice. `GENOFFICE_ALLOWED_ROOTS` restricts every tool to the folders you
list.

## Questions

Open an issue at <https://github.com/Oxeegen/OxeeOffice/issues>.
