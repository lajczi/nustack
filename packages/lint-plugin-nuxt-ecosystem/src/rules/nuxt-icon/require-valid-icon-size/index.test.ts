import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtIconPlugin } from '../../../index.js'

describe('require-valid-icon-size', () => {
  it('accepts numbers and CSS lengths', () => {
    tester.run('require-valid-icon-size', nuxtIconPlugin.rules['require-valid-icon-size'], {
      valid: [
        { code: '<template><Icon name="uil:github" size="24" /></template>' },
        { code: '<template><Icon name="uil:github" :size="24" /></template>' },
        { code: '<template><Icon name="uil:github" size="24px" /></template>' },
        { code: '<template><Icon name="uil:github" size="1em" /></template>' },
        { code: '<template><Icon name="uil:github" size="2rem" /></template>' },
        { code: '<template><Icon name="uil:github" :size="iconSize" /></template>' },
        { code: '<template><Icon name="uil:github" /></template>' },
      ],
      invalid: [
        {
          code: '<template><Icon name="uil:github" size="xl" /></template>',
          errors: [{ messageId: 'invalidSize', data: { component: 'Icon', value: 'xl' } }],
        },
        { code: '<template><Icon name="uil:github" size="large" /></template>', errors: [{ messageId: 'invalidSize' }] },
      ],
    })
  })
})
