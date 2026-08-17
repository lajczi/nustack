import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, hasAttribute } from '../../../utils/template.js'
import { createIconMatcher } from '../components.js'

export const noWidthHeightInsteadOfSize: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer `size` over `width` / `height` on `@nuxt/icon` components.',
      url: docsUrl('nuxt-icon/no-width-height-instead-of-size'),
    },
    schema: [],
    messages: {
      useSize: 'Use `size` on `<{{ component }}>` instead of `width` / `height`. Those attributes are fallthrough, not the documented sizing API.',
    },
  },
  create(context: Context): Visitor {
    const matcher = createIconMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        const icon = matcher.match(node)
        if (icon === null || hasAttribute(node, 'size'))
          return
        if (!hasAttribute(node, 'width') && !hasAttribute(node, 'height'))
          return

        context.report({
          loc: node.startTag.loc,
          messageId: 'useSize',
          data: { component: icon.name },
        })
      },
    })
  },
}
