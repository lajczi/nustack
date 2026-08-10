import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { componentOptionsSchema, createComponentMatcher } from '../component-matcher.js'
import { defineTemplateVisitor, hasAttribute, hasVModel } from '../utils.js'

export const noConflictingStateProps: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow mixing controlled Nuxt UI state with its uncontrolled default prop.',
      url: docsUrl('nuxt-ui/no-conflicting-state-props'),
    },
    schema: componentOptionsSchema(),
    messages: {
      conflicting: '`<{{ component }}>` cannot use controlled `{{ controlled }}` together with `{{ uncontrolled }}`; choose one state model.',
    },
  },
  create(context: any) {
    const matcher = createComponentMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: any) {
        // A component-authoring convention rather than a Nuxt UI one, so any component qualifies.
        if (!matcher.isComponent(node))
          return

        if (hasAttribute(node, 'default-open') && (hasAttribute(node, 'open') || hasVModel(node, 'open'))) {
          context.report({
            loc: node.startTag.loc,
            messageId: 'conflicting',
            data: { component: matcher.rawName(node), controlled: 'open / v-model:open', uncontrolled: 'default-open' },
          })
        }

        if (hasAttribute(node, 'default-value') && (hasAttribute(node, 'model-value') || hasVModel(node, null))) {
          context.report({
            loc: node.startTag.loc,
            messageId: 'conflicting',
            data: { component: matcher.rawName(node), controlled: 'model-value / v-model', uncontrolled: 'default-value' },
          })
        }
      },
    })
  },
}
