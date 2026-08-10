import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { componentOptionsSchema, createComponentMatcher } from '../component-matcher.js'
import { defineTemplateVisitor, hasSlot } from '../utils.js'

export const requirePopoverContent: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require a content slot on Nuxt UI popovers.',
      url: docsUrl('nuxt-ui/require-popover-content'),
    },
    schema: componentOptionsSchema(),
    messages: {
      missingContent: 'Add a `#content` slot to `<UPopover>`; the `content` prop only configures positioning.',
    },
  },
  create(context: any) {
    const matcher = createComponentMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (matcher.is(node, 'Popover') && !hasSlot(node, 'content'))
          context.report({ loc: node.startTag.loc, messageId: 'missingContent' })
      },
    })
  },
}
