import { defineEventHandler } from 'h3'
import { serverQueryContent } from '../storage'
import { createNav } from '../navigation'
import { ParsedContentMeta } from '../../types'
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
  const contents = await serverQueryContent(event, query)
    .where({
      /**
       * Partial contents are not included in the navigation
       * A partial content is a content that has `_` prefix in its path
       */
      _partial: false,
      /**
       * Exclude any pages which have opted out of navigation via frontmatter.
       */
      navigation: {
        $ne: false
      }
    })
    .find()
  pref.tick('end')

  pref.table('[Navigation] ' + JSON.stringify(query))

  const dirConfigs = await serverQueryContent(event).where({ _path: /\/_dir$/i, _partial: true }).find()

  const configs = dirConfigs.reduce((configs, conf) => {
    if (conf.title.toLowerCase() === 'dir') {
      conf.title = undefined
    }
    const key = conf._path.split('/').slice(0, -1).join('/') || '/'
    configs[key] = {
      ...conf,
      // Extract meta from body. (non MD files)
      ...conf.body
    }
    return configs
  }, {} as Record<string, ParsedContentMeta>)

  return createNav(contents as ParsedContentMeta[], configs)
})
