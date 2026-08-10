import type { ESLint, Linter, Rule } from 'eslint'
import { eslintCompatPlugin } from '@oxlint/plugins'
import { noConflictingStateProps as noConflictingStatePropsRule } from './rules/nuxt-ui/no-conflicting-state-props/index.js'
import { noDeprecatedComponents as noDeprecatedComponentsRule } from './rules/nuxt-ui/no-deprecated-components/index.js'
import { noDeprecatedModelModifiers as noDeprecatedModelModifiersRule } from './rules/nuxt-ui/no-deprecated-model-modifiers/index.js'
import { noInvalidPropCombinations as noInvalidPropCombinationsRule } from './rules/nuxt-ui/no-invalid-prop-combinations/index.js'
import { preferLinkTo as preferLinkToRule } from './rules/nuxt-ui/prefer-link-to/index.js'
import { preferUButton as preferUButtonRule } from './rules/nuxt-ui/prefer-u-button/index.js'
import { preferUFormControls as preferUFormControlsRule } from './rules/nuxt-ui/prefer-u-form-controls/index.js'
import { preferUFormField as preferUFormFieldRule } from './rules/nuxt-ui/prefer-u-form-field/index.js'
import { preferUIcon as preferUIconRule } from './rules/nuxt-ui/prefer-u-icon/index.js'
import { preferUKbd as preferUKbdRule } from './rules/nuxt-ui/prefer-u-kbd/index.js'
import { preferULink as preferULinkRule } from './rules/nuxt-ui/prefer-u-link/index.js'
import { preferUModal as preferUModalRule } from './rules/nuxt-ui/prefer-u-modal/index.js'
import { preferUProgress as preferUProgressRule } from './rules/nuxt-ui/prefer-u-progress/index.js'
import { preferUSeparator as preferUSeparatorRule } from './rules/nuxt-ui/prefer-u-separator/index.js'
import { preferUTable as preferUTableRule } from './rules/nuxt-ui/prefer-u-table/index.js'
import { preferUTree as preferUTreeRule } from './rules/nuxt-ui/prefer-u-tree/index.js'
import { requireAvatarAlt as requireAvatarAltRule } from './rules/nuxt-ui/require-avatar-alt/index.js'
import { requireFormControlLabel as requireFormControlLabelRule } from './rules/nuxt-ui/require-form-control-label/index.js'
import { requireFormFieldName as requireFormFieldNameRule } from './rules/nuxt-ui/require-form-field-name/index.js'
import { requireIconButtonLabel as requireIconButtonLabelRule } from './rules/nuxt-ui/require-icon-button-label/index.js'
import { requireOverlayTitle as requireOverlayTitleRule } from './rules/nuxt-ui/require-overlay-title/index.js'
import { requirePopoverContent as requirePopoverContentRule } from './rules/nuxt-ui/require-popover-content/index.js'
import { requireTooltipContent as requireTooltipContentRule } from './rules/nuxt-ui/require-tooltip-content/index.js'
import { requireUApp as requireUAppRule } from './rules/nuxt-ui/require-u-app/index.js'

const plugin = eslintCompatPlugin({
  meta: {
    name: '@nustack/nuxt-ui',
  },
  rules: {
    'no-conflicting-state-props': noConflictingStatePropsRule,
    'no-deprecated-components': noDeprecatedComponentsRule,
    'no-deprecated-model-modifiers': noDeprecatedModelModifiersRule,
    'no-invalid-prop-combinations': noInvalidPropCombinationsRule,
    'prefer-link-to': preferLinkToRule,
    'prefer-u-button': preferUButtonRule,
    'prefer-u-form-controls': preferUFormControlsRule,
    'prefer-u-form-field': preferUFormFieldRule,
    'prefer-u-icon': preferUIconRule,
    'prefer-u-kbd': preferUKbdRule,
    'prefer-u-link': preferULinkRule,
    'prefer-u-modal': preferUModalRule,
    'prefer-u-progress': preferUProgressRule,
    'prefer-u-separator': preferUSeparatorRule,
    'prefer-u-table': preferUTableRule,
    'prefer-u-tree': preferUTreeRule,
    'require-avatar-alt': requireAvatarAltRule,
    'require-form-control-label': requireFormControlLabelRule,
    'require-form-field-name': requireFormFieldNameRule,
    'require-icon-button-label': requireIconButtonLabelRule,
    'require-overlay-title': requireOverlayTitleRule,
    'require-popover-content': requirePopoverContentRule,
    'require-tooltip-content': requireTooltipContentRule,
    'require-u-app': requireUAppRule,
  },
}) as unknown as ESLint.Plugin & {
  configs: {
    /** The Nuxt UI pack, Vue-SFC-scoped, ready to spread into a flat config. */
    ui: Linter.Config[]
    /** Union of every ecosystem sub-pack shipped here (today: just Nuxt UI). */
    recommended: Linter.Config[]
  }
}

const pluginRef = { '@nustack/nuxt-ui': plugin }

export const NUXT_UI_GLOB = ['**/*.vue']

