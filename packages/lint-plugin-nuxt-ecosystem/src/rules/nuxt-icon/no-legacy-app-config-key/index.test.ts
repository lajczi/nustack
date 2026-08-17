import { describe, it } from 'vitest'
import { configRuleTester as tester } from '../../../../tests/config-rule-tester.js'
import { nuxtIconPlugin } from '../../../index.js'

describe('no-legacy-app-config-key', () => {
  it('flags nuxtIcon in app.config only', () => {
    tester.run('no-legacy-app-config-key', nuxtIconPlugin.rules['no-legacy-app-config-key'], {
      valid: [
        { code: 'export default defineAppConfig({ icon: { size: "24px" } })', filename: 'app.config.ts' },
        { code: 'export default defineNuxtConfig({ nuxtIcon: { size: "24px" } })' },
      ],
      invalid: [
        {
          code: 'export default defineAppConfig({ nuxtIcon: { size: "24px" } })',
          filename: 'app.config.ts',
          errors: [{ messageId: 'legacyKey' }],
        },
      ],
    })
  })
})
