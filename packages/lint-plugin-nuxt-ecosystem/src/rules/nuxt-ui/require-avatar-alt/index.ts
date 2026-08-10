import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { componentOptionsSchema, createComponentMatcher } from '../component-matcher.js'
import { defineTemplateVisitor, hasAttribute } from '../utils.js'

export const requireAvatarAlt: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require alternative text for Nuxt UI avatars that render an image.',
      url: docsUrl('nuxt-ui/require-avatar-alt'),
    },
    schema: componentOptionsSchema(),
    messages: {
      missingAlt: 'Add `alt` to `<UAvatar>` (or explicitly mark a decorative avatar with `aria-hidden`).',
    },
  },
  create(context: any) {
    const matcher = createComponentMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (!matcher.is(node, 'Avatar') || !hasAttribute(node, 'src'))
          return
        if (!hasAttribute(node, 'alt') && !hasAttribute(node, 'aria-hidden'))
          context.report({ loc: node.startTag.loc, messageId: 'missingAlt' })
      },
    })
  },
}
