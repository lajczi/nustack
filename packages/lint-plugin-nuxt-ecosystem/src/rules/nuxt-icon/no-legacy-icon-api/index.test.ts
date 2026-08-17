import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtIconPlugin } from '../../../index.js'

describe('no-legacy-icon-api', () => {
  it('flags removed components and emoji names', () => {
    tester.run('no-legacy-icon-api', nuxtIconPlugin.rules['no-legacy-icon-api'], {
      valid: [
        { code: '<template><Icon name="uil:github" /></template>' },
        { code: '<template><Icon name="i-lucide-smile" /></template>' },
        { code: '<template><Icon :name="emoji" /></template>' },
      ],
      invalid: [
        {
          code: '<template><IconCSS name="uil:github" /></template>',
          output: '<template><Icon name="uil:github" /></template>',
          errors: [{ messageId: 'removedComponent', data: { name: 'IconCSS', replacement: 'Icon' } }],
        },
        {
          code: '<template><IconSVG name="uil:github" /></template>',
          output: '<template><Icon name="uil:github" /></template>',
          errors: [{ messageId: 'removedComponent', data: { name: 'IconSVG', replacement: 'Icon' } }],
        },
        {
          code: '<template><icon-css name="uil:github" /></template>',
          output: '<template><icon name="uil:github" /></template>',
          errors: [{ messageId: 'removedComponent' }],
        },
        {
          code: '<template><LazyIconCSS name="uil:github" /></template>',
          output: '<template><LazyIcon name="uil:github" /></template>',
          errors: [{ messageId: 'removedComponent' }],
        },
        {
          code: '<template><IconCSS name="uil:github" /></template>',
          settings: { '@nustack/nuxt-icon': { enabled: true, componentName: 'NuxtIcon' } },
          output: '<template><NuxtIcon name="uil:github" /></template>',
          errors: [{ messageId: 'removedComponent', data: { name: 'IconCSS', replacement: 'NuxtIcon' } }],
        },
        {
          code: '<template><Icon name="😀" /></template>',
          errors: [{ messageId: 'emojiName' }],
        },
      ],
    })
  })
})
