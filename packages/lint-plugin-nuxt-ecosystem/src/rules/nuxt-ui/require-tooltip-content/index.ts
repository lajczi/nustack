import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { componentOptionsSchema, createComponentMatcher } from '../component-matcher.js'
import { defineTemplateVisitor, hasNonEmptyAttribute, hasSlot } from '../utils.js'

export const requireTooltipContent: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require content on Nuxt UI tooltips so they communicate a useful hint.',
      url: docsUrl('nuxt-ui/require-tooltip-content'),
    },
    schema: componentOptionsSchema(),
    messages: {
      missingContent: 'Add a non-empty `text` prop or `#content` slot to `<UTooltip>`.',
    },
  },
  create(context: any) {
    const matcher = createComponentMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (matcher.is(node, 'Tooltip') && !hasNonEmptyAttribute(node, 'text') && !hasSlot(node, 'content'))
          context.report({ loc: node.startTag.loc, messageId: 'missingContent' })
      },
    })
  },
}
