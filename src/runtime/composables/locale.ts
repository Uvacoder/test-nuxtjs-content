import { useRuntimeConfig, computed, useRoute } from '#imports'

export const useLocaleRoute = () => {
  const { content } = useRuntimeConfig().public as any
  const route = useRoute()

  return computed(() => {
    if (content.locales.length) {
      const possibleLocale = route.path.split('/')[1]
      const locale = content.locales.includes(possibleLocale) ? possibleLocale : content.defaultLocale
      return {
        locale,
        path: route.path.substring(locale.length + 1) || '/'
      }
    }
    return {
      locale: undefined,
      path: route.path
    }
  })
}
