import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

const rule = plugin.rules?.['prefer-u-form-field']

describe('prefer-u-form-field', () => {
  it('reports identifiable hand-written label/control pairs', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })

    tester.run('prefer-u-form-field', rule as never, {
      valid: [
        { filename: 'component.vue', code: '<template><UFormField label="Email"><UInput /></UFormField></template>' },
        { filename: 'component.vue', code: '<template><label>Decorative text</label></template>' },
        { filename: 'component.vue', code: '<template><label for="panel">Panel</label><section id="panel" /></template>' },
        { filename: 'component.vue', code: '<template><label for="missing">External control</label></template>' },
        { filename: 'component.vue', code: '<template><label for="email" data-raw>Email</label><input id="email"></template>' },
      ],
      invalid: [
        { filename: 'component.vue', code: '<template><label>Email <UInput /></label></template>', errors: [{ messageId: 'preferUFormField' }] },
        { filename: 'component.vue', code: '<template><label><span>Name</span><input></label></template>', errors: [{ messageId: 'preferUFormField' }] },
        { filename: 'component.vue', code: '<template><label for="country">Country</label><USelect id="country" /></template>', errors: [{ messageId: 'preferUFormField' }] },
      ],
    })
  })
})
