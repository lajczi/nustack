import type { Rule } from '@oxlint/plugins'
import type { ComponentMatcher } from '../component-matcher.js'
import { docsUrl } from '../../../utils/docs-url.js'
import { componentOptionsSchema, createComponentMatcher } from '../component-matcher.js'
import { defineTemplateVisitor, hasRawOptOut } from '../utils.js'

const NATIVE_CONTROLS = new Set(['input', 'select', 'textarea'])

const UI_CONTROLS = new Set([
  'Checkbox',
  'ColorPicker',
  'FileUpload',
  'Input',
  'InputDate',
  'InputNumber',
  'InputTime',
  'RadioGroup',
  'Select',
  'Slider',
  'Switch',
  'Textarea',
])

function isFormControl(node: any, matcher: ComponentMatcher): boolean {
  return NATIVE_CONTROLS.has(node.name) || matcher.isOneOf(node, UI_CONTROLS)
}

function containsFormControl(node: any, matcher: ComponentMatcher): boolean {
  return node.children.some((child: any) =>
    child.type === 'VElement'
    && (isFormControl(child, matcher) || containsFormControl(child, matcher)),
  )
}

function staticAttribute(node: any, name: string): string | null {
  const attribute = node.startTag.attributes.find(
    (candidate: any) => !candidate.directive && candidate.key.name === name && candidate.value,
  )
  return attribute?.value.value ?? null
}

function hasControlWithId(node: any, id: string, matcher: ComponentMatcher): boolean {
  if (node.type === 'VElement' && isFormControl(node, matcher) && staticAttribute(node, 'id') === id)
    return true
  return node.children?.some((child: any) => hasControlWithId(child, id, matcher)) ?? false
}

function documentRoot(node: any): any {
  let root = node
  while (root.parent)
    root = root.parent
  return root
}

export const preferUFormField: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer UFormField over hand-written label and form-control pairs.',
      url: docsUrl('nuxt-ui/prefer-u-form-field'),
    },
    schema: componentOptionsSchema(),
    messages: {
      preferUFormField: 'Use `<UFormField label="...">` for this labelled control; add `data-raw` when a native label is intentional.',
    },
  },
  create(context: any) {
    const matcher = createComponentMatcher(context)

    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (node.name !== 'label' || hasRawOptOut(node))
          return

        if (containsFormControl(node, matcher)) {
          context.report({ loc: node.startTag.loc, messageId: 'preferUFormField' })
          return
        }

        const id = staticAttribute(node, 'for')
        if (id && hasControlWithId(documentRoot(node), id, matcher))
          context.report({ loc: node.startTag.loc, messageId: 'preferUFormField' })
      },
    })
  },
}
