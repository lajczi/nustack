# `@nustack/nuxt-ui/prefer-u-kbd`

Prefer Nuxt UI's `UKbd` over a raw `kbd` element for theme-aware keyboard hints.

## Incorrect

```vue
<template>
  <kbd>K</kbd>
</template>
```

## Correct

```vue
<template>
  <UKbd value="K" />
</template>
```

Use `data-raw` when native markup is intentional.

## Further reading

- [Nuxt UI Kbd](https://ui.nuxt.com/docs/components/kbd)
