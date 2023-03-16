import { serveRequest } from "@collected/press-server";

const allowedUnpkgPackages = ['modern-normalize', 'highlight.js'];

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // TODO: put this into collected press itself?
    if (allowedUnpkgPackages.some(name => url.pathname.startsWith(`/unpkg.com/${name}@`))) {
      return fetch(`https:/${url.pathname}`);
    }

    return await serveRequest('RoyalIcing', 'RoyalIcing', url);
  }
}
