import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, getAttributeValue } from '../../../utils/template.js'
import { createIconMatcher } from '../components.js'
import { isScannableIconNameExpression } from '../names.js'

export const noDynamicIconName: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow `@nuxt/icon` names the client-bundle scanner cannot see.',
      url: docsUrl('nuxt-icon/no-dynamic-icon-name'),
    },
    schema: [],
    messages: {
      dynamicName: '`<{{ component }}>` `name` is not a static Iconify name the client-bundle scanner can see. Add the icons to `icon.clientBundle.icons` or use a literal / static ternary.',
    },
  },
  create(context: Context): Visitor {
    const matcher = createIconMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        const icon = matcher.match(node)
        if (icon === null)
          return
        const name = getAttributeValue(node, 'name')
        if (!name.present)
          return
        if (!name.definite)
          return
        if (name.known && typeof name.value === 'string')
          return
        if (isScannableIconNameExpression(name.expression))
          return
        if (name.known)
          return

        context.report({
          loc: node.startTag.loc,
          messageId: 'dynamicName',
          data: { component: icon.name },
        })
      },
    })
  },
}
