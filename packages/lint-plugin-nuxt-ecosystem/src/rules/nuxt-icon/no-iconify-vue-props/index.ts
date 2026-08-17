import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, hasAttribute } from '../../../utils/template.js'
import { attributeNameRange, findAttribute } from '../attributes.js'
import { createIconMatcher } from '../components.js'

/** Verified 2026-08-16 against @nuxt/icon runtime props (`name`, `customize`) vs @iconify/vue. */
const RENAMES = [
  { from: 'icon', to: 'name', messageId: 'iconProp' as const },
  { from: 'customise', to: 'customize', messageId: 'customiseProp' as const },
]

export const noIconifyVueProps: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow Iconify Vue props on `@nuxt/icon` components (`icon`, `customise`).',
      url: docsUrl('nuxt-icon/no-iconify-vue-props'),
    },
    schema: [],
    fixable: 'code',
    messages: {
      iconProp: '`<{{ component }}>` uses `name`, not the Iconify Vue `icon` prop.',
      customiseProp: '`<{{ component }}>` uses `customize`, not the Iconify Vue `customise` spelling.',
    },
  },
  create(context: Context): Visitor {
    const matcher = createIconMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        const icon = matcher.match(node)
        if (icon === null)
          return

        for (const rename of RENAMES) {
          if (!hasAttribute(node, rename.from))
            continue

          const attribute = findAttribute(node, rename.from)
          const range = attribute ? attributeNameRange(attribute) : null
          const canFix = range !== null && !hasAttribute(node, rename.to)

          context.report({
            loc: node.startTag.loc,
            messageId: rename.messageId,
            data: { component: icon.name },
            fix: canFix
              ? fixer => fixer.replaceTextRange(range, rename.to)
              : undefined,
          })
        }
      },
    })
  },
}
