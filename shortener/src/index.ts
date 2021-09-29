import { handleRequest } from './handler'

addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method === 'OPTIONS') {
    event.respondWith(handleOptions(event.request))
    return
  }

  event.respondWith(handleRequest(event.request))
})

// Handle CORS preflight
async function handleOptions(request: Request): Promise<Response> {
  const headers = request.headers
  if (
    headers.get('Origin') !== null &&
    headers.get('Access-Control-Request-Method') !== null &&
    headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS pre-flight request.
    const respHeaders = new Headers()
    respHeaders.set('Access-Control-Allow-Origin', '*')
    respHeaders.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS')
    respHeaders.set('Access-Control-Max-Age', '86400')
    respHeaders.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
    )

    return new Response(null, {
      headers: respHeaders,
    })
  }
  return new Response(null, { status: 500 })
}
