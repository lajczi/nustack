# `@nustack/nuxt-icon/no-legacy-app-config-key`

Disallow the v0 `nuxtIcon` key in `app.config`. `@nuxt/icon` v1 renamed it to `icon`.

## Incorrect

```ts
// app.config.ts
export default defineAppConfig({
  nuxtIcon: { size: '24px' },
})
```

## Correct

```ts
// app.config.ts
export default defineAppConfig({
  icon: { size: '24px' },
})
```

## Further reading

- [Nuxt Icon](https://github.com/nuxt/icon)
