import { describe, it } from 'vitest'
import { configRuleTester as tester } from '../../../../tests/config-rule-tester.js'
import { nuxtIconPlugin } from '../../../index.js'

describe('require-client-bundle-when-provider-none', () => {
  it('requires scan or icons when provider is none', () => {
    tester.run('require-client-bundle-when-provider-none', nuxtIconPlugin.rules['require-client-bundle-when-provider-none'], {
      valid: [
        { code: 'export default defineNuxtConfig({ icon: { provider: "server" } })' },
        { code: 'export default defineNuxtConfig({ icon: { provider: "none", clientBundle: { scan: true } } })' },
        { code: 'export default defineNuxtConfig({ icon: { provider: "none", clientBundle: { icons: ["lucide:check"] } } })' },
        { code: 'export default defineNuxtConfig({ icon: { provider: "none", clientBundle: { scan: { globInclude: ["**/*.vue"] } } } })' },
        { code: 'export default defineAppConfig({ icon: { provider: "none" } })', filename: 'app.config.ts' },
      ],
      invalid: [
        {
          code: 'export default defineNuxtConfig({ icon: { provider: "none" } })',
          errors: [{ messageId: 'missingClientBundle' }],
        },
        {
          code: 'export default defineNuxtConfig({ icon: { provider: "none", clientBundle: { icons: [] } } })',
          errors: [{ messageId: 'missingClientBundle' }],
        },
      ],
    })
  })
})
