import { serveRequest } from "@collected/press-server";

export default {
  async fetch(request) {
    return await serveRequest('RoyalIcing', 'RoyalIcing', new URL(request.url));
  }
}
