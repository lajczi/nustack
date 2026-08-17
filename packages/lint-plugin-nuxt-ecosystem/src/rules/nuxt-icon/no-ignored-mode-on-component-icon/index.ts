import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, getStaticAttribute, hasAttribute } from '../../../utils/template.js'
import { createIconMatcher } from '../components.js'
import { isPascalCaseComponentName } from '../names.js'

export const noIgnoredModeOnComponentIcon: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow `mode` on `@nuxt/icon` when `name` is a global Vue component.',
      url: docsUrl('nuxt-icon/no-ignored-mode-on-component-icon'),
    },
    schema: [],
    messages: {
      ignoredMode: '`mode` is ignored when `<{{ component }}>` `name` is a globally registered Vue component (`{{ name }}`).',
    },
  },
  create(context: Context): Visitor {
    const matcher = createIconMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        const icon = matcher.match(node)
        if (icon === null || !hasAttribute(node, 'mode'))
          return
        const name = getStaticAttribute(node, 'name')
        if (name === null || !isPascalCaseComponentName(name))
          return

        context.report({
          loc: node.startTag.loc,
          messageId: 'ignoredMode',
          data: { component: icon.name, name },
        })
      },
    })
  },
}
