import { describe, it } from 'vitest'
import { configRuleTester as tester } from '../../../../tests/config-rule-tester.js'
import { nuxtIconPlugin } from '../../../index.js'

describe('no-customize-in-nuxt-config', () => {
  it('flags customize in nuxt.config only', () => {
    tester.run('no-customize-in-nuxt-config', nuxtIconPlugin.rules['no-customize-in-nuxt-config'], {
      valid: [
        { code: 'export default defineNuxtConfig({ icon: { size: "24px" } })' },
        { code: 'export default defineAppConfig({ icon: { customize: (c) => c } })', filename: 'app.config.ts' },
      ],
      invalid: [
        {
          code: 'export default defineNuxtConfig({ icon: { customize: (c) => c } })',
          errors: [{ messageId: 'customizeInNuxtConfig' }],
        },
      ],
    })
  })
})
