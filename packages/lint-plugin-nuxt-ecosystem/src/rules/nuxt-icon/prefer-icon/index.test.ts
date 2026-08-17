import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtIconPlugin } from '../../../index.js'

describe('prefer-icon', () => {
  it('prefers Icon for Iconify classes unless Nuxt UI is enabled', () => {
    tester.run('prefer-icon', nuxtIconPlugin.rules['prefer-icon'], {
      valid: [
        { code: '<template><Icon name="i-lucide-search" /></template>' },
        { code: '<template><i class="not-an-icon" /></template>' },
        {
          code: '<template><i class="i-lucide-search" /></template>',
          settings: { '@nustack/nuxt-ui': { enabled: true, prefix: 'U' } },
        },
      ],
      invalid: [
        {
          code: '<template><i class="i-lucide-search" /></template>',
          errors: [{ messageId: 'preferIcon', data: { component: 'Icon', icon: 'i-lucide-search' } }],
        },
        {
          code: '<template><span class="i-heroicons-home" /></template>',
          errors: [{ messageId: 'preferIcon', data: { component: 'Icon', icon: 'i-heroicons-home' } }],
        },
        {
          code: '<template><i class="i-lucide-search" /></template>',
          settings: { '@nustack/nuxt-icon': { enabled: true, componentName: 'NuxtIcon' } },
          errors: [{ messageId: 'preferIcon', data: { component: 'NuxtIcon', icon: 'i-lucide-search' } }],
        },
      ],
    })
  })
})
