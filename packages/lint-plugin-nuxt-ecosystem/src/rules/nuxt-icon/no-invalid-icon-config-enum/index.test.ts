import { describe, it } from 'vitest'
import { configRuleTester as tester } from '../../../../tests/config-rule-tester.js'
import { nuxtIconPlugin } from '../../../index.js'

describe('no-invalid-icon-config-enum', () => {
  it('flags undocumented enum values', () => {
    tester.run('no-invalid-icon-config-enum', nuxtIconPlugin.rules['no-invalid-icon-config-enum'], {
      valid: [
        { code: 'export default defineNuxtConfig({ icon: { provider: "server", mode: "css", fallbackToApi: true, serverBundle: "auto" } })' },
        { code: 'export default defineNuxtConfig({ icon: { serverBundle: { collections: ["uil"] } } })' },
        { code: 'export default defineNuxtConfig({ icon: { provider: provider } })' },
      ],
      invalid: [
        {
          code: 'export default defineNuxtConfig({ icon: { provider: "cdn" } })',
          errors: [{ messageId: 'invalidEnum', data: { name: 'provider', allowed: "'server', 'iconify', 'none'", value: 'cdn' } }],
        },
        { code: 'export default defineNuxtConfig({ icon: { mode: "img" } })', errors: [{ messageId: 'invalidEnum' }] },
        { code: 'export default defineNuxtConfig({ icon: { fallbackToApi: "sometimes" } })', errors: [{ messageId: 'invalidEnum' }] },
        { code: 'export default defineNuxtConfig({ icon: { serverBundle: "cdn" } })', errors: [{ messageId: 'invalidEnum' }] },
      ],
    })
  })
})
