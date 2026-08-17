# `@nustack/nuxt-icon/prefer-icon`

Prefer `<Icon>` (or the configured `icon.componentName`) over a raw `<i>` / `<span>` with an
Iconify class (`i-collection-icon`). Those classes skip the module's server bundle, aliases, and
SSR path.

This rule is silent when Nuxt UI settings are present — `@nustack/nuxt-ui/prefer-u-icon` already
asks for `<UIcon>` in that case.

## Incorrect

```vue
<template>
  <i class="i-lucide-search" />
</template>
```

## Correct

```vue
<template>
  <Icon name="i-lucide-search" />
</template>
```

## Further reading

- [Nuxt Icon](https://github.com/nuxt/icon)
