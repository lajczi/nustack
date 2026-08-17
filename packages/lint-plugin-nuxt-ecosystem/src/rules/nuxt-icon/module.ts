import type { Plugin } from '@oxlint/plugins'
import type { ESLint, Linter } from 'eslint'
import { eslintCompatPlugin } from '@oxlint/plugins'
import { iconConfigSettings } from './components.js'
import { noCustomCollectionsWithoutBundle } from './no-custom-collections-without-bundle/index.js'
import { noCustomizeInNuxtConfig } from './no-customize-in-nuxt-config/index.js'
import { noDynamicIconName } from './no-dynamic-icon-name/index.js'
import { noIconifyVueProps } from './no-iconify-vue-props/index.js'
import { noIconSlotFallback } from './no-icon-slot-fallback/index.js'
import { noIgnoredModeOnComponentIcon } from './no-ignored-mode-on-component-icon/index.js'
import { noInvalidIconConfigEnum } from './no-invalid-icon-config-enum/index.js'
import { noInvalidIconName } from './no-invalid-icon-name/index.js'
import { noLegacyAppConfigKey } from './no-legacy-app-config-key/index.js'
import { noLegacyIconApi } from './no-legacy-icon-api/index.js'
import { noScanGlobWithoutVue } from './no-scan-glob-without-vue/index.js'
import { noWidthHeightInsteadOfSize } from './no-width-height-instead-of-size/index.js'
import { preferIcon } from './prefer-icon/index.js'
import { preferIconOverIconifyVue } from './prefer-icon-over-iconify-vue/index.js'
import { requireClientBundleWhenProviderNone } from './require-client-bundle-when-provider-none/index.js'
import { requireIconName } from './require-icon-name/index.js'
import { requireValidIconSize } from './require-valid-icon-size/index.js'

export const NUXT_ICON_CONFIG_GLOB = [
  '**/nuxt.config.{ts,js,mjs,mts,cjs,cts}',
  '**/app.config.{ts,js,mjs,mts,cjs,cts}',
]

export const nuxtIconPlugin = eslintCompatPlugin({
  meta: {
    name: '@nustackjs/lint-plugin-nuxt-ecosystem/nuxt-icon',
  },
  rules: {
    'no-custom-collections-without-bundle': noCustomCollectionsWithoutBundle,
    'no-customize-in-nuxt-config': noCustomizeInNuxtConfig,
    'no-dynamic-icon-name': noDynamicIconName,
    'no-icon-slot-fallback': noIconSlotFallback,
    'no-iconify-vue-props': noIconifyVueProps,
    'no-ignored-mode-on-component-icon': noIgnoredModeOnComponentIcon,
    'no-invalid-icon-config-enum': noInvalidIconConfigEnum,
    'no-invalid-icon-name': noInvalidIconName,
    'no-legacy-app-config-key': noLegacyAppConfigKey,
    'no-legacy-icon-api': noLegacyIconApi,
    'no-scan-glob-without-vue': noScanGlobWithoutVue,
    'no-width-height-instead-of-size': noWidthHeightInsteadOfSize,
    'prefer-icon': preferIcon,
    'prefer-icon-over-iconify-vue': preferIconOverIconifyVue,
    'require-client-bundle-when-provider-none': requireClientBundleWhenProviderNone,
    'require-icon-name': requireIconName,
    'require-valid-icon-size': requireValidIconSize,
  },
}) as Plugin & ESLint.Plugin

export type NuxtIconPreset = 'minimal' | 'recommended'
export interface NuxtIconRulesOptions {
  preset?: NuxtIconPreset | false
  rules?: Linter.RulesRecord
}
export interface NuxtIconConfigOptions extends NuxtIconRulesOptions {
  componentName?: string
  nuxtUi?: false | { prefix?: string }
}

const NUXT_ICON_VUE_MINIMAL_RULES = {
  'no-icon-slot-fallback': 'error',
  'no-iconify-vue-props': 'error',
  'no-invalid-icon-name': 'error',
  'no-legacy-icon-api': 'error',
  'require-icon-name': 'error',
} as const satisfies Record<string, 'error'>

