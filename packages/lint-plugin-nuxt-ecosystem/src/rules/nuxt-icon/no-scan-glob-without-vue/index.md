# `@nustack/nuxt-icon/no-scan-glob-without-vue`

Disallow `icon.clientBundle.scan.globInclude` that does not include a `*.vue` pattern. Setting
`globInclude` replaces the module defaults (`**/*.{vue,jsx,tsx,md,…}`), so dropping Vue means
`<Icon>` names in SFCs are never bundled.

Dynamic entries in the array are not reported.

## Incorrect

```ts
export default defineNuxtConfig({
  icon: {
    clientBundle: {
      scan: {
        globInclude: ['**/*.md'],
      },
    },
  },
})
```

## Correct

```ts
export default defineNuxtConfig({
  icon: {
    clientBundle: {
      scan: {
        globInclude: ['**/*.vue', '**/*.md'],
      },
    },
  },
})
```

## Further reading

- [Nuxt Icon — Client Bundle](https://github.com/nuxt/icon#client-bundle)
