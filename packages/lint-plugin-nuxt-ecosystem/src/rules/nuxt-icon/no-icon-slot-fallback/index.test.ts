import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtIconPlugin } from '../../../index.js'

describe('no-icon-slot-fallback', () => {
  it('flags default-slot fallback content', () => {
    tester.run('no-icon-slot-fallback', nuxtIconPlugin.rules['no-icon-slot-fallback'], {
      valid: [
        { code: '<template><Icon name="uil:github" /></template>' },
        { code: '<template><Icon name="uil:github"></Icon></template>' },
        { code: '<template><Icon name="uil:github"> </Icon></template>' },
      ],
      invalid: [
        {
          code: '<template><Icon name="uil:github">Loading</Icon></template>',
          errors: [{ messageId: 'slotFallback', data: { component: 'Icon' } }],
        },
        {
          code: '<template><Icon name="uil:github">{{ label }}</Icon></template>',
          errors: [{ messageId: 'slotFallback' }],
        },
        {
          code: '<template><UIcon name="i-lucide-search">x</UIcon></template>',
          settings: { '@nustack/nuxt-ui': { enabled: true, prefix: 'U' } },
          errors: [{ messageId: 'slotFallback', data: { component: 'UIcon' } }],
        },
      ],
    })
  })
})
