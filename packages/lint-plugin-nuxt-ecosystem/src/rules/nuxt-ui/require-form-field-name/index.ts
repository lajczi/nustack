import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { componentOptionsSchema, createComponentMatcher } from '../component-matcher.js'
import { defineTemplateVisitor, hasAttribute } from '../utils.js'

export const requireFormFieldName: Rule = {
  meta: {
    // A `<UFormField>` without `name` still renders and labels its control; it only opts out of
    // automatic error routing, which a purely presentational field group legitimately wants.
    type: 'suggestion',
    docs: {
      description: 'Require a validation target on Nuxt UI form fields used inside a form.',
      url: docsUrl('nuxt-ui/require-form-field-name'),
    },
    schema: componentOptionsSchema(),
    messages: {
      missingName: 'Add `name` or `error-pattern` to this `<UFormField>` so `<UForm>` can route validation errors to it.',
    },
  },
  create(context: any) {
    const matcher = createComponentMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (matcher.is(node, 'FormField')
          && matcher.hasAncestor(node, 'Form')
          && !hasAttribute(node, 'name')
          && !hasAttribute(node, 'error-pattern')) {
          context.report({ loc: node.startTag.loc, messageId: 'missingName' })
        }
      },
    })
  },
}
