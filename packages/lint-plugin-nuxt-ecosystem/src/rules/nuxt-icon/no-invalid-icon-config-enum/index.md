# `@nustack/nuxt-icon/no-invalid-icon-config-enum`

Disallow static `icon` options that are not in the documented unions:

- `provider`: `'server' | 'iconify' | 'none'`
- `mode`: `'css' | 'svg'`
- `fallbackToApi`: `true | false | 'server-only' | 'client-only'`
- `serverBundle`: `'auto' | 'remote' | 'local' | false | object`

Unknown bindings are not reported.

## Incorrect

```ts
export default defineNuxtConfig({
  icon: {
    provider: 'cdn',
    mode: 'img',
  },
})
```

## Correct

```ts
export default defineNuxtConfig({
  icon: {
    provider: 'server',
    mode: 'css',
    fallbackToApi: 'client-only',
    serverBundle: 'local',
  },
})
```

## Further reading

- [Nuxt Icon](https://github.com/nuxt/icon)
