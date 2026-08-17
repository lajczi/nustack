import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtIconPlugin } from '../../../index.js'

describe('no-invalid-icon-name', () => {
  it('flags separators and whitespace that cannot resolve', () => {
    tester.run('no-invalid-icon-name', nuxtIconPlugin.rules['no-invalid-icon-name'], {
      valid: [
        { code: '<template><Icon name="uil:github" /></template>' },
        { code: '<template><Icon name="i-uil-github" /></template>' },
        { code: '<template><Icon name="nuxt" /></template>' },
        { code: '<template><Icon name="MyLogo" /></template>' },
        { code: '<template><Icon :name="icon" /></template>' },
        { code: '<template><Icon name="" /></template>' },
      ],
      invalid: [
        {
          code: '<template><Icon name="uil/github" /></template>',
          errors: [{ messageId: 'invalidName', data: { component: 'Icon', name: 'uil/github' } }],
        },
        { code: '<template><Icon name="uil.github" /></template>', errors: [{ messageId: 'invalidName' }] },
        { code: '<template><Icon name="uil github" /></template>', errors: [{ messageId: 'invalidName' }] },
        {
          code: '<template><UIcon name="lucide/search" /></template>',
          settings: { '@nustack/nuxt-ui': { enabled: true, prefix: 'U' } },
          errors: [{ messageId: 'invalidName', data: { component: 'UIcon', name: 'lucide/search' } }],
        },
      ],
    })
  })
})
