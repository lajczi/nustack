import type { Context, Rule, Visitor } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { contextFilename, findProperty, isNuxtConfigFile, objectValue, staticKeyName } from '../config-ast.js'

export const noCustomizeInNuxtConfig: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow `icon.customize` in `nuxt.config` (`@nuxt/icon` throws at setup).',
      url: docsUrl('nuxt-icon/no-customize-in-nuxt-config'),
    },
    schema: [],
    messages: {
      customizeInNuxtConfig: '`icon.customize` in `nuxt.config` throws at setup. Move the callback to `app.config` or a per-instance `customize` prop.',
    },
  },
  create(context: Context): Visitor {
    if (!isNuxtConfigFile(contextFilename(context)))
      return {}

    return {
      Property(node: any) {
        if (staticKeyName(node.key) !== 'icon')
          return
        const icon = objectValue(node)
        const customize = icon ? findProperty(icon, 'customize') : null
        if (customize)
          context.report({ node: customize.key, messageId: 'customizeInNuxtConfig' })
      },
    }
  },
}
