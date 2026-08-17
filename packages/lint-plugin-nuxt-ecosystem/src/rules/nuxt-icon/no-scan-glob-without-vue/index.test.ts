import { describe, it } from 'vitest'
import { configRuleTester as tester } from '../../../../tests/config-rule-tester.js'
import { nuxtIconPlugin } from '../../../index.js'

describe('no-scan-glob-without-vue', () => {
  it('flags globInclude that drops Vue files', () => {
    tester.run('no-scan-glob-without-vue', nuxtIconPlugin.rules['no-scan-glob-without-vue'], {
      valid: [
        { code: 'export default defineNuxtConfig({ icon: { clientBundle: { scan: true } } })' },
        { code: 'export default defineNuxtConfig({ icon: { clientBundle: { scan: { globInclude: ["**/*.vue"] } } } })' },
        { code: 'export default defineNuxtConfig({ icon: { clientBundle: { scan: { globInclude: ["**/*.{vue,md}"] } } } })' },
        { code: 'export default defineNuxtConfig({ icon: { clientBundle: { scan: { globInclude: extra } } } })' },
      ],
      invalid: [
        {
          code: 'export default defineNuxtConfig({ icon: { clientBundle: { scan: { globInclude: ["**/*.md"] } } } })',
          errors: [{ messageId: 'missingVue' }],
        },
      ],
    })
  })
})
