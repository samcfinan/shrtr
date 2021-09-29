import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator'
import { customAlphabet } from 'nanoid'
import { lowercase, numbers } from 'nanoid-dictionary'
import { Validator } from '@cfworker/json-schema'

// Cloudflare K/V
declare const KEYS: KVNamespace
// Env vars
declare const BASE_URL: string

const nanoid = customAlphabet(lowercase + numbers, 16)

enum Modes {
  IDENTIFIABLE = 'identifiable',
  RANDOM = 'random',
}
interface RequestBody {
  mode: Modes
  url: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Max-Age': '86400',
}

const validator = new Validator({
  type: 'object',
  required: ['mode', 'url'],
  properties: {
    mode: {
      type: 'string',
      enum: [Modes.IDENTIFIABLE, Modes.RANDOM],
      nullable: false,
    },
    url: {
      type: 'string',
      nullable: false,
    },
  },
})

export async function handleRequest(request: Request): Promise<Response> {
  try {
    const body: RequestBody = await request.json()
    const validation = validator.validate(body)

    const { mode, url } = body

    let key: string

    // Check if key already exists, if so, regenerate
    let exists = false
    do {
      key = generateKey(mode)
      const record = await KEYS.get(key, { type: 'text' })
      exists = record !== null
    } while (exists)

    await KEYS.put(key, url)

    const shortenedURL = `${BASE_URL}/${key}`

    const res = new Response(
      JSON.stringify({ mode, url, key, shortenedURL, validation }),
      {
        headers: { 'content-type': 'application/json', ...corsHeaders },
      },
    )
    return res
  } catch (err) {
    return new Response(JSON.stringify({ error: err }), {
      headers: { 'content-type': 'application/json', ...corsHeaders },
    })
  }
}

const generateKey = (mode: Modes): string => {
  if (mode === Modes.IDENTIFIABLE) {
    return uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      length: 3,
      separator: '',
    })
  } else {
    return nanoid()
  }
}