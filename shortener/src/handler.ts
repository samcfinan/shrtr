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

const nanoid = customAlphabet(lowercase + numbers, 6)

enum Modes {
  IDENTIFIABLE = 'identifiable',
  RANDOM = 'random',
}
interface RequestBody {
  mode: Modes
  url: string
}

const headers = new Headers()
headers.set('Access-Control-Allow-Origin', '*')
headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS')
headers.set('Access-Control-Max-Age', '86400')
headers.set('Content-Type', 'application/json')

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
    if (!validation.valid) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'err_validation',
            message: validation.errors,
          },
        }),
        {
          headers,
          status: 400,
        },
      )
    }

    const { mode } = body
    let { url } = body
    if (!url.startsWith('http')) {
      url = 'https://' + url
    }

    let key: string

    // Check if key already exists, if so, regenerate
    let exists = false
    do {
      key = generateKey(mode)
      const record = await KEYS.get(key, { type: 'text' })
      exists = record !== null
    } while (exists)

    await KEYS.put(key, url, { expirationTtl: 86400 })

    const shortenedURL = `${BASE_URL}/${key}`

    const res = new Response(JSON.stringify({ mode, url, key, shortenedURL }), {
      headers,
      status: 200,
    })
    return res
  } catch (err) {
    return new Response(JSON.stringify({ error: err }), {
      headers,
      status: 500,
    })
  }
}

const generateKey = (mode: Modes): string => {
  if (mode === Modes.IDENTIFIABLE) {
    return uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      length: 3,
      separator: '',
      style: 'capital',
    })
  } else {
    return nanoid()
  }
}
