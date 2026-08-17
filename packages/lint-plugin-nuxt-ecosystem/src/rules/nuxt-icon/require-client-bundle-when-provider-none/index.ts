import type { Context, Rule, Visitor } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { contextFilename, findProperty, isNuxtConfigFile, objectValue, staticKeyName, staticLiteral, staticString } from '../config-ast.js'

function hasClientBundleSource(clientBundle: any): boolean {
  if (!clientBundle)
    return false
  const scan = findProperty(clientBundle, 'scan')
  if (scan) {
    const value = staticLiteral(scan.value)
    if (value === true || scan.value?.type === 'ObjectExpression')
      return true
    if (value === false)
      return false
    if (scan.value && value === undefined)
      return true
  }
  const icons = findProperty(clientBundle, 'icons')
  if (icons?.value?.type === 'ArrayExpression')
    return icons.value.elements.some((element: any) => element != null)
  if (icons?.value && icons.value.type !== 'ArrayExpression')
    return true
  return false
}

export const requireClientBundleWhenProviderNone: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require a client bundle when `icon.provider` is `none`.',
      url: docsUrl('nuxt-icon/require-client-bundle-when-provider-none'),
    },
    schema: [],
    messages: {
      missingClientBundle: '`icon.provider: \'none\'` fetches nothing. Enable `icon.clientBundle.scan` or list icons in `icon.clientBundle.icons`.',
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
        if (!icon)
          return
        const provider = findProperty(icon, 'provider')
        if (staticString(provider?.value) !== 'none')
          return
        if (hasClientBundleSource(objectValue(findProperty(icon, 'clientBundle'))))
          return

        context.report({ node: provider.key, messageId: 'missingClientBundle' })
      },
    }
  },
}
