import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, hasRawOptOut } from '../utils.js'

const FORM_CONTROLS = new Set([
  'input',
  'select',
  'textarea',
  'ucheckbox',
  'ucolorpicker',
  'ufileupload',
  'uinput',
  'uinputdate',
  'uinputnumber',
  'uinputtime',
  'uradiogroup',
  'uselect',
  'uslider',
  'uswitch',
  'utextarea',
])

function containsFormControl(node: any): boolean {
  return node.children.some((child: any) =>
    child.type === 'VElement' && (FORM_CONTROLS.has(child.name) || containsFormControl(child)),
  )
}

function staticAttribute(node: any, name: string): string | null {
  const attribute = node.startTag.attributes.find(
    (candidate: any) => !candidate.directive && candidate.key.name === name && candidate.value,
  )
  return attribute?.value.value ?? null
}

function hasControlWithId(node: any, id: string): boolean {
  if (node.type === 'VElement' && FORM_CONTROLS.has(node.name) && staticAttribute(node, 'id') === id)
    return true
  return node.children?.some((child: any) => hasControlWithId(child, id)) ?? false
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
    schema: [],
    messages: {
      preferUFormField: 'Use `<UFormField label="...">` for this labelled control; add `data-raw` when a native label is intentional.',
    },
  },
  create(context: any) {
    return defineTemplateVisitor(context, {
      VElement(node: any) {
        if (node.name !== 'label' || hasRawOptOut(node))
          return

        if (containsFormControl(node)) {
          context.report({ loc: node.startTag.loc, messageId: 'preferUFormField' })
          return
        }

        const id = staticAttribute(node, 'for')
        if (id && hasControlWithId(documentRoot(node), id))
          context.report({ loc: node.startTag.loc, messageId: 'preferUFormField' })
      },
    })
  },
}
