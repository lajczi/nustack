import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { componentOptionsSchema, createComponentMatcher } from '../component-matcher.js'
import { defineTemplateVisitor, hasAttribute, hasRawOptOut } from '../utils.js'

const LINK_COMPONENTS = new Set(['Link', 'Button'])

export const preferLinkTo: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer Nuxt UI/NuxtLink `to` on link-capable components over `href`.',
      url: docsUrl('nuxt-ui/prefer-link-to'),
    },
    schema: componentOptionsSchema(),
    messages: {
      preferTo: 'Use `to` instead of `href` on `<{{ component }}>` so Nuxt routing and link props stay consistent.',
    },
  },
  create(context: any) {
    const matcher = createComponentMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: any) {
        const component = matcher.matchOf(node, LINK_COMPONENTS)
        if (component && !hasRawOptOut(node) && hasAttribute(node, 'href') && !hasAttribute(node, 'to'))
          context.report({ loc: node.startTag.loc, messageId: 'preferTo', data: { component: matcher.prefixed(component) } })
      },
    })
  },
}
