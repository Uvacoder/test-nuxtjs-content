import { createError, defineEventHandler } from 'h3'
import { serverQueryContent } from '../storage'
import { getContentQuery } from '../../utils/query'

export default defineEventHandler(async (event) => {
  const query = getContentQuery(event)
  // @ts-ignore
  const pref: any = event.pref = {
    tick: (name) => {
      pref[name] = process?.hrtime ? process.hrtime.bigint() : Date.now()
    },
    table: (title) => {
      console.log(title)
      console.table({
        total: (pref.end - pref.start),
        list: (pref.getListEnd - pref.getListStart),
        parse: (pref.parseListEnd - pref.parseListStart),
        query: (pref.end - pref.parseListEnd)
      })
    }
  }
  pref.tick('start')
  const contents = await serverQueryContent(event, query).find()
  pref.tick('end')

  pref.table('[Query] ' + JSON.stringify(query))

  // If no documents matchs and using findOne()
  if (query.first && Array.isArray(contents) && contents.length === 0) {
    throw createError({
      statusMessage: 'Document not found!',
      statusCode: 404,
      data: {
        description: 'Could not find document for the given query.',
        query
      }
    })
  }

  return contents
})
