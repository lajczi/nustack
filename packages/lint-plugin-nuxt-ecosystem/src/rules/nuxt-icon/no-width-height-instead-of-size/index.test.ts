import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtIconPlugin } from '../../../index.js'

describe('no-width-height-instead-of-size', () => {
  it('flags width/height without size', () => {
    tester.run('no-width-height-instead-of-size', nuxtIconPlugin.rules['no-width-height-instead-of-size'], {
      valid: [
        { code: '<template><Icon name="uil:github" size="24" /></template>' },
        { code: '<template><Icon name="uil:github" size="24" width="24" /></template>' },
        { code: '<template><Icon name="uil:github" /></template>' },
      ],
      invalid: [
        {
          code: '<template><Icon name="uil:github" width="24" /></template>',
          errors: [{ messageId: 'useSize', data: { component: 'Icon' } }],
        },
        { code: '<template><Icon name="uil:github" height="24" /></template>', errors: [{ messageId: 'useSize' }] },
        { code: '<template><Icon name="uil:github" width="24" height="24" /></template>', errors: [{ messageId: 'useSize' }] },
      ],
    })
  })
})
