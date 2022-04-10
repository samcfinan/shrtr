# Shrtr URL Shortener

### A basic, open source URL shortener built using [Solid.js](https://solidjs.com) and Cloudflare Workers

---

## But why?

Besides the opportunity to fiddle with new technologies, URLs are important. A shortlink sent by a legitimate company using a commercial service could be hijacked by the URL shortener to phish credentials. Enterprise companies often maintain their own URL shortening services as a measure of security.

The economics of Cloudflare Workers and K/V allow you to run your own for free, even at volume. Or you could use [shrtr.cloud](https://shrtr.cloud)

## Usage

1. Install & configure Wrangler.
2. Replace the values in the workers' `wrangler.toml` files with your Cloudflare zone ID, account ID, path, and K/V ID.
3. Deploy workers.
4. Deploy frontend to Cloudflare Pages or similar free static hosting.

## API

The workers are also accessible via a public API documented [here](./workers/shortener/index.html) and via an [OpenAPI spec](./workers/shortener/openapi.yaml).
