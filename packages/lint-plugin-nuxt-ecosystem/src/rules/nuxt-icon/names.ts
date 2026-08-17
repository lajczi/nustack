interface NamedExpression {
  type: string
  value?: unknown
  expressions?: unknown[]
  quasis?: { value?: { cooked?: string | null, raw?: string } }[]
  consequent?: NamedExpression
  alternate?: NamedExpression
}

/** Verified 2026-08-16 against nuxt/icon README name resolution and v1 breaking changes. */

export function isEmojiOnlyName(name: string): boolean {
  const trimmed = name.trim()
  if (!trimmed)
    return false
  return !/[:/.\w-]/.test(trimmed) && /\p{Extended_Pictographic}/u.test(trimmed)
}

export function isInvalidStaticIconName(name: string): boolean {
  if (name !== name.trim() || /\s/.test(name))
    return true
  if (name.includes('/'))
    return true
  return /^[^\s:]+\.[^\s:]+$/.test(name)
}

export function isPascalCaseComponentName(name: string): boolean {
  return /^[A-Z][\w$]*$/.test(name)
}

const CSS_LENGTH = /^-?\d*\.?\d+(px|em|rem|%|vh|vw|ex|ch|svh|svw|lh|vmin|vmax)$/i

export function isValidIconSize(value: unknown): boolean {
  if (typeof value === 'number')
    return !Number.isNaN(value)
  if (typeof value !== 'string')
    return false
  const trimmed = value.trim()
  if (!trimmed)
    return false
  if (!Number.isNaN(Number(trimmed)))
    return true
  return CSS_LENGTH.test(trimmed)
}

function staticString(expression: NamedExpression | null | undefined): string | null {
  if (!expression)
    return null
  if (expression.type === 'Literal' && typeof expression.value === 'string')
    return expression.value
  if (expression.type === 'TemplateLiteral' && expression.expressions?.length === 0)
    return expression.quasis?.[0]?.value?.cooked ?? expression.quasis?.[0]?.value?.raw ?? null
  return null
}

/** Client-bundle scan sees string literals and ternaries of two string literals. */
export function isScannableIconNameExpression(expression: NamedExpression | null | undefined): boolean {
  if (staticString(expression) !== null)
    return true
  if (expression?.type === 'ConditionalExpression')
    return staticString(expression.consequent) !== null && staticString(expression.alternate) !== null
  return false
}
