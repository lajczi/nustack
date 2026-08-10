import type { Rule } from '@oxlint/plugins'
import type { ComponentMatcher } from '../component-matcher.js'
import { docsUrl } from '../../../utils/docs-url.js'
import { componentOptionsSchema, createComponentMatcher } from '../component-matcher.js'
import { defineTemplateVisitor, hasNonEmptyAttribute, hasRawOptOut, hasSlot } from '../utils.js'

const FORM_CONTROLS = new Set([
  'Checkbox',
  'CheckboxGroup',
  'ColorPicker',
  'FileUpload',
  'Input',
  'InputDate',
  'InputMenu',
  'InputNumber',
  'InputTags',
  'InputTime',
  'Listbox',
  'PinInput',
  'RadioGroup',
  'Select',
  'SelectMenu',
  'Slider',
  'Switch',
  'Textarea',
])

function hasLabeledFormFieldAncestor(node: any, matcher: ComponentMatcher): boolean {
  let parent = node.parent
  while (parent) {
    if (matcher.is(parent, 'FormField')) {
      return hasNonEmptyAttribute(parent, 'label')
        || hasSlot(parent, 'label')
    }
    parent = parent.parent
  }
  return false
}

function hasAccessibleLabel(node: any, matcher: ComponentMatcher): boolean {
  return hasNonEmptyAttribute(node, 'label')
    || hasNonEmptyAttribute(node, 'legend')
    || hasNonEmptyAttribute(node, 'aria-label')
    || hasNonEmptyAttribute(node, 'aria-labelledby')
    || hasSlot(node, 'label')
    || hasSlot(node, 'legend')
    || hasLabeledFormFieldAncestor(node, matcher)
}

export const requireFormControlLabel: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require an accessible label for Nuxt UI form controls.',
      url: docsUrl('nuxt-ui/require-form-control-label'),
    },
    schema: componentOptionsSchema(),
    messages: {
      missingLabel: 'Add `label`, `legend`, `aria-label`, `aria-labelledby`, or wrap `<{{ component }}>` in a `<UFormField>` with `label` or a `#label` slot.',
    },
  },
  create(context: any) {
    const matcher = createComponentMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: any) {
        const control = matcher.matchOf(node, FORM_CONTROLS)
        if (!control || hasRawOptOut(node) || hasAccessibleLabel(node, matcher))
          return
        context.report({
          loc: node.startTag.loc,
          messageId: 'missingLabel',
          data: { component: matcher.prefixed(control) },
        })
      },
    })
  },
}
