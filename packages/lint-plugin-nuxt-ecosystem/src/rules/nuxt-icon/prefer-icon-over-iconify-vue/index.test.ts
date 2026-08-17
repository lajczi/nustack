import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtIconPlugin } from '../../../index.js'

describe('prefer-icon-over-iconify-vue', () => {
  it('flags Icon imports from @iconify/vue', () => {
    tester.run('prefer-icon-over-iconify-vue', nuxtIconPlugin.rules['prefer-icon-over-iconify-vue'], {
      valid: [
        { code: '<script setup lang="ts">\n</script><template><Icon name="uil:github" /></template>' },
        { code: '<script setup lang="ts">\nimport { getIcon } from \'@iconify/vue\'\n</script><template><div /></template>' },
        { code: '<script setup lang="ts">\nimport type { IconifyIcon } from \'@iconify/vue\'\n</script><template><div /></template>' },
      ],
      invalid: [
        {
          code: '<script setup lang="ts">\nimport { Icon } from \'@iconify/vue\'\n</script><template><Icon name="uil:github" /></template>',
          errors: [{ messageId: 'preferNuxtIcon', data: { component: 'Icon' } }],
        },
        {
          code: '<script setup lang="ts">\nimport * as Iconify from \'@iconify/vue\'\n</script><template><div /></template>',
          errors: [{ messageId: 'preferNuxtIcon' }],
        },
      ],
    })
  })
})