export interface NuxtUiConfigsOptions {
  /** Cumulative variant; `minimal` ships nothing, `recommended` (default) the rule set. */
  variant?: 'minimal' | 'recommended'
  /** Component prefix from `ui.prefix`. Passed to every rule that resolves components. */
  prefix?: string
  /** Extra rule overrides, merged onto the Vue-SFC scope. */
  rules?: Linter.RulesRecord
}

const RULES = Object.keys(plugin.rules!).sort()

function ruleMeta(name: string): Rule.RuleMetaData | undefined {
  return (plugin.rules![name] as Rule.RuleModule).meta
}

/** Whether a rule resolves components, and so takes the `prefix` option. */
function acceptsPrefix(name: string): boolean {
  const schema = ruleMeta(name)?.schema
  return Array.isArray(schema) && Boolean((schema[0] as any)?.properties?.prefix)
}

/**
 * `problem` rules report code that is already broken — a removed v4 API, props that cancel each
 * other out, a control with no accessible name — so they error. `suggestion` rules express a
 * preference between two things that both work, so they only warn.
 */
function severityOf(name: string): 'error' | 'warn' {
  return ruleMeta(name)?.type === 'problem' ? 'error' : 'warn'
}

/** Returns Vue-SFC-scoped Nuxt UI configs. */
export function nuxtUiConfigs(options: NuxtUiConfigsOptions = {}): Linter.Config[] {
  const { variant = 'recommended', prefix = 'U', rules } = options
  const configs: Linter.Config[] = []

  if (variant !== 'minimal') {
    configs.push({
      name: 'nustack/nuxt-ui',
      files: NUXT_UI_GLOB,
      plugins: pluginRef,
      rules: Object.fromEntries(RULES.map((name) => {
        const level = severityOf(name)
        return [
          `@nustack/nuxt-ui/${name}`,
          prefix !== 'U' && acceptsPrefix(name) ? [level, { prefix }] : level,
        ]
      })),
    })
  }

  if (rules && Object.keys(rules).length) {
    configs.push({
      name: 'nustack/nuxt-ui/rules',
      files: NUXT_UI_GLOB,
      plugins: pluginRef,
      rules,
    })
  }

  return configs
}

plugin.configs = {
  ui: nuxtUiConfigs(),
  // Union preset for every ecosystem sub-pack shipped by this package.
  recommended: nuxtUiConfigs(),
}

export const preferUButton: Rule.RuleModule = plugin.rules!['prefer-u-button'] as Rule.RuleModule
export const preferUFormControls: Rule.RuleModule = plugin.rules!['prefer-u-form-controls'] as Rule.RuleModule
export const preferUFormField: Rule.RuleModule = plugin.rules!['prefer-u-form-field'] as Rule.RuleModule
export const preferULink: Rule.RuleModule = plugin.rules!['prefer-u-link'] as Rule.RuleModule
export const preferUTable: Rule.RuleModule = plugin.rules!['prefer-u-table'] as Rule.RuleModule
export const preferUTree: Rule.RuleModule = plugin.rules!['prefer-u-tree'] as Rule.RuleModule
export const noDeprecatedComponents: Rule.RuleModule = plugin.rules!['no-deprecated-components'] as Rule.RuleModule
export const noDeprecatedModelModifiers: Rule.RuleModule = plugin.rules!['no-deprecated-model-modifiers'] as Rule.RuleModule
export const noConflictingStateProps: Rule.RuleModule = plugin.rules!['no-conflicting-state-props'] as Rule.RuleModule
export const noInvalidPropCombinations: Rule.RuleModule = plugin.rules!['no-invalid-prop-combinations'] as Rule.RuleModule
export const preferLinkTo: Rule.RuleModule = plugin.rules!['prefer-link-to'] as Rule.RuleModule
export const preferUIcon: Rule.RuleModule = plugin.rules!['prefer-u-icon'] as Rule.RuleModule
export const preferUKbd: Rule.RuleModule = plugin.rules!['prefer-u-kbd'] as Rule.RuleModule
export const preferUModal: Rule.RuleModule = plugin.rules!['prefer-u-modal'] as Rule.RuleModule
export const preferUProgress: Rule.RuleModule = plugin.rules!['prefer-u-progress'] as Rule.RuleModule
export const preferUSeparator: Rule.RuleModule = plugin.rules!['prefer-u-separator'] as Rule.RuleModule
export const requirePopoverContent: Rule.RuleModule = plugin.rules!['require-popover-content'] as Rule.RuleModule
export const requireFormControlLabel: Rule.RuleModule = plugin.rules!['require-form-control-label'] as Rule.RuleModule
export const requireUApp: Rule.RuleModule = plugin.rules!['require-u-app'] as Rule.RuleModule
export const requireAvatarAlt: Rule.RuleModule = plugin.rules!['require-avatar-alt'] as Rule.RuleModule
export const requireFormFieldName: Rule.RuleModule = plugin.rules!['require-form-field-name'] as Rule.RuleModule
export const requireIconButtonLabel: Rule.RuleModule = plugin.rules!['require-icon-button-label'] as Rule.RuleModule
export const requireOverlayTitle: Rule.RuleModule = plugin.rules!['require-overlay-title'] as Rule.RuleModule
export const requireTooltipContent: Rule.RuleModule = plugin.rules!['require-tooltip-content'] as Rule.RuleModule
export default plugin
