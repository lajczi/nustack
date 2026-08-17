# `@nustack/nuxt-icon/no-dynamic-icon-name`

Disallow `:name` values the `@nuxt/icon` client-bundle scanner cannot see. Scan only matches
`collection:icon` / `i-collection-icon` literals in source. A template string or identifier is
invisible, so the icon 404s after `nuxt generate` or with `provider: 'none'` unless you list it
in `icon.clientBundle.icons`.

Static strings and ternaries of two static strings are accepted — those are scannable.

## Incorrect

```vue
<template>
  <Icon :name="`lucide:${icon}`" />
  <Icon :name="icon" />
</template>
```

## Correct

```vue
<template>
  <Icon name="lucide:home" />
  <Icon :name="ok ? 'lucide:check' : 'lucide:x'" />
</template>
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  icon: {
    clientBundle: {
      icons: ['lucide:dynamic-one'],
    },
  },
})
```

## Further reading

- [Nuxt Icon — Client Bundle](https://github.com/nuxt/icon#client-bundle)
