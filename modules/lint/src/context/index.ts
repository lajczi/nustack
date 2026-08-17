/** Project context serialized into the generated ESLint config. */
export interface NustackContext {
  modules: {
    nuxtUi: boolean
    nuxtImage: boolean
    nuxtIcon: boolean
    /** MDC-capable Markdown renderer (`@nuxt/content`, `@comark/nuxt`, or legacy `@nuxtjs/mdc`). */
    mdc: boolean
  }
  nuxtUi: {
    /** Component prefix from `ui.prefix`, needed to recognise `<UButton>` and friends. */
    prefix: string
  }
  nuxtIcon: {
    /** Global component name from `icon.componentName`, default `Icon`. */
    componentName: string
  }
  tailwind: {
    detected: boolean
    /**
     * Path to the CSS file that imports Tailwind (`@import "tailwindcss"`),
     * relative to the project root. `null` when not detected.
     */
    entryPoint: string | null
  }
  /**
   * Every identifier Nuxt makes globally available without an explicit import,
   * pulled from the resolved unimport registry (Vue reactivity, Nuxt
   * composables, project `composables/` + `utils/`, module-provided helpers).
   */
  autoImports: string[]
  components: string[]
}

export const EMPTY_CONTEXT: NustackContext = {
  modules: { nuxtUi: false, nuxtImage: false, nuxtIcon: false, mdc: false },
  nuxtUi: { prefix: 'U' },
  nuxtIcon: { componentName: 'Icon' },
  tailwind: { detected: false, entryPoint: null },
  autoImports: [],
  components: [],
}
