import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { componentOptionsSchema, createComponentMatcher } from '../component-matcher.js'
import { defineTemplateVisitor, hasRawOptOut } from '../utils.js'

function hasStaticTreeRole(node: any): boolean {
  return node.startTag.attributes.some(
    (attribute: any) =>
      !attribute.directive && attribute.key.name === 'role' && attribute.value?.value === 'tree',
  )
}

export const preferUTree: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer UTree over hand-written elements with an explicit tree role.',
      url: docsUrl('nuxt-ui/prefer-u-tree'),
    },
    schema: componentOptionsSchema(),
    messages: {
      preferUTree:
        'Use `<UTree>` instead of a custom `role="tree"`; custom trees must implement the complete tree keyboard and focus model. Add `data-raw` to keep it.',
    },
  },
  create(context: any) {
    const matcher = createComponentMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (matcher.is(node, 'Tree') || hasRawOptOut(node) || !hasStaticTreeRole(node))
          return

        context.report({
          loc: node.startTag.loc,
          messageId: 'preferUTree',
        })
      },
    })
  },
}
