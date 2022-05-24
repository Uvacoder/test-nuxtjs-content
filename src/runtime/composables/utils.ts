import { withBase } from 'ufo'
import { unwrap, flatUnwrap } from '../markdown-parser/utils/node'
import { useRuntimeConfig, computed, useRoute } from '#imports'

export const withContentBase = (url: string) => withBase(url, '/api/' + useRuntimeConfig().public.content.base)

export const useUnwrap = () => ({
  unwrap,
  flatUnwrap
})

export const useLocaleRoute = () => {
  const { content } = useRuntimeConfig().public as any
  const route = useRoute()

  return computed(() => {
    if (content.locales.length) {
      const possibleLocale = route.path.split('/')[1]
      const hasLocaleInPath = content.locales.includes(possibleLocale)
      const locale = hasLocaleInPath ? possibleLocale : content.defaultLocale

      return {
        locale,
        path: hasLocaleInPath ? route.path.substring(locale.length + 1) || '/' : route.path
      }
    }
    return {
      locale: undefined,
      path: route.path
    }
  })
}
