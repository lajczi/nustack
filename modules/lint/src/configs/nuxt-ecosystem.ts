import type { NuxtIconPreset, NuxtImagePreset, NuxtUiPreset } from '@nustackjs/lint-plugin-nuxt-ecosystem'
import type { Linter } from 'eslint'
import type { NustackContext } from '../context'
import type { ConcernOptions, ConcernToggle } from '../utils'
import { nuxtIconConfig, nuxtIconConfigFiles, nuxtImageConfig, nuxtUiConfig } from '@nustackjs/lint-plugin-nuxt-ecosystem'
import { isEnabled, resolveConcernRules, subOptions } from '../utils'

export interface NuxtUiConcernOptions extends ConcernOptions {
  /** Rule preset from the Nuxt UI integration. @default 'recommended' */
  preset?: NuxtUiPreset | false
}

export interface NuxtImageConcernOptions extends ConcernOptions {
  /** Rule preset from the Nuxt Image integration. @default 'recommended' */
  preset?: NuxtImagePreset | false
}

export interface NuxtIconConcernOptions extends ConcernOptions {
  /** Rule preset from the Nuxt Icon integration. @default 'recommended' */
  preset?: NuxtIconPreset | false
}

/** Options for detected Nuxt ecosystem integrations. */
export interface NuxtEcosystemOptions {
  /** Nuxt UI component preferences. Auto-gated on `@nuxt/ui` detection. */
  nuxtUi?: ConcernToggle<NuxtUiConcernOptions>
  /** Nuxt Image usage rules. Auto-gated on `@nuxt/image` detection. */
  nuxtImage?: ConcernToggle<NuxtImageConcernOptions>
  /** Nuxt Icon usage rules. Auto-gated on `@nuxt/icon` (and `@nuxt/ui`, which ships it). */
  nuxtIcon?: ConcernToggle<NuxtIconConcernOptions>
}

export type NuxtEcosystemToggle = ConcernToggle<NuxtEcosystemOptions>

/**
 * One config per supported module, each included only when that module is installed. Detection
 * lives here (the context knows what the project has); the plugin owns the rules and presets.
 */
export function nuxtEcosystemConfig(
  context: NustackContext,
  options: NuxtEcosystemOptions = {},
): Linter.Config[] {
  const configs: Linter.Config[] = []

  if (isEnabled(options.nuxtUi, context.modules.nuxtUi)) {
    const moduleOptions = subOptions(options.nuxtUi)
    configs.push(nuxtUiConfig({
      prefix: context.nuxtUi.prefix,
      preset: moduleOptions.preset,
      rules: resolveConcernRules(moduleOptions),
    }))
  }

  if (isEnabled(options.nuxtImage, context.modules.nuxtImage)) {
    const moduleOptions = subOptions(options.nuxtImage)
    configs.push(nuxtImageConfig({
      preset: moduleOptions.preset,
      rules: resolveConcernRules(moduleOptions),
    }))
  }

  if (isEnabled(options.nuxtIcon, context.modules.nuxtIcon)) {
    const moduleOptions = subOptions(options.nuxtIcon)
    const iconOptions = {
      componentName: context.nuxtIcon.componentName,
      nuxtUi: context.modules.nuxtUi ? { prefix: context.nuxtUi.prefix } : false as const,
      preset: moduleOptions.preset,
      rules: resolveConcernRules(moduleOptions),
    }
    configs.push(nuxtIconConfig(iconOptions), nuxtIconConfigFiles(iconOptions))
  }

  return configs
}
