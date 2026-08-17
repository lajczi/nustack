# `@nustack/nuxt-icon/require-client-bundle-when-provider-none`

Require a client bundle when `icon.provider` is `'none'`. That provider does no network fetch, so
icons are blank unless they are scanned or listed in `clientBundle.icons`.

This rule applies to `nuxt.config`, where `clientBundle` is configured. `provider: 'none'` in
`app.config` alone is not reported.

## Incorrect

```ts
export default defineNuxtConfig({
  icon: {
    provider: 'none',
  },
})
```

## Correct

```ts
export default defineNuxtConfig({
  icon: {
    provider: 'none',
    clientBundle: {
      scan: true,
    },
  },
})
```

## Further reading

- [Nuxt Icon — Provider](https://github.com/nuxt/icon)
