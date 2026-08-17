import type { Context, Rule, Visitor } from '@oxlint/plugins'
import { docsUrl } from '../../../utils/docs-url.js'
import { findProperty, objectValue, staticKeyName, staticString } from '../config-ast.js'

function includesVue(glob: string): boolean {
  return glob.includes('vue')
}

export const noScanGlobWithoutVue: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow `icon.clientBundle.scan.globInclude` that drops `*.vue`.',
      url: docsUrl('nuxt-icon/no-scan-glob-without-vue'),
    },
    schema: [],
    messages: {
      missingVue: '`icon.clientBundle.scan.globInclude` replaces the defaults. Include a `*.vue` glob or Vue SFCs will not be scanned.',
    },
  },
  create(context: Context): Visitor {
    return {
      Property(node: any) {
        if (staticKeyName(node.key) !== 'icon')
          return
        const scan = objectValue(findProperty(objectValue(findProperty(objectValue(node), 'clientBundle')), 'scan'))
        const globInclude = findProperty(scan, 'globInclude')
        if (globInclude?.value?.type !== 'ArrayExpression')
          return

        const globs = globInclude.value.elements.map((element: any) => staticString(element))
        if (globs.some((glob: string | null) => glob === null))
          return
        if (globs.some((glob: string | null) => glob !== null && includesVue(glob)))
          return

        context.report({ node: globInclude.value, messageId: 'missingVue' })
      },
    }
  },
}
