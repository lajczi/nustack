# `@nustack/nuxt-icon/no-custom-collections-without-bundle`

Disallow `icon.customCollections` when they are excluded from the client bundle and the
resolved provider cannot serve them. `@nuxt/icon` defaults `clientBundle.includeCustomCollections`
to `provider !== 'server'`, so Iconify / `ssr: false` / `provider: 'none'` already bundle
local collections unless you set `includeCustomCollections: false`.

Fix with `provider: 'server'` or `clientBundle.includeCustomCollections: true` (or omit it).

The rule reports only when `includeCustomCollections` is statically `false` and `provider` is
statically `'iconify'` or `'none'`, or unset while `ssr` is statically `false`. Unknown
bindings are left alone.

## Incorrect

```ts
export default defineNuxtConfig({
  ssr: false,
  icon: {
    clientBundle: {
      includeCustomCollections: false,
    },
    customCollections: [{ prefix: 'my', dir: './app/assets/icons' }],
  },
})
```

## Correct

```ts
export default defineNuxtConfig({
  ssr: false,
  icon: {
    customCollections: [{ prefix: 'my', dir: './app/assets/icons' }],
  },
})
```

## Further reading

- [Nuxt Icon — Custom Local Collections](https://github.com/nuxt/icon#custom-local-collections)
