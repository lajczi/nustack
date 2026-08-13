import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

describe('require-form-control-label', () => {
  it('requires accessible labels on form controls', () => {
    tester.run('require-form-control-label', nuxtUiPlugin.rules['require-form-control-label'], {
      valid: [
        { code: '<template><UInput aria-label="Search" /></template>' },
        { code: '<template><UCheckboxGroup legend="Theme" /></template>' },
        { code: '<template><UFormField label="Email"><UInput /></UFormField></template>' },
        { code: '<template><UFormField><template #label>Email</template><UInput /></UFormField></template>' },
      ],
      invalid: [
        { code: '<template><UInput placeholder="Search" /></template>', errors: [{ messageId: 'missingLabel' }] },
        { code: '<template><URadioGroup :items="items" /></template>', errors: [{ messageId: 'missingLabel' }] },
        { code: '<template><UFormField><UInput /></UFormField></template>', errors: [{ messageId: 'missingLabel' }] },
      ],
    })
  })
})
