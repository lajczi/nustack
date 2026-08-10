// `#components` is Nuxt's barrel and also re-exports project components, so names from it still
// go through prefix resolution rather than being trusted outright.
const NUXT_UI_MODULE = /^(?:@nuxt\/ui|#ui)(?:\/|$)/
const AUTO_IMPORT_MODULE = '#components'

const LAZY_PREFIX = 'lazy'

/**
 * `vue-eslint-parser` lowercases `node.name` but keeps hyphens, so `<UButton>` and `<u-button>`
 * arrive as `ubutton` and `u-button`. Both normalize to `ubutton`.
 */
export function normalizeComponentKey(name: string): string {
  return name.replaceAll('-', '').toLowerCase()
}

export interface ComponentMatcher {
  is: (node: any, name: string) => boolean
  /** The entry of `names` this element matches, preserving its casing, or `null`. */
  matchOf: (node: any, names: Iterable<string>) => string | null
  isOneOf: (node: any, names: Iterable<string>) => boolean
  hasAncestor: (node: any, name: string) => boolean
  /** The element's key with `Lazy` and the prefix stripped, or `null` on a mismatch. */
  keyOf: (node: any) => string | null
  /** `keyOf` for a bare name, so option tables accept prefixed and unprefixed spellings. */
  keyOfName: (name: string) => string | null
  prefixed: (name: string) => string
  rawName: (node: any) => string
  isComponent: (node: any) => boolean
}

export const PREFIX_SCHEMA = {
  /** Component prefix configured via `ui.prefix`; use `''` when the prefix is disabled. */
  prefix: { type: 'string' },
} as const

export function componentOptionsSchema(extraProperties: Record<string, unknown> = {}): unknown[] {
  return [{
    type: 'object',
    properties: { ...PREFIX_SCHEMA, ...extraProperties },
    additionalProperties: false,
  }]
}

/** `rawName` preserves case, `name` is lowercased by the parser. */
function elementName(node: any): string {
  return node?.rawName ?? node?.name ?? ''
}

function dynamicIsName(node: any): string | null {
  const attribute = node.startTag.attributes.find((candidate: any) => {
    if (!candidate.directive)
      return candidate.key.name === 'is'
    if (candidate.key.name?.name !== 'bind')
      return false
    return candidate.key.argument?.type === 'VIdentifier' && candidate.key.argument.name === 'is'
  })
  if (!attribute)
    return null
  if (!attribute.directive)
    return attribute.value?.value ?? null

  const expression = attribute.value?.expression
  if (expression?.type === 'Identifier')
    return expression.name
  if (expression?.type === 'Literal' && typeof expression.value === 'string')
    return expression.value
  return null
}

/**
 * Identifies Nuxt UI components in a template, covering the spellings a plain `node.name`
 * comparison misses: kebab-case, `Lazy` wrappers, a configured `ui.prefix`, named imports under
 * an alias, locally shadowed names, and `<component :is>` with a static target.
 *
 * Components built at runtime (`defineAsyncComponent`, `resolveComponent`, an `:is` bound to an
 * expression) and re-exports through an intermediate module are treated as "not Nuxt UI", so they
 * stay silent instead of producing false positives.
 */
export function createComponentMatcher(context: any): ComponentMatcher {
  const prefix: string = context.options?.[0]?.prefix ?? 'U'
  const prefixKey = normalizeComponentKey(prefix)

  function stripPrefixes(name: string): string | null {
    let key = normalizeComponentKey(name)
    if (key.startsWith(LAZY_PREFIX))
      key = key.slice(LAZY_PREFIX.length)
    if (!key.startsWith(prefixKey))
      return null
    const stripped = key.slice(prefixKey.length)
    return stripped.length > 0 ? stripped : null
  }

  // A `null` value means the name is bound to something definitively not Nuxt UI, which is how
  // local shadowing (`import UButton from './MyButton.vue'`) suppresses a false positive.
  const bindings = new Map<string, string | null>()
  for (const statement of context.sourceCode?.ast?.body ?? []) {
    if (statement.type !== 'ImportDeclaration' || statement.importKind === 'type')
      continue

    const source: string = statement.source.value
    const fromNuxtUi = NUXT_UI_MODULE.test(source)
    const fromBarrel = source === AUTO_IMPORT_MODULE

    for (const specifier of statement.specifiers) {
      if (specifier.importKind === 'type')
        continue

      if (specifier.type === 'ImportSpecifier') {
        const imported = specifier.imported.name ?? specifier.imported.value
        bindings.set(
          specifier.local.name,
          fromNuxtUi || fromBarrel ? stripPrefixes(imported) : null,
        )
        continue
      }

      if (specifier.type === 'ImportDefaultSpecifier') {
        // `@nuxt/ui/components/Button.vue` — the file name is the unprefixed component.
        const file = fromNuxtUi ? source.split('/').pop()?.replace(/\.vue$/, '') : undefined
        bindings.set(specifier.local.name, file ? normalizeComponentKey(file) : null)
      }
    }
  }

  function effectiveName(node: any): string | null {
    if (node?.type !== 'VElement')
      return null
    const raw = elementName(node)
    return normalizeComponentKey(raw) === 'component' ? dynamicIsName(node) : raw
  }

  function keyOf(node: any): string | null {
    const name = effectiveName(node)
    if (name === null)
      return null
    const bound = bindings.get(name)
    return bound !== undefined ? bound : stripPrefixes(name)
  }

  function matchOf(node: any, names: Iterable<string>): string | null {
    const key = keyOf(node)
    if (key === null)
      return null
    for (const name of names) {
      if (normalizeComponentKey(name) === key)
        return name
    }
    return null
  }

  function is(node: any, name: string): boolean {
    return keyOf(node) === normalizeComponentKey(name)
  }

  return {
    is,
    matchOf,
    isOneOf: (node, names) => matchOf(node, names) !== null,
    hasAncestor: (node, name) => {
      let parent = node.parent
      while (parent) {
        if (is(parent, name))
          return true
        parent = parent.parent
      }
      return false
    },
    keyOf,
    keyOfName: stripPrefixes,
    prefixed: name => `${prefix}${name}`,
    rawName: elementName,
    // Native tags are all-lowercase and unhyphenated; anything else is a component.
    isComponent: node => /[A-Z-]/.test(elementName(node)),
  }
}