const NUXT_ICON_CONFIG_MINIMAL_RULES = {
  'no-custom-collections-without-bundle': 'error',
  'no-customize-in-nuxt-config': 'error',
  'no-invalid-icon-config-enum': 'error',
  'no-legacy-app-config-key': 'error',
  'no-scan-glob-without-vue': 'error',
  'require-client-bundle-when-provider-none': 'error',
} as const satisfies Record<string, 'error'>

const NUXT_ICON_VUE_CONVENTION_RULES = {
  'no-dynamic-icon-name': 'warn',
  'no-ignored-mode-on-component-icon': 'warn',
  'no-width-height-instead-of-size': 'warn',
  'prefer-icon': 'warn',
  'prefer-icon-over-iconify-vue': 'warn',
  'require-valid-icon-size': 'warn',
} as const satisfies Record<string, 'warn'>

const NUXT_ICON_MINIMAL_RULES = {
  ...NUXT_ICON_VUE_MINIMAL_RULES,
  ...NUXT_ICON_CONFIG_MINIMAL_RULES,
} as const

export const NUXT_ICON_PRESET_RULES = {
  minimal: NUXT_ICON_MINIMAL_RULES,
  recommended: { ...NUXT_ICON_MINIMAL_RULES, ...NUXT_ICON_VUE_CONVENTION_RULES },
} as const

const VUE_RULE_NAMES = new Set([
  ...Object.keys(NUXT_ICON_VUE_MINIMAL_RULES),
  ...Object.keys(NUXT_ICON_VUE_CONVENTION_RULES),
])
const CONFIG_RULE_NAMES = new Set(Object.keys(NUXT_ICON_CONFIG_MINIMAL_RULES))

export const nuxtIconPlugins: Record<string, ESLint.Plugin> = { '@nustack/nuxt-icon': nuxtIconPlugin }

function namespaced(rules: Record<string, Linter.RuleSeverity>): Linter.RulesRecord {
  return Object.fromEntries(Object.entries(rules).map(([name, level]) => [`@nustack/nuxt-icon/${name}`, level]))
}

export function nuxtIconRules(options: NuxtIconRulesOptions = {}): Linter.RulesRecord {
  const { preset = 'recommended', rules = {} } = options
  const configured = preset === false
    ? {}
    : namespaced(NUXT_ICON_PRESET_RULES[preset])
  return { ...configured, ...rules }
}

function selectRules(all: Linter.RulesRecord, names: Set<string>, extrasOnVue: boolean): Linter.RulesRecord {
  return Object.fromEntries(Object.entries(all).filter(([id]) => {
    if (!id.startsWith('@nustack/nuxt-icon/'))
      return extrasOnVue
    return names.has(id.slice('@nustack/nuxt-icon/'.length))
  }))
}

export function nuxtIconVueRules(options: NuxtIconRulesOptions = {}): Linter.RulesRecord {
  return selectRules(nuxtIconRules(options), VUE_RULE_NAMES, true)
}

export function nuxtIconConfigFileRules(options: NuxtIconRulesOptions = {}): Linter.RulesRecord {
  return selectRules(nuxtIconRules(options), CONFIG_RULE_NAMES, false)
}

function sharedOptions(options: NuxtIconConfigOptions): { rulesOptions: NuxtIconRulesOptions, settings: Record<string, unknown> } {
  const { nuxtUi, componentName, ...rulesOptions } = options
  return {
    rulesOptions,
    settings: iconConfigSettings({ componentName, nuxtUi }),
  }
}

export function nuxtIconConfig(options: NuxtIconConfigOptions = {}): Linter.Config {
  const { rulesOptions, settings } = sharedOptions(options)
  return {
    name: 'nustack/nuxt-icon',
    files: ['**/*.vue'],
    plugins: nuxtIconPlugins,
    rules: nuxtIconVueRules(rulesOptions),
    settings,
  }
}

export function nuxtIconConfigFiles(options: NuxtIconConfigOptions = {}): Linter.Config {
  const { rulesOptions, settings } = sharedOptions(options)
  return {
    name: 'nustack/nuxt-icon/config',
    files: NUXT_ICON_CONFIG_GLOB,
    plugins: nuxtIconPlugins,
    rules: nuxtIconConfigFileRules(rulesOptions),
    settings,
  }
}

export function nuxtIconConfigs(options: NuxtIconConfigOptions = {}): Linter.Config[] {
  return [nuxtIconConfig(options), nuxtIconConfigFiles(options)]
}
