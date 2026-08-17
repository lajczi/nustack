# `@nustack/nuxt-icon/no-ignored-mode-on-component-icon`

Disallow `mode` when `name` is a PascalCase global Vue component. `@nuxt/icon` renders that
component directly and ignores `mode`.

Only statically known PascalCase names are reported. Iconify names (`lucide:home`,
`i-lucide-home`) and dynamic names are left alone.

## Incorrect

```vue
<template>
  <Icon name="MyLogo" mode="svg" />
</template>
```

## Correct

```vue
<template>
  <Icon name="MyLogo" />
  <Icon name="uil:github" mode="svg" />
</template>
```

## Further reading

- [Nuxt Icon](https://github.com/nuxt/icon)
