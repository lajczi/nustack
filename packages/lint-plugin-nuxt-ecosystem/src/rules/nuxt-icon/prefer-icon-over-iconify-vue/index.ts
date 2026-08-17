import type { Context, Rule, Visitor } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { nuxtIconComponentName } from '../components.js'

export const preferIconOverIconifyVue: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer `@nuxt/icon` over importing `Icon` from `@iconify/vue`.',
      url: docsUrl('nuxt-icon/prefer-icon-over-iconify-vue'),
    },
    schema: [],
    messages: {
      preferNuxtIcon: 'Importing `Icon` from `@iconify/vue` bypasses the `@nuxt/icon` server bundle and SSR path. Use `<{{ component }}>` instead.',
    },
  },
  create(context: Context): Visitor {
    const component = nuxtIconComponentName(context)

    return {
      ImportDeclaration(node: any) {
        if (node.source?.value !== '@iconify/vue' || node.importKind === 'type')
          return

        const imported = (node.specifiers ?? []).some((specifier: any) => {
          if (specifier.importKind === 'type')
            return false
          if (specifier.type === 'ImportSpecifier') {
            const name = specifier.imported?.name ?? specifier.imported?.value
            return name === 'Icon'
          }
          return specifier.type === 'ImportDefaultSpecifier' || specifier.type === 'ImportNamespaceSpecifier'
        })
        if (!imported)
          return

        context.report({
          loc: node.source.loc,
          messageId: 'preferNuxtIcon',
          data: { component },
        })
      },
    }
  },
}
