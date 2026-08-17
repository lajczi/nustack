import type { Context, Rule, Visitor } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { findProperty, objectValue, staticKeyName, staticLiteral } from '../config-ast.js'

/** Verified 2026-08-16 against @nuxt/icon ModuleOptions / NuxtIconRuntimeOptions. */
const ENUMS: Record<string, { values: Set<unknown>, allowObject?: boolean }> = {
  provider: { values: new Set(['server', 'iconify', 'none']) },
  mode: { values: new Set(['css', 'svg']) },
  fallbackToApi: { values: new Set([true, false, 'server-only', 'client-only']) },
  serverBundle: { values: new Set(['auto', 'remote', 'local', false]), allowObject: true },
}

function formatValues(values: Set<unknown>): string {
  return [...values].map(value => typeof value === 'string' ? `'${value}'` : String(value)).join(', ')
}

export const noInvalidIconConfigEnum: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow invalid `icon.provider`, `mode`, `fallbackToApi`, or `serverBundle` values.',
      url: docsUrl('nuxt-icon/no-invalid-icon-config-enum'),
    },
    schema: [],
    messages: {
      invalidEnum: '`icon.{{ name }}` must be {{ allowed }}, not `{{ value }}`.',
    },
  },
  create(context: Context): Visitor {
    return {
      Property(node: any) {
        if (staticKeyName(node.key) !== 'icon')
          return
        const icon = objectValue(node)
        if (!icon)
          return

        for (const [name, spec] of Object.entries(ENUMS)) {
          const property = findProperty(icon, name)
          if (!property)
            continue
          if (spec.allowObject && property.value?.type === 'ObjectExpression')
            continue
          const value = staticLiteral(property.value)
          if (value === undefined)
            continue
          if (spec.values.has(value))
            continue

          context.report({
            node: property.value,
            messageId: 'invalidEnum',
            data: { name, allowed: formatValues(spec.values), value: String(value) },
          })
        }
      },
    }
  },
}
