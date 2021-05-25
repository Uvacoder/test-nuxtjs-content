import { createError } from 'h3'
import transformMarkdown from './transformers/markdown'
import { storage } from '#storage'

const transformers = {
  default: (body = '') => ({ body, meta: {} }),
  '.md': transformMarkdown,
  '.json': (body = '') => ({ body: JSON.parse(body) })
}

const exts = Object.keys(transformers)

export default async (req) => {
  const key = '/content' + req.url
  const rawContent = await storage.getItem(key)

  if (!rawContent) {
    throw createError({ statusCode: 404, statusMessage: `Content not found: ${key}` })
  }

  const transformer = transformers[exts.find(ext => key.endsWith(ext)) || 'default']
  const result = await transformer(rawContent)

  return {
    // Avoid mutating transformer result
    ...result.meta,
    key,
    generatedAt: new Date(),
    body: result.body
  }
}
