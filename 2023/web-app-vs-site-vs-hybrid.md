---
date: 2023-10-30
---

# Web App vs Site vs Hybrid

## Web site: primarily for reading

- URLs _must_ be shareable and bookmarkable.
- If you change a URL e.g. `/team` to `/about`, then the old URL _must_ 30x redirect to the new URL.
- HTML `<head>` _must_ be server rendered to provide to social networks and communication tools (e.g. Slack & Discord).
- HTML `<body>` _must_ be server rendered to provide to search engine crawlers and read-later services.
- This means that everything can be read with JavaScript turned off.
- HTML `<body>` _must_ have Aria landmarks, such as `main`, `nav`, `banner`, `form`, `search`.
- If the route is valid, then the HTTP status must be 2xx.
- `LCP`: The largest content should load within 4 seconds on slow 4G.

## Web app: primarily for interacting

- URLs _should_ be shareable and bookmarkable.
- If you change a URL e.g. `/team` to `/about`, then the old URL _should_ 30x redirect to the new URL.
- HTML `<head>` _must_ be server rendered to provide to social networks and communication tools (e.g. Slack & Discord).
- HTML `<body>` _can_ be browser rendered to provide interactive controls.
- HTML `<body>` _must_ have Aria landmarks, such as `main`, `nav`, `banner`, `form`, `search`.
- Even if the route is invalid (e.g. resource not found), the HTTP status can be 2xx. This allows HTTP streaming or JavaScript `fetch()` to come after the HTTP header have been sent.
- Loading data _must_ work on slow and spotty connections.
- Actions _should_ work on slow and spotty connections.

## Hybrid: both reading and interacting

Most web apps today are a hybrid. You might have a landing page, pricing page, documentation, a blog, sign up, sign in, and a dashboard with various sections.

Here’s how I’d break these routes down:

### Site: landing, pricing, documentation, blog.
- Will be shared and bookmarked by users.
- Must be server rendered.
- Can be enhanced with JavaScript e.g. interactive charts, playground in docs.

### App: sign in, sign up, dashboard with various sections.
- Can be shared by users, probably within a private circle e.g. work chat.
- Can be bookmarked by users.
- Can be browser (instead of server) rendered.