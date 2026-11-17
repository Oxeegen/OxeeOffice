# OxeeOffice Privacy

Last updated: November 17, 2026. Applies to OxeeOffice 0.10.488 and later, the
first releases built from this repository.

OxeeOffice opens, edits, saves and converts documents on your computer. Document
editing does not upload files anywhere.

## No usage analytics

OxeeOffice sends no usage analytics. The code base contains an analytics reporter
that only runs when a build is given analytics credentials; OxeeOffice builds never
are, and the release workflow refuses to publish a package that carries them
(`brand/scripts/verify-package.mjs`).

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

There is no OxeeOffice account. Sign-in, cloud tools and cloud projects are
disabled, and logins or keys that other applications keep on the computer are
ignored.

As with any HTTPS request, each recipient sees your public IP address and
connection metadata.

Your API keys are stored locally in the application's settings folder
(`%APPDATA%\OxeeOffice` on Windows, `~/.config/OxeeOffice` on Linux) and are sent
only to the provider they belong to.

## Search reranking (off by default)

File search runs on this computer: the index is built from your local files, is
queried locally and is never uploaded. If you turn on **Jev search reranking** in
Settings → AI Media & Search, a search with two or more hits whose judgement is
not already cached also sends one request to the decision-model endpoint you
selected. That request contains the query text and up to 20 excerpts (at most
1,200 characters each), each with its file name and the name of its parent
folder.

Excerpts are document content, so they leave the computer whenever reranking is
on. The request is capped at 24 KB and the reply at 1 MB; judgements are cached in
memory for 30 minutes. If the endpoint fails or times out, the local ranking is
used unchanged. A local endpoint (Kev, Rizzo Flow, or a custom URL on this
machine) keeps the request on the computer; a custom URL pointing at a server you
host sends the excerpts to that server. Turning reranking off stops these
requests.

## What is never sent

- documents, file names or file paths, except the content you ask the AI to work on
  and, when search reranking is on, the excerpts described above
- usage statistics or telemetry
- account identity or email addresses

## The command line and MCP server

The bundled command line and MCP server run locally. Only the `search`, `image`
and `media` tools make network requests, to the provider configured in
OxeeOffice. `GENOFFICE_ALLOWED_ROOTS` restricts every tool to the folders you
list.

## Questions

Open an issue at <https://github.com/Oxeegen/OxeeOffice/issues>.
