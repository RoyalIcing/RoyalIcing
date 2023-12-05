import { sourceFromGitHubRepo } from "@collected/press-server";

const allowedUnpkgPackages = ['modern-normalize', 'highlight.js'];

const contentSecurityPolicy = "default-src 'self'; font-src 'self' data:; img-src * data:; media-src *; style-src 'self' 'unsafe-hashes' 'unsafe-inline'; script-src 'self' https://cdn.usefathom.com";

const htmlEntities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, entity => htmlEntities[entity]);
}

const cacheKeys = Object.freeze({
  headSHA: "head sha",
  pathAndSHA: (path, sha) => `sha:${sha} ${path}`,
  pathLatest: (path) => `latest: ${path}`,
});

async function addMetadataToResponse(res, url, sha, { title } = {}) {
  if (!title) {
    let foundTitleHTML = ''
    await new HTMLRewriter()
      .on('h1', {
        text(chunk) {
          foundTitleHTML += chunk.text
        },
      })
      .transform(res.clone())
      .text();
    // TODO: unescape all HTML entities:
    title = foundTitleHTML.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
  }

  // TODO: add link[rel=canonical]
  return new HTMLRewriter()
    .on('head title', {
      element: (element) => {
        element.setInnerContent(`${title} — Royal Icing`, { html: false });

        const ogType = url.pathname === "/" ? "website" : "article";
        const ogImageURL = new URL("https://cdn.lilapi.com/1/github/RoyalIcing?width=1200&height=628");
        ogImageURL.searchParams.set("t1", title);
        ogImageURL.searchParams.set("t1-color", "#ed64a6");
        // ogImageURL.searchParams.set("t2-color", "#ed64a6");
        ogImageURL.searchParams.set("website", "icing.space");
        ogImageURL.searchParams.set("author-name", "Patrick Smith");
        const ogImage = ogImageURL.toString();
        element.after(`\n<meta property="og:type" content="${escapeHTML(ogType)}">`, { html: true });
        element.after(`\n<meta property="og:image" content="${escapeHTML(ogImage)}">`, { html: true });
        element.after(`\n<meta name="twitter:site" content="@royalicing">`, { html: true });
        element.after(`\n<meta name="twitter:title" content="${escapeHTML(title)}">`, { html: true });
        element.after(`\n<meta name="twitter:card" content="summary_large_image">`, { html: true });
        element.after(`\n<meta name="twitter:image" content="${escapeHTML(ogImage)}">`, { html: true });
      },
    })
    .on('footer[role="contentinfo"] p', {
      element: (element) => {
        element.after(`<p>Built using <a href="https://github.com/cool-calm/collected-press">Collected Press</a>. <a href="https://github.com/RoyalIcing/RoyalIcing/tree/${sha}">View source (${sha.slice(0, 8)})</a></p>`, { html: true })
      },
    })
    .transform(res);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // TODO: put this into collected press itself?
    if (allowedUnpkgPackages.some(name => url.pathname.startsWith(`/unpkg.com/${name}@`))) {
      return fetch(`https:/${url.pathname}`, { cf: { cacheEverything: true } });
    }

    // TODO: add this to collected press.
    if (url.pathname !== '/' && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
      return new Response(null, {
        status: 301,
        headers: {
          location: url.toString()
        }
      });
    }

    let title = undefined;
    let strategy = "latest";

    if (url.pathname === "/blog") {
      title = "The Royal Icing Blog by Patrick Smith"
      // strategy = "stale-while-revalidate";
      strategy = "last-known-sha.stream";
      // strategy = "last-known-sha";
    } else {
      strategy = "last-known-sha";
    }

    if (url.searchParams.has("stream")) {
      strategy = "last-known-sha.stream";
    }

    if (url.pathname.startsWith("/nocache/")) {
      strategy = "nocache";
      url.pathname = url.pathname.replace(/^\/nocache/, "");
    }

    if (url.pathname.startsWith("/old-sha/")) {
      strategy = "last-known-sha";
      url.pathname = url.pathname.replace(/^\/old-sha/, "");
    }

    if (url.pathname.startsWith("/swr/")) {
      strategy = "stale-while-revalidate";
      url.pathname = url.pathname.replace(/^\/swr/, "");
    }

    const source = sourceFromGitHubRepo('RoyalIcing', 'RoyalIcing');
    let lastKnownSHA = await env.swr_cache.get(cacheKeys.headSHA);

    const headSHAPromise = source.fetchHeadSHA();
    // Stale-while-revalidate for the HEAD sha.
    ctx.waitUntil(headSHAPromise.then(headSHA => env.swr_cache.put(cacheKeys.headSHA, headSHA)));

    if (lastKnownSHA == null) {
      lastKnownSHA = await headSHAPromise;
    }

    const sha = await (strategy.startsWith("last-known-sha") ? lastKnownSHA : headSHAPromise);

    if (strategy === "last-known-sha.stream") {
      const [res, done] = await source.serveStreamedURL(url, { commitSHA: sha });
      ctx.waitUntil(done);
      // return res;
      return addMetadataToResponse(res, url, sha, { title })
    }

    if (strategy !== "nocache") {
      const res = await source.serveURL(url, { commitSHA: sha });
      return addMetadataToResponse(res, url, sha, { title });
    }

    let res = null;

    const cacheKey = cacheKeys.pathAndSHA(url.pathname, sha);
    let cachedContent = await env.swr_cache.get(cacheKey, { type: "stream" });

    if (cachedContent == null) {
      if (strategy === "stale-while-revalidate") {
        cachedContent = await env.swr_cache.get(cacheKeys.pathLatest(url.pathname), { type: "stream" });
      }

      const resPromise = source.serveURL(url, { commitSHA: sha });
      ctx.waitUntil(resPromise
        .then(res => res.clone().arrayBuffer())
        .then(content => {
          env.swr_cache.put(cacheKey, content);
          if (strategy === "stale-while-revalidate") {
            env.swr_cache.put(cacheKeys.pathLatest(url.pathname), content);
          }
        })
      );

      if (cachedContent == null) {
        res = await resPromise;
      }
    }

    if (cachedContent != null) {
      const mimeType = source.expectedMimeTypeForPath(url.pathname);
      res = new Response(cachedContent, { headers: { "content-type": mimeType, "content-security-policy": contentSecurityPolicy } });
    }

    return addMetadataToResponse(res, url, sha, { title });
  }
}
