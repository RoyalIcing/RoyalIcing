---
date: 2023-10-30
---

# Web App vs Site

## Web site: primarily for reading

- URLs _must_ be shareable and bookmarkable.
- If you change a URL e.g. `/team` to `/about`, then the old URL _must_ 30x redirect to the new URL.
- HTML `<head>` _must_ be server rendered to provide to social networks and communication tools (e.g. Slack & Discord).
- HTML `<body>` _must_ be server rendered to provide to search engine crawlers and read-later services.
- HTML `<body>` _must_ have Aria landmarks, such as `main`, `nav`, `banner`, `form`, `search`.
- `LCP`: The largest content should load within 8 seconds on slow 4G.

## Web app: primarily for interacting

- URLs _should_ be shareable and bookmarkable.
- If you change a URL e.g. `/team` to `/about`, then the old URL _should_ 30x redirect to the new URL.
- HTML `<head>` _must_ be server rendered to provide to social networks and communication tools (e.g. Slack & Discord).
- HTML `<body>` _can_ be browser rendered to provide interactive controls.
- HTML `<body>` _must_ have Aria landmarks, such as `main`, `nav`, `banner`, `form`, `search`.
- Loading data _must_ work on slow and spotty connections.
- Actions _should_ work on slow and spotty connections.
