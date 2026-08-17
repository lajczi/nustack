import type { Context, Rule, Visitor } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { contextFilename, isAppConfigFile, staticKeyName } from '../config-ast.js'

export const noLegacyAppConfigKey: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow the v0 `nuxtIcon` key in `app.config` (renamed to `icon`).',
      url: docsUrl('nuxt-icon/no-legacy-app-config-key'),
    },
    schema: [],
    messages: {
      legacyKey: '`nuxtIcon` in `app.config` was renamed to `icon` in `@nuxt/icon` v1.',
    },
  },
  create(context: Context): Visitor {
    if (!isAppConfigFile(contextFilename(context)))
      return {}

    return {
      Property(node: any) {
        if (staticKeyName(node.key) === 'nuxtIcon')
          context.report({ node: node.key, messageId: 'legacyKey' })
      },
    }
  },
}
