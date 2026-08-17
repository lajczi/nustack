import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtIconPlugin } from '../../../index.js'

describe('no-dynamic-icon-name', () => {
  it('flags names the client-bundle scanner cannot see', () => {
    tester.run('no-dynamic-icon-name', nuxtIconPlugin.rules['no-dynamic-icon-name'], {
      valid: [
        { code: '<template><Icon name="lucide:home" /></template>' },
        { code: '<template><Icon :name="\'lucide:home\'" /></template>' },
        { code: '<template><Icon :name="ok ? \'lucide:check\' : \'lucide:x\'" /></template>' },
        { code: '<template><Icon /></template>' },
        { code: '<template><Icon v-bind="props" /></template>' },
        { code: '<template><Icon name="lucide:home" v-bind="attrs" /></template>' },
      ],
      invalid: [
        {
          code: '<template><Icon :name="icon" /></template>',
          errors: [{ messageId: 'dynamicName', data: { component: 'Icon' } }],
        },
        {
          code: '<template><Icon :name="`lucide:${icon}`" /></template>',
          errors: [{ messageId: 'dynamicName' }],
        },
        {
          code: '<template><UIcon :name="icon" /></template>',
          settings: { '@nustack/nuxt-ui': { enabled: true, prefix: 'U' } },
          errors: [{ messageId: 'dynamicName', data: { component: 'UIcon' } }],
        },
      ],
    })
  })
})
