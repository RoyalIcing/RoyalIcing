import { serveRequest } from "@collected/press-server";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // TODO: put this into collected press itself?
    if (url.pathname.startsWith('/unpkg.com/modern-normalize@')) {
      return fetch(`https:/${url.pathname}`);
    }

    return await serveRequest('RoyalIcing', 'RoyalIcing', url);
  }
}
