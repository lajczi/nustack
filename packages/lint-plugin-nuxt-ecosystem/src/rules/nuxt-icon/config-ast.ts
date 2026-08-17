import type { Context } from '@oxlint/plugins'

export function contextFilename(context: Context): string {
  const withName = context as Context & { filename?: string, physicalFilename?: string }
  return withName.filename ?? withName.physicalFilename ?? ''
}

export function isNuxtConfigFile(filename: string): boolean {
  return /(?:^|[/\\])nuxt\.config\.[cm]?[jt]s$/.test(filename)
}

export function isAppConfigFile(filename: string): boolean {
  return /(?:^|[/\\])app\.config\.[cm]?[jt]s$/.test(filename)
}

export function staticKeyName(key: any): string | null {
  if (key?.type === 'Identifier')
    return key.name
  if (key?.type === 'Literal' && typeof key.value === 'string')
    return key.value
  return null
}

export function findProperty(object: any, name: string): any | null {
  if (object?.type !== 'ObjectExpression')
    return null
  return object.properties.find((property: any) => property.type === 'Property' && staticKeyName(property.key) === name) ?? null
}

export function siblingProperty(property: any, name: string): any | null {
  return findProperty(property?.parent, name)
}

export function staticLiteral(node: any): unknown {
  if (node?.type === 'Literal')
    return node.value
  if (node?.type === 'TemplateLiteral' && node.expressions.length === 0)
    return node.quasis[0]?.value.cooked ?? node.quasis[0]?.value.raw ?? undefined
  return undefined
}

export function staticString(node: any): string | null {
  const value = staticLiteral(node)
  return typeof value === 'string' ? value : null
}

export function staticBoolean(node: any): boolean | null {
  const value = staticLiteral(node)
  return typeof value === 'boolean' ? value : null
}

export function objectValue(property: any): any | null {
  return property?.value?.type === 'ObjectExpression' ? property.value : null
}
