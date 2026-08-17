import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, getStaticAttribute } from '../../../utils/template.js'
import { hasNuxtUi } from '../../nuxt-ui/components.js'
import { nuxtIconComponentName } from '../components.js'

export const preferIcon: Rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer `<Icon>` over raw Iconify class markup when `@nuxt/icon` is available.',
      url: docsUrl('nuxt-icon/prefer-icon'),
    },
    schema: [],
    messages: {
      preferIcon: 'Use `<{{ component }} name="{{ icon }}" />` instead of a raw icon class.',
    },
  },
  create(context: Context): Visitor {
    if (hasNuxtUi(context))
      return {}

    const component = nuxtIconComponentName(context)
    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        if (node.name !== 'i' && node.name !== 'span')
          return
        const classes = getStaticAttribute(node, 'class')
        const icon = classes?.split(/\s+/).find((value: string) => /^i-[\w-]+$/.test(value))
        if (icon)
          context.report({ loc: node.startTag.loc, messageId: 'preferIcon', data: { component, icon } })
      },
    })
  },
}
