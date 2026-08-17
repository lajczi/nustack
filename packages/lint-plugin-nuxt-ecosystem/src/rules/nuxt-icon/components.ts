import type { Context } from '@oxlint/plugins'
import type { AST as VueAST } from 'vue-eslint-parser'
import type { ComponentMatcher } from '../../utils/component-matcher.js'
import { createComponentMatcher } from '../../utils/component-matcher.js'
import { hasNuxtUi, NUXT_UI_MODULE, nuxtUiPrefix, nuxtUiSettings } from '../nuxt-ui/components.js'

const NUXT_ICON_MODULE = /^(?:@nuxt\/icon(?:\/|$)|#components$)/

export const NUXT_ICON_SETTINGS_KEY = '@nustack/nuxt-icon'
const DEFAULT_COMPONENT_NAME = 'Icon'

interface NuxtIconSettings {
  enabled?: boolean
  componentName?: string
}

export interface IconTarget {
  name: string
}

export interface IconMatcher {
  match: (node: VueAST.VElement) => IconTarget | null
  componentName: string
}

function resolveNuxtIconSettings(context: Context): NuxtIconSettings | undefined {
  const settings = (context as Context & { settings?: Record<string, unknown> }).settings?.[NUXT_ICON_SETTINGS_KEY]
  return typeof settings === 'object' && settings !== null ? settings as NuxtIconSettings : undefined
}

export function nuxtIconComponentName(context: Context): string {
  return resolveNuxtIconSettings(context)?.componentName ?? DEFAULT_COMPONENT_NAME
}

export function nuxtIconSettings(componentName = DEFAULT_COMPONENT_NAME): Record<string, NuxtIconSettings> {
  return { [NUXT_ICON_SETTINGS_KEY]: { enabled: true, componentName } }
}

export function createNuxtIconMatcher(context: Context): ComponentMatcher {
  return createComponentMatcher(context, { module: NUXT_ICON_MODULE, prefix: '' })
}

export function createIconMatcher(context: Context): IconMatcher {
  const icon = createNuxtIconMatcher(context)
  const componentName = nuxtIconComponentName(context)
  const nuxtUi = hasNuxtUi(context)
    ? createComponentMatcher(context, { module: NUXT_UI_MODULE, prefix: nuxtUiPrefix(context) })
    : null

  return {
    componentName,
    match: (node) => {
      if (icon.is(node, componentName))
        return { name: icon.rawName(node) }
      if (nuxtUi?.is(node, 'Icon'))
        return { name: nuxtUi.rawName(node) }
      return null
    },
  }
}

export function iconConfigSettings(options: { componentName?: string, nuxtUi?: false | { prefix?: string } } = {}): Record<string, unknown> {
  return {
    ...nuxtIconSettings(options.componentName),
    ...(options.nuxtUi ? nuxtUiSettings(options.nuxtUi.prefix) : {}),
  }
}
