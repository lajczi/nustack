import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtIconPlugin } from '../../../index.js'

describe('no-iconify-vue-props', () => {
  it('rewrites Iconify Vue props to the Nuxt API', () => {
    tester.run('no-iconify-vue-props', nuxtIconPlugin.rules['no-iconify-vue-props'], {
      valid: [
        { code: '<template><Icon name="uil:github" /></template>' },
        { code: '<template><Icon name="uil:github" :customize="fn" /></template>' },
        { code: '<template><Icon name="uil:github" :customize="false" /></template>' },
      ],
      invalid: [
        {
          code: '<template><Icon icon="uil:github" /></template>',
          output: '<template><Icon name="uil:github" /></template>',
          errors: [{ messageId: 'iconProp', data: { component: 'Icon' } }],
        },
        {
          code: '<template><Icon :icon="id" /></template>',
          output: '<template><Icon :name="id" /></template>',
          errors: [{ messageId: 'iconProp' }],
        },
        {
          code: '<template><Icon name="uil:github" :customise="fn" /></template>',
          output: '<template><Icon name="uil:github" :customize="fn" /></template>',
          errors: [{ messageId: 'customiseProp' }],
        },
        {
          code: '<template><Icon icon="uil:github" name="uil:twitter" /></template>',
          errors: [{ messageId: 'iconProp' }],
        },
        {
          code: '<template><UIcon icon="i-lucide-search" /></template>',
          settings: { '@nustack/nuxt-ui': { enabled: true, prefix: 'U' } },
          output: '<template><UIcon name="i-lucide-search" /></template>',
          errors: [{ messageId: 'iconProp', data: { component: 'UIcon' } }],
        },
      ],
    })
  })
})
