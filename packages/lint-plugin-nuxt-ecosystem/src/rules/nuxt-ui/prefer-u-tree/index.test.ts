import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import { preferUTree } from './index.js'

const tester = new RuleTester({
  languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser },
})

describe('prefer-u-tree', () => {
  it('reports only explicit static tree roots', () => {
    tester.run('prefer-u-tree', preferUTree as never, {
      valid: [
        { filename: 'component.vue', code: '<template><UTree :items="items" /></template>' },
        {
          filename: 'component.vue',
          code: '<template><UTree role="tree" :items="items" /></template>',
        },
        {
          filename: 'component.vue',
          code: '<template><ul role="tree" data-raw><li role="treeitem" /></ul></template>',
        },
        { filename: 'component.vue', code: '<template><ul :role="role"><li /></ul></template>' },
        {
          filename: 'component.vue',
          code: '<template><ul :role="\'tree\'"><li /></ul></template>',
        },
        { filename: 'component.vue', code: '<template><ul role="treegrid"><li /></ul></template>' },
        {
          filename: 'component.vue',
          code: '<template><ul><TreeNode v-for="item in items" :item="item" /></ul></template>',
        },
      ],
      invalid: [
        {
          filename: 'component.vue',
          code: '<template><ul role="tree"><li role="treeitem" /></ul></template>',
          errors: [{ messageId: 'preferUTree' }],
        },
        {
          filename: 'component.vue',
          code: '<template><CustomTree role="tree" /></template>',
          errors: [{ messageId: 'preferUTree' }],
        },
      ],
    })
  })
})
