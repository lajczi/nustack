import { describe, it } from 'vitest'
import { configRuleTester as tester } from '../../../../tests/config-rule-tester.js'
import { nuxtIconPlugin } from '../../../index.js'

describe('no-custom-collections-without-bundle', () => {
  it('flags custom collections that the Iconify provider cannot serve', () => {
    tester.run('no-custom-collections-without-bundle', nuxtIconPlugin.rules['no-custom-collections-without-bundle'], {
      valid: [
        { code: 'export default defineNuxtConfig({ icon: { customCollections: [{ prefix: "my", dir: "./icons" }] } })' },
        { code: 'export default defineNuxtConfig({ ssr: false, icon: { customCollections: [{ prefix: "my", dir: "./icons" }] } })' },
        { code: 'export default defineNuxtConfig({ icon: { provider: "iconify", customCollections: [{ prefix: "my", dir: "./icons" }] } })' },
        { code: 'export default defineNuxtConfig({ icon: { provider: "server", customCollections: [{ prefix: "my", dir: "./icons" }] } })' },
        { code: 'export default defineNuxtConfig({ ssr: false, icon: { provider: "server", customCollections: [{ prefix: "my", dir: "./icons" }] } })' },
        { code: 'export default defineNuxtConfig({ ssr: false, icon: { clientBundle: { includeCustomCollections: true }, customCollections: [{ prefix: "my", dir: "./icons" }] } })' },
        { code: 'export default defineNuxtConfig({ ssr: false, icon: { provider: provider, customCollections: collections } })' },
      ],
      invalid: [
        {
          code: 'export default defineNuxtConfig({ ssr: false, icon: { clientBundle: { includeCustomCollections: false }, customCollections: [{ prefix: "my", dir: "./icons" }] } })',
          errors: [{ messageId: 'missingCustomCollections' }],
        },
        {
          code: 'export default defineNuxtConfig({ icon: { provider: "iconify", clientBundle: { includeCustomCollections: false }, customCollections: [{ prefix: "my", dir: "./icons" }] } })',
          errors: [{ messageId: 'missingCustomCollections' }],
        },
      ],
    })
  })
})
