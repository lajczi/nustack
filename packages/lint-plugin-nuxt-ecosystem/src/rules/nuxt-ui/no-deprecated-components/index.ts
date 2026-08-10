import type { Rule } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { componentOptionsSchema, createComponentMatcher, normalizeComponentKey } from '../component-matcher.js'
import { defineTemplateVisitor } from '../utils.js'

/**
 * Unprefixed `old` → `new` renames.
 * Verified 2026-07-21 against the ui.nuxt.com v4 migration guide; re-verify on the next major.
 */
const DEPRECATED_COMPONENTS: Record<string, string> = {
  ButtonGroup: 'FieldGroup',
  PageMarquee: 'Marquee',
  PageAccordion: 'Accordion',
}

export const noDeprecatedComponents: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow Nuxt UI components renamed in v4 in favour of their current names.',
      url: docsUrl('nuxt-ui/no-deprecated-components'),
    },
    schema: componentOptionsSchema({
      /**
       * Extra `OldName` → `NewName` renames merged onto the built-in table. Either spelling of
       * the key works (`UButtonGroup` or `ButtonGroup`); the value is written unprefixed.
       */
      components: { type: 'object', additionalProperties: { type: 'string' } },
    }),
    messages: {
      deprecated: '`<{{ name }}>` was renamed in Nuxt UI v4, use `<{{ replacement }}>` instead.',
    },
  },
  create(context: any) {
    const matcher = createComponentMatcher(context)
    const prefix: string = context.options[0]?.prefix ?? 'U'
    const extra: Record<string, string> = context.options[0]?.components ?? {}
    /** Accepts `UButtonGroup` and `ButtonGroup` alike, so the message never doubles the prefix. */
    const unprefixed = (name: string) => (name.startsWith(prefix) ? name.slice(prefix.length) : name)
    const table = new Map<string, { name: string, replacement: string }>(
      Object.entries({ ...DEPRECATED_COMPONENTS, ...extra }).map(([name, replacement]) => [
        matcher.keyOfName(name) ?? normalizeComponentKey(name),
        { name: unprefixed(name), replacement: unprefixed(replacement) },
      ]),
    )

    return defineTemplateVisitor(context, {
      VElement(node: any) {
        const key = matcher.keyOf(node)
        const deprecated = key === null ? undefined : table.get(key)
        if (!deprecated)
          return

        context.report({
          loc: node.startTag.loc,
          messageId: 'deprecated',
          data: {
            name: matcher.prefixed(deprecated.name),
            replacement: matcher.prefixed(deprecated.replacement),
          },
        })
      },
    })
  },
}
