import type { Rule as OxlintRule } from '@oxlint/plugins'
import type { ESLint } from 'eslint'
import tsParser from '@typescript-eslint/parser'
import { RuleTester } from 'eslint'

type ESLintRule = NonNullable<NonNullable<ESLint.Plugin['rules']>[string]>
type RuleTests = Parameters<RuleTester['run']>[2]

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: tsParser,
  },
})

export const configRuleTester = {
  run(name: string, rule: ESLintRule | OxlintRule | undefined, tests: RuleTests, filename = 'nuxt.config.ts') {
    if (!rule)
      throw new Error(`Rule "${name}" is not registered`)

    tester.run(name, rule as Parameters<RuleTester['run']>[1], {
      ...tests,
      valid: tests.valid.map(test => typeof test === 'string' ? { code: test, filename } : { filename, ...test }),
      invalid: tests.invalid.map(test => ({ filename, ...test })),
    })
  },
}
