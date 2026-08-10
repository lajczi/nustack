import type { Linter } from 'eslint'
import { describe, expect, it } from 'vitest'
import plugin, { nuxtUiConfigs } from './index.js'

function packRules(options?: Parameters<typeof nuxtUiConfigs>[0]): Partial<Linter.RulesRecord> {
  return nuxtUiConfigs(options).find(config => config.name === 'nustack/nuxt-ui')!.rules!
}

function levelOf(entry: Linter.RuleEntry | undefined): string {
  return Array.isArray(entry) ? String(entry[0]) : String(entry)
}

describe('nuxtUiConfigs', () => {
  it('configures every rule the plugin exposes', () => {
    expect(Object.keys(packRules()).sort()).toEqual(
      Object.keys(plugin.rules!).map(name => `@nustack/nuxt-ui/${name}`).sort(),
    )
  })

  it('errors on broken code and warns on preferences', () => {
    const rules = packRules()
    expect(levelOf(rules['@nustack/nuxt-ui/require-icon-button-label'])).toBe('error')
    expect(levelOf(rules['@nustack/nuxt-ui/no-deprecated-components'])).toBe('error')
    expect(levelOf(rules['@nustack/nuxt-ui/prefer-u-button'])).toBe('warn')
    expect(levelOf(rules['@nustack/nuxt-ui/require-form-field-name'])).toBe('warn')
  })

  it('passes a custom prefix without losing the severity', () => {
    const rules = packRules({ prefix: 'Nu' })
    expect(rules['@nustack/nuxt-ui/require-icon-button-label']).toEqual(['error', { prefix: 'Nu' }])
    // No component resolution, so no `prefix` option to accept.
    expect(rules['@nustack/nuxt-ui/prefer-u-icon']).toBe('warn')
  })
})
