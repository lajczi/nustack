# `@nustack/nuxt-icon/require-icon-name`

Require a non-empty `name` on `<Icon>` (or the configured `icon.componentName`) and, when Nuxt UI
settings are present, `<UIcon>`. `name` is the only way `@nuxt/icon` knows which icon, alias, or
global component to render. A missing or empty `name` loads nothing.

A dynamic `:name` that cannot be proven empty is accepted.

## Incorrect

```vue
<template>
  <Icon />
  <Icon name="" />
</template>
```

## Correct

```vue
<template>
  <Icon name="uil:github" />
  <Icon name="i-lucide-lightbulb" />
  <Icon :name="icon" />
</template>
```

## Further reading

- [Nuxt Icon](https://github.com/nuxt/icon)
