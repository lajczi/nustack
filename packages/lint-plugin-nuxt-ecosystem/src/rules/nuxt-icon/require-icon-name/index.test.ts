import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtIconPlugin } from '../../../index.js'

describe('require-icon-name', () => {
  it('requires a non-empty name', () => {
    tester.run('require-icon-name', nuxtIconPlugin.rules['require-icon-name'], {
      valid: [
        { code: '<template><Icon name="uil:github" /></template>' },
        { code: '<template><Icon name="i-lucide-lightbulb" /></template>' },
        { code: '<template><Icon :name="icon" /></template>' },
        { code: '<template><Icon :name="\'uil:github\'" /></template>' },
        { code: '<template><button /></template>' },
        { code: '<template><UIcon /></template>' },
        {
          code: '<template><UIcon name="i-lucide-search" /></template>',
          settings: { '@nustack/nuxt-ui': { enabled: true, prefix: 'U' } },
        },
        {
          code: '<template><NuxtIcon name="uil:github" /></template>',
          settings: { '@nustack/nuxt-icon': { enabled: true, componentName: 'NuxtIcon' } },
        },
        { code: '<template><LazyIcon name="uil:github" /></template>' },
        { code: '<template><IconCSS name="uil:github" /></template>' },
      ],
      invalid: [
        { code: '<template><Icon /></template>', errors: [{ messageId: 'missingName', data: { component: 'Icon' } }] },
        { code: '<template><Icon name="" /></template>', errors: [{ messageId: 'missingName' }] },
        { code: '<template><Icon :name="\'\'" /></template>', errors: [{ messageId: 'missingName' }] },
        {
          code: '<template><UIcon /></template>',
          settings: { '@nustack/nuxt-ui': { enabled: true, prefix: 'U' } },
          errors: [{ messageId: 'missingName', data: { component: 'UIcon' } }],
        },
        {
          code: '<template><NuIcon /></template>',
          settings: { '@nustack/nuxt-ui': { enabled: true, prefix: 'Nu' } },
          errors: [{ messageId: 'missingName', data: { component: 'NuIcon' } }],
        },
        {
          code: '<template><NuxtIcon /></template>',
          settings: { '@nustack/nuxt-icon': { enabled: true, componentName: 'NuxtIcon' } },
          errors: [{ messageId: 'missingName', data: { component: 'NuxtIcon' } }],
        },
        { code: '<template><LazyIcon /></template>', errors: [{ messageId: 'missingName', data: { component: 'LazyIcon' } }] },
      ],
    })
  })
})
