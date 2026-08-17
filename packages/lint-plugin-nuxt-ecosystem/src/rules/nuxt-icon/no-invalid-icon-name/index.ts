import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, getStaticAttribute } from '../../../utils/template.js'
import { createIconMatcher } from '../components.js'
import { isInvalidStaticIconName } from '../names.js'

export const noInvalidIconName: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow static `@nuxt/icon` names that cannot resolve (`/`, `.`, whitespace).',
      url: docsUrl('nuxt-icon/no-invalid-icon-name'),
    },
    schema: [],
    messages: {
      invalidName: '`<{{ component }}>` `name="{{ name }}"` is not a valid Iconify name, `i-collection-icon` class, alias, or global component.',
    },
  },
  create(context: Context): Visitor {
    const matcher = createIconMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        const icon = matcher.match(node)
        if (icon === null)
          return
        const name = getStaticAttribute(node, 'name')
        if (name === null || name === '' || !isInvalidStaticIconName(name))
          return

        context.report({
          loc: node.startTag.loc,
          messageId: 'invalidName',
          data: { component: icon.name, name },
        })
      },
    })
  },
}
