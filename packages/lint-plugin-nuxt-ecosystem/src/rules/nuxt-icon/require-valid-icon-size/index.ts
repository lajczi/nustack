import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, getAttributeValue } from '../../../utils/template.js'
import { createIconMatcher } from '../components.js'
import { isValidIconSize } from '../names.js'

export const requireValidIconSize: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require `@nuxt/icon` `size` to be a number or CSS length.',
      url: docsUrl('nuxt-icon/require-valid-icon-size'),
    },
    schema: [],
    messages: {
      invalidSize: '`<{{ component }}>` `size` must be a number or CSS length (for example `24`, `24px`, or `1em`), not `{{ value }}`.',
    },
  },
  create(context: Context): Visitor {
    const matcher = createIconMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        const icon = matcher.match(node)
        if (icon === null)
          return
        const size = getAttributeValue(node, 'size')
        if (!size.present || !size.known || isValidIconSize(size.value))
          return

        context.report({
          loc: node.startTag.loc,
          messageId: 'invalidSize',
          data: { component: icon.name, value: String(size.value) },
        })
      },
    })
  },
}
