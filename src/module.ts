import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, createResolver, addImportsDir, addTemplate } from '@nuxt/kit'
import defu from 'defu'

export interface ModuleOptions {
  addPlugin: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-mailer',
    configKey: 'mailer',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    addPlugin: false
  },
  setup (options, nuxt) {
    if (options.addPlugin) {
      const { resolve } = createResolver(import.meta.url)
      const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
      nuxt.options.build.transpile.push(runtimeDir)
      addPlugin(resolve(runtimeDir, 'plugin'))
    }

    const { resolve } = createResolver(import.meta.url)

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}
      nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
        inline: [resolve('./runtime')]
      })
      nitroConfig.alias['#mailer'] = resolve('./runtime/server/services')
    })

    addTemplate({
      filename: 'types/mailer.d.ts',
      getContents: () => [
        'declare module \'#mailer\' {',
        `  const useMailer: typeof import('${resolve('./runtime/server/services')}').useMailer`,
        '}'
      ].join('\n')
    })

    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: resolve(nuxt.options.buildDir, 'types/mailer.d.ts') })
    })
  }
})
