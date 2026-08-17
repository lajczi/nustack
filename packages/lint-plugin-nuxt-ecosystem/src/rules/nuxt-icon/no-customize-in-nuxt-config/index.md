# `@nustack/nuxt-icon/no-customize-in-nuxt-config`

Disallow `customize` under `icon` in `nuxt.config`. `@nuxt/icon` throws a `TypeError` at setup
because the callback cannot be serialized into the Nitro bundle. Put it in `app.config` or on
the component.

## Incorrect

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  icon: {
    customize: content => content,
  },
})
```

## Correct

```ts
// app.config.ts
export default defineAppConfig({
  icon: {
    customize: content => content,
  },
})
```

## Further reading

- [Nuxt Icon](https://github.com/nuxt/icon)
