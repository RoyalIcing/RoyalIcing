import { sourceFromGitHubRepo } from "@collected/press-server";

const allowedUnpkgPackages = ['modern-normalize', 'highlight.js'];

const contentSecurityPolicy = "default-src 'self'; font-src 'self' data:; img-src * data:; media-src *; style-src 'self' 'unsafe-hashes' 'unsafe-inline' https://cdn.jsdelivr.net; script-src 'self' https://cdn.usefathom.com";

const cacheKeys = Object.freeze({
  headSHA: "head sha",
  pathAndSHA: (path, sha) => `sha:${sha} ${path}`,
  pathLatest: (path) => `latest: ${path}`,
});

function addSHAToResponse(res, sha) {
  return new HTMLRewriter()
    .on('footer[role="contentinfo"] p', {
      element: (element) => {
        element.after(`<p><a href="https://github.com/RoyalIcing/RoyalIcing/tree/${sha}"><small>SHA: ${sha}</small></a></p>`, { html: true },)
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

    let strategy = "latest";

    if (url.pathname === "/blog") {
      strategy = "stale-while-revalidate";
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

    return addSHAToResponse(res, sha);
  }
}
