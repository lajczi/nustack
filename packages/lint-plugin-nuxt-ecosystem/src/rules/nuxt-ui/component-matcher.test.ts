import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../index.js'

const tester = new RuleTester({
  languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser },
})

const iconButton = plugin.rules?.['require-icon-button-label']
function sfc(script: string, template: string) {
  return `<script setup>\n${script}\n</script>\n<template>${template}</template>`
}

describe('component identification', () => {
  it('matches every auto-import spelling of a component', () => {
    tester.run('require-icon-button-label', iconButton as never, {
      valid: [],
      invalid: [
        { filename: 'c.vue', code: '<template><UButton icon="i-lucide-x" /></template>', errors: 1 },
        { filename: 'c.vue', code: '<template><u-button icon="i-lucide-x" /></template>', errors: 1 },
        { filename: 'c.vue', code: '<template><LazyUButton icon="i-lucide-x" /></template>', errors: 1 },
        { filename: 'c.vue', code: '<template><lazy-u-button icon="i-lucide-x" /></template>', errors: 1 },
      ],
    })
  })

  it('honours a configured ui.prefix', () => {
    tester.run('require-icon-button-label', iconButton as never, {
      valid: [
        // `UButton` is not a component when the project prefix is `Nu`.
        { filename: 'c.vue', code: '<template><UButton icon="i-lucide-x" /></template>', options: [{ prefix: 'Nu' }] },
      ],
      invalid: [
        { filename: 'c.vue', code: '<template><NuButton icon="i-lucide-x" /></template>', options: [{ prefix: 'Nu' }], errors: 1 },
        { filename: 'c.vue', code: '<template><nu-button icon="i-lucide-x" /></template>', options: [{ prefix: 'Nu' }], errors: 1 },
        // An empty prefix disables prefixing entirely.
        { filename: 'c.vue', code: '<template><Button icon="i-lucide-x" /></template>', options: [{ prefix: '' }], errors: 1 },
      ],
    })
  })

  it('follows named imports through an alias', () => {
    tester.run('require-icon-button-label', iconButton as never, {
      valid: [
        // Imported from `#components` but not a Nuxt UI component.
        { filename: 'c.vue', code: sfc('import { MyThing } from \'#components\'', '<MyThing icon="i-lucide-x" />') },
      ],
      invalid: [
        { filename: 'c.vue', code: sfc('import { UButton as IconButton } from \'#components\'', '<IconButton icon="i-lucide-x" />'), errors: 1 },
        { filename: 'c.vue', code: sfc('import { UButton as IconButton } from \'@nuxt/ui\'', '<IconButton icon="i-lucide-x" />'), errors: 1 },
        { filename: 'c.vue', code: sfc('import Btn from \'@nuxt/ui/components/Button.vue\'', '<Btn icon="i-lucide-x" />'), errors: 1 },
      ],
    })
  })

  it('respects local shadowing of a Nuxt UI name', () => {
    tester.run('require-icon-button-label', iconButton as never, {
      valid: [
        { filename: 'c.vue', code: sfc('import UButton from \'./MyButton.vue\'', '<UButton icon="i-lucide-x" />') },
        { filename: 'c.vue', code: sfc('import { UButton } from \'~/components/ui\'', '<UButton icon="i-lucide-x" />') },
      ],
      invalid: [],
    })
  })

  it('resolves <component :is> only when the target is static', () => {
    tester.run('require-icon-button-label', iconButton as never, {
      valid: [
        { filename: 'c.vue', code: '<template><component :is="resolved" icon="i-lucide-x" /></template>' },
        { filename: 'c.vue', code: '<template><component :is="map[key]" icon="i-lucide-x" /></template>' },
      ],
      invalid: [
        { filename: 'c.vue', code: '<template><component is="UButton" icon="i-lucide-x" /></template>', errors: 1 },
        { filename: 'c.vue', code: '<template><component :is="\'UButton\'" icon="i-lucide-x" /></template>', errors: 1 },
        { filename: 'c.vue', code: sfc('import { UButton } from \'#components\'', '<component :is="UButton" icon="i-lucide-x" />'), errors: 1 },
      ],
    })
  })

  it('does not mistake native tags for components', () => {
    tester.run('no-conflicting-state-props', plugin.rules?.['no-conflicting-state-props'] as never, {
      valid: [
        { filename: 'c.vue', code: '<template><ul default-value="a" model-value="b" /></template>' },
        { filename: 'c.vue', code: '<template><use default-open open /></template>' },
      ],
      invalid: [
        { filename: 'c.vue', code: '<template><u-modal default-open open /></template>', errors: 1 },
        // The conflict is a component-authoring convention, so it is not limited to Nuxt UI.
        { filename: 'c.vue', code: '<template><UserCard default-value="a" model-value="b" /></template>', errors: 1 },
      ],
    })
  })

  it('reports multi-word components with their real casing', () => {
    tester.run('require-form-control-label', plugin.rules?.['require-form-control-label'] as never, {
      valid: [],
      invalid: [
        {
          filename: 'c.vue',
          code: '<template><UInputMenu :items="items" /></template>',
          errors: [{ messageId: 'missingLabel', data: { component: 'UInputMenu' } }],
        },
        {
          filename: 'c.vue',
          code: '<template><u-checkbox-group :items="items" /></template>',
          errors: [{ messageId: 'missingLabel', data: { component: 'UCheckboxGroup' } }],
        },
      ],
    })
  })

  it('resolves renamed components across spellings', () => {
    tester.run('no-deprecated-components', plugin.rules?.['no-deprecated-components'] as never, {
      valid: [
        { filename: 'c.vue', code: sfc('import UButtonGroup from \'./ButtonGroup.vue\'', '<UButtonGroup />') },
      ],
      invalid: [
        {
          filename: 'c.vue',
          code: '<template><u-button-group /></template>',
          errors: [{ messageId: 'deprecated', data: { name: 'UButtonGroup', replacement: 'UFieldGroup' } }],
        },
        {
          filename: 'c.vue',
          code: '<template><LazyUPageMarquee /></template>',
          errors: [{ messageId: 'deprecated', data: { name: 'UPageMarquee', replacement: 'UMarquee' } }],
        },
      ],
    })
  })
})
