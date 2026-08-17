import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, hasLabelContent } from '../../../utils/template.js'
import { createIconMatcher } from '../components.js'

export const noIconSlotFallback: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow default-slot fallback content on `@nuxt/icon` components.',
      url: docsUrl('nuxt-icon/no-icon-slot-fallback'),
    },
    schema: [],
    messages: {
      slotFallback: '`<{{ component }}>` does not support slot fallback content (removed in `@nuxt/icon` v1).',
    },
  },
  create(context: Context): Visitor {
    const matcher = createIconMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        const icon = matcher.match(node)
        if (icon === null || !hasLabelContent(node))
          return

        context.report({
          loc: node.startTag.loc,
          messageId: 'slotFallback',
          data: { component: icon.name },
        })
      },
    })
  },
}
