import { defineNuxtConfig } from 'nuxt'
import { resolve } from 'pathe'
import contentModule from '../src/module' // eslint-disable-line

export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/@picocss/pico@latest/css/pico.min.css'
        }
      ]
    }
  },
  rootDir: __dirname,
  modules: [contentModule, '@nuxthq/admin'],
  content: {
    defaultLocale: 'en',
    locales: ['en', 'fa', 'fr'],
    navigation: {
      fields: ['icon']
    },
    sources: [
      {
        name: 'content-fa',
        prefix: '/fa',
        driver: 'fs',
        base: resolve(__dirname, 'content-fa')
      },
      {
        name: 'content-fr',
        prefix: '/fr',
        driver: 'fs',
        base: resolve(__dirname, 'content-fr')
      }
    ],
    highlight: {
      theme: 'one-dark-pro',
      preload: ['json', 'js', 'ts', 'html', 'css', 'vue']
    }
  }
})
