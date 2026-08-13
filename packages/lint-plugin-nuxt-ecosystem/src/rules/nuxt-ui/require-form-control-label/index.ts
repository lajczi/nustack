import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import type { ComponentMatcher } from '../../../utils/component-matcher.js'
import { elementAncestor } from '../../../utils/component-matcher.js'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, hasNonEmptyAttribute, hasSlot } from '../../../utils/template.js'
import { createNuxtUiMatcher } from '../components.js'

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

function hasLabeledFormFieldAncestor(node: VueAST.VElement, matcher: ComponentMatcher): boolean {
  let parent = elementAncestor(node)
  while (parent) {
    if (matcher.is(parent, 'FormField')) {
      return hasNonEmptyAttribute(parent, 'label')
        || hasSlot(parent, 'label')
    }
    parent = elementAncestor(parent)
  }
  return false
}

function hasAccessibleLabel(node: VueAST.VElement, matcher: ComponentMatcher): boolean {
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
    schema: [],
    messages: {
      missingLabel: 'Add `label`, `legend`, `aria-label`, `aria-labelledby`, or wrap `<{{ component }}>` in a `<UFormField>` with `label` or a `#label` slot.',
    },
  },
  create(context: Context): Visitor {
    const matcher = createNuxtUiMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        const control = matcher.matchOf(node, FORM_CONTROLS)
        if (!control || hasAccessibleLabel(node, matcher))
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
