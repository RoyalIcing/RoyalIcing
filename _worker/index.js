import { serveRequest } from "@collected/press-server";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // TODO: put this into collected press itself?
    if (url.pathname.startsWith('/unpkg.com/modern-normalize@')) {
      return fetch(`https:/${url.pathname}`);
    }

    // if (url.pathname.startsWith('/2022/')) {
    //   url.pathname = url.pathname.replace(/^\/2022\//, "/blog/")
    //   return new Response(null, {
    //     status: 307,
    //     headers: {
    //       location: url.pathname // Not sure of host with CF Workers, so not putting the full URL.
    //     }
    //   })
    // }

    return await serveRequest('RoyalIcing', 'RoyalIcing', url);
  }
}
