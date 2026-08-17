import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, hasNonEmptyAttribute } from '../../../utils/template.js'
import { createIconMatcher } from '../components.js'

export const requireIconName: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require a non-empty `name` on `@nuxt/icon` components.',
      url: docsUrl('nuxt-icon/require-icon-name'),
    },
    schema: [],
    messages: {
      missingName: 'Add `name` to `<{{ component }}>`. Without it the icon cannot resolve.',
    },
  },
  create(context: Context): Visitor {
    const matcher = createIconMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        const icon = matcher.match(node)
        if (icon === null || hasNonEmptyAttribute(node, 'name'))
          return

        context.report({
          loc: node.startTag.loc,
          messageId: 'missingName',
          data: { component: icon.name },
        })
      },
    })
  },
}
