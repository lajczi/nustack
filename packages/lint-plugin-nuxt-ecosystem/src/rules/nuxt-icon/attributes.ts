import type { AST as VueAST } from 'vue-eslint-parser'
import { normalizePropName } from '../../utils/template.js'

export function findAttribute(
  node: VueAST.VElement,
  name: string,
): VueAST.VAttribute | VueAST.VDirective | null {
  const match = node.startTag.attributes.find((attribute) => {
    if (!attribute.directive)
      return normalizePropName(attribute.key.name) === normalizePropName(name)
    if (attribute.key.name.name !== 'bind')
      return false
    const argument = attribute.key.argument
    return argument?.type === 'VIdentifier' && normalizePropName(argument.name) === normalizePropName(name)
  })
  return match ?? null
}

export function attributeNameRange(
  attribute: VueAST.VAttribute | VueAST.VDirective,
): [number, number] | null {
  if (!attribute.directive)
    return attribute.key.range
  const argument = attribute.key.argument
  return argument?.type === 'VIdentifier' ? argument.range : null
}
