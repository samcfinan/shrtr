import NotFound from './404'

// Cloudflare K/V
declare const KEYS: KVNamespace

export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const key = url.pathname.replace('/', '')

  const originalURL = await KEYS.get(key)
  if (originalURL !== null) {
    return Response.redirect(originalURL, 301)
  }
  return new Response(NotFound, { status: 404 })
}
