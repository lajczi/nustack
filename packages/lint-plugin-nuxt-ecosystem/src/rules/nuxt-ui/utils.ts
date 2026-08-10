// `node.name` is only a safe comparison for native HTML tags; components go through
// `createComponentMatcher`, which handles kebab-case, prefixes and import aliases.
export function defineTemplateVisitor(context: any, visitor: Record<string, (node: any) => void>) {
  const services = context.sourceCode.parserServices
  if (typeof services?.defineTemplateBodyVisitor !== 'function')
    return {}

  return services.defineTemplateBodyVisitor(visitor)
}

export function hasRawOptOut(node: any): boolean {
  return node.startTag.attributes.some(
    (attribute: any) => !attribute.directive && attribute.key.name === 'data-raw',
  )
}

/** Returns an attribute, including `:name`/`v-bind:name`, by its normalized name. */
export function getAttribute(node: any, name: string): any | null {
  return node.startTag.attributes.find((attribute: any) => {
    if (!attribute.directive)
      return attribute.key.name === name
    if (attribute.key.name?.name !== 'bind')
      return false
    const argument = attribute.key.argument
    return argument?.type === 'VIdentifier' && argument.name === name
  }) ?? null
}

export function hasAttribute(node: any, name: string): boolean {
  return !!getAttribute(node, name)
}

/** Accepts dynamic bindings and non-empty static string attributes. */
export function hasNonEmptyAttribute(node: any, name: string): boolean {
  const attribute = getAttribute(node, name)
  if (!attribute)
    return false
  if (attribute.directive)
    return true
  return typeof attribute.value?.value === 'string' && attribute.value.value.trim().length > 0
}

export function getStaticAttribute(node: any, name: string): string | null {
  const attribute = node.startTag.attributes.find(
    (candidate: any) => !candidate.directive && candidate.key.name === name && candidate.value,
  )
  return attribute?.value?.value ?? null
}

export function hasSlot(node: any, name: string): boolean {
  return (node.children ?? []).some((child: any) => {
    if (child.type !== 'VElement')
      return false
    return child.startTag.attributes.some((attribute: any) => {
      if (!attribute.directive || attribute.key.name?.name !== 'slot')
        return false
      const argument = attribute.key.argument
      return argument?.type === 'VIdentifier' && argument.name === name
    })
  })
}

/**
 * Whether the default slot can produce an accessible name. Interpolations and child elements
 * both count: their content is unknowable here, and for a rule that errors a missed
 * `<span>Save</span>` is far worse than staying quiet on a wrapped icon.
 */
export function hasLabelContent(node: any): boolean {
  return (node.children ?? []).some((child: any) => {
    if (child.type === 'VText')
      return child.value.trim().length > 0
    return child.type === 'VExpressionContainer' || child.type === 'VElement'
  })
}

export function hasVModel(node: any, argumentName: string | null): boolean {
  return node.startTag.attributes.some((attribute: any) => {
    if (!attribute.directive || attribute.key.name?.name !== 'model')
      return false
    const argument = attribute.key.argument
    if (argumentName === null)
      return !argument
    return argument?.type === 'VIdentifier' && argument.name === argumentName
  })
}
