import type { Context, Rule, Visitor } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import { normalizeComponentKey } from '../../../utils/component-matcher.js'
import { docsUrl } from '../../../utils/docs-url.js'
import { defineTemplateVisitor, getStaticAttribute } from '../../../utils/template.js'
import { createIconMatcher, nuxtIconComponentName } from '../components.js'
import { isEmojiOnlyName } from '../names.js'

const LAZY_SPELLING = /^lazy-?/i

/** Verified 2026-08-16 against the nuxt/icon v1 rewrite (removed IconCSS, IconSVG, emoji names). */
const LEGACY_COMPONENTS: Record<string, 'IconCSS' | 'IconSVG'> = {
  iconcss: 'IconCSS',
  iconsvg: 'IconSVG',
}

function legacyComponent(node: VueAST.VElement): 'IconCSS' | 'IconSVG' | null {
  const raw = node.rawName ?? node.name
  const key = normalizeComponentKey(raw.replace(LAZY_SPELLING, ''))
  return LEGACY_COMPONENTS[key] ?? null
}

function renamedTag(raw: string, replacement: string): string {
  const lazy = LAZY_SPELLING.exec(raw)?.[0] ?? ''
  const bare = raw.slice(lazy.length)
  return bare.includes('-')
    ? lazy + replacement.replace(/[A-Z]/g, (letter, index) => (index === 0 ? '' : '-') + letter.toLowerCase())
    : lazy + replacement
}

export const noLegacyIconApi: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow `@nuxt/icon` APIs removed in v1 (`IconCSS`, `IconSVG`, emoji names).',
      url: docsUrl('nuxt-icon/no-legacy-icon-api'),
    },
    schema: [],
    fixable: 'code',
    messages: {
      removedComponent: '`<{{ name }}>` was removed in `@nuxt/icon` v1, use `<{{ replacement }}>` instead.',
      emojiName: 'Emoji names were removed in `@nuxt/icon` v1. Use an Iconify name such as `lucide:smile`.',
    },
  },
  create(context: Context): Visitor {
    const matcher = createIconMatcher(context)
    const replacement = nuxtIconComponentName(context)

    return defineTemplateVisitor(context, {
      VElement(node: VueAST.VElement) {
        const legacy = legacyComponent(node)
        if (legacy) {
          const raw = node.rawName ?? node.name
          const renamed = renamedTag(raw, replacement)
          context.report({
            loc: node.startTag.loc,
            messageId: 'removedComponent',
            data: { name: raw, replacement },
            fix: (fixer) => {
              const start = node.startTag.range[0] + 1
              const fixes = [fixer.replaceTextRange([start, start + raw.length], renamed)]
              if (node.endTag) {
                const end = node.endTag.range[0] + 2
                fixes.push(fixer.replaceTextRange([end, end + raw.length], renamed))
              }
              return fixes
            },
          })
          return
        }

        const icon = matcher.match(node)
        if (icon === null)
          return
        const name = getStaticAttribute(node, 'name')
        if (name !== null && isEmojiOnlyName(name)) {
          context.report({
            loc: node.startTag.loc,
            messageId: 'emojiName',
          })
        }
      },
    })
  },
}
