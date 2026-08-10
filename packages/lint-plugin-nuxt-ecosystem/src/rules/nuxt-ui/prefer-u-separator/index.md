# `@nustack/nuxt-ui/prefer-u-separator`

Prefer `USeparator` over a raw `hr` element for consistent orientation, color, size, and
optional label handling.

## Incorrect

```vue
<template>
  <hr>
</template>
```

## Correct

```vue
<template>
  <USeparator />
</template>
```

Use `data-raw` when native markup is intentional.

## Further reading

- [Nuxt UI Separator](https://ui.nuxt.com/docs/components/separator)
