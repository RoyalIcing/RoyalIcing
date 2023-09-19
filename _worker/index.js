import { sourceFromGitHubRepo } from "@collected/press-server";

const allowedUnpkgPackages = ['modern-normalize', 'highlight.js'];

const contentSecurityPolicy = "default-src 'self'; font-src 'self' data:; img-src * data:; media-src *; style-src 'self' 'unsafe-hashes' 'unsafe-inline' https://cdn.jsdelivr.net; script-src 'self' https://cdn.usefathom.com";

const cacheKeys = Object.freeze({
  headSHA: "head sha",
  pathAndSHA: (path, sha) => `sha:${sha} ${path}`,
  pathLatest: (path) => `latest: ${path}`,
});

function addSHAToResponse(res, url, sha) {
  // TODO: add link[rel=canonical]
  return new HTMLRewriter()
    .on('head title', {
      element: (element) => {
        const ogType = url.pathname === "/" ? "website" : "article";
        const ogImage = `http://cdn.lilapi.com/1/github/RoyalIcing?width=1200&amp;height=628&amp;t1=Royal+Icing%3A+A+delicious+tour+of+software+design&amp;t1-color=%23ed64a6&amp;t2-color=%23ed64a6&amp;website=icing.space&amp;author-name=Patrick+Smith`;
        element.after(`<meta property="og:type" content="${ogType}">`, { html: true });
        element.after(`<meta property="og:image" content="${ogImage}">`, { html: true });
        element.after(`<meta name="twitter:site" content="@royalicing">`, { html: true });
        element.after(`<meta name="twitter:card" content="summary_large_image">`, { html: true });
        element.after(`<meta name="twitter:image" content="${ogImage}">`, { html: true });
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

    let strategy = "latest";

    if (url.pathname === "/blog") {
      // strategy = "stale-while-revalidate";
      strategy = "last-known-sha";
    } else {
      strategy = "last-known-sha";
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

    const sha = await (strategy === "last-known-sha" ? lastKnownSHA : headSHAPromise);

    const cacheKey = cacheKeys.pathAndSHA(url.pathname, sha);
    let cachedContent = await env.swr_cache.get(cacheKey, { type: "stream" });
    let res = null;

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

    return addSHAToResponse(res, url, sha);
  }
}
