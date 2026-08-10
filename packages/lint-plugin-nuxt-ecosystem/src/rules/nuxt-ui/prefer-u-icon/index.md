# `@nustack/nuxt-ui/prefer-u-icon`

Prefer Nuxt UI's `UIcon` component and its `name` prop over raw Iconify utility classes.
Use `data-raw` for a deliberate low-level icon implementation.

## Incorrect

```vue
<template>
  <span class="i-lucide-search" />
</template>
```

## Correct

```vue
<template>
  <UIcon name="i-lucide-search" />
</template>
```

## Further reading

- [Nuxt UI Icon](https://ui.nuxt.com/docs/components/icon)
