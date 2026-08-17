import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtIconPlugin } from '../../../index.js'

describe('no-ignored-mode-on-component-icon', () => {
  it('flags mode on a PascalCase global component name', () => {
    tester.run('no-ignored-mode-on-component-icon', nuxtIconPlugin.rules['no-ignored-mode-on-component-icon'], {
      valid: [
        { code: '<template><Icon name="MyLogo" /></template>' },
        { code: '<template><Icon name="uil:github" mode="svg" /></template>' },
        { code: '<template><Icon name="i-lucide-home" mode="css" /></template>' },
        { code: '<template><Icon :name="comp" mode="svg" /></template>' },
      ],
      invalid: [
        {
          code: '<template><Icon name="MyLogo" mode="svg" /></template>',
          errors: [{ messageId: 'ignoredMode', data: { component: 'Icon', name: 'MyLogo' } }],
        },
      ],
    })
  })
})
