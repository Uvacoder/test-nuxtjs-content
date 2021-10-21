import { defineNuxtModule, addServerMiddleware } from '@nuxt/kit'
import { resolve } from 'upath'
export default defineNuxtModule({
  name: 'content',
  defaults: {
    dir: 'content'
  },
  setup (options, nuxt) {
    // Only expose to server middleware/api
    nuxt.options.privateRuntimeConfig.content = {
      ...options
    }

    nuxt.hook('nitro:context', (ctx) => {
      ctx.storage.mounts.content = {
        // Prod TODO: unstorage driver for nitro assets
        driver: 'fs',
        driverOptions: {
          base: resolve(nuxt.options.rootDir, 'content')
        }
      }
    })

    addServerMiddleware({
      path: '/_content',
      handle: require.resolve('./api')
    })
  }
})
