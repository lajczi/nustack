import type { Context, Rule, Visitor } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { findProperty, objectValue, siblingProperty, staticBoolean, staticKeyName, staticString } from '../config-ast.js'

function excludesCustomCollections(clientBundle: any): boolean {
  const include = findProperty(clientBundle, 'includeCustomCollections')
  return staticBoolean(include?.value) === false
}

export const noCustomCollectionsWithoutBundle: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow `icon.customCollections` when the provider cannot serve them.',
      url: docsUrl('nuxt-icon/no-custom-collections-without-bundle'),
    },
    schema: [],
    messages: {
      missingCustomCollections: 'Custom icon collections are not on the public Iconify API. Set `icon.provider: \'server\'` or `icon.clientBundle.includeCustomCollections: true`.',
    },
  },
  create(context: Context): Visitor {
    return {
      Property(node: any) {
        if (staticKeyName(node.key) !== 'icon')
          return
        const icon = objectValue(node)
        if (!icon || !findProperty(icon, 'customCollections'))
          return

        const providerProp = findProperty(icon, 'provider')
        const provider = staticString(providerProp?.value)
        if (providerProp && provider === null)
          return
        if (provider === 'server')
          return
        if (!excludesCustomCollections(objectValue(findProperty(icon, 'clientBundle'))))
          return

        const ssr = staticBoolean(siblingProperty(node, 'ssr')?.value)
        const usesNonServerProvider = provider === 'iconify' || provider === 'none' || (provider === null && ssr === false)
        if (!usesNonServerProvider)
          return

        context.report({
          node: findProperty(icon, 'customCollections').key,
          messageId: 'missingCustomCollections',
        })
      },
    }
  },
}
