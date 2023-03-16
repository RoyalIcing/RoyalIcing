import { serve } from "https://deno.land/std@0.159.0/http/server.ts";
import { serveRequest } from "npm:@collected/press-server";

const port = 4328;

const handler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);

  // TODO: put this into collected press itself?
  if (url.pathname.startsWith("/unpkg.com/modern-normalize@")) {
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

  return await serveRequest("RoyalIcing", "RoyalIcing", url);
};

console.log(`HTTP webserver running. Access it at: http://localhost:${port}/`);
await serve(handler, { port });
