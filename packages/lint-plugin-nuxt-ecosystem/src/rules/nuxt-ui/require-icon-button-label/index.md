# `@nustack/nuxt-ui/require-icon-button-label`

Icon-, avatar-, and loading-only `UButton` instances need an accessible label. `label`,
`aria-label`, `title`, or visible slot content satisfies the rule.

## Incorrect

```vue
<template>
  <UButton icon="i-lucide-search" />
  <UButton loading />
</template>
```

## Correct

```vue
<template>
  <UButton icon="i-lucide-search" aria-label="Search" />
  <UButton loading label="Saving" />
</template>
```

## Further reading

- [Nuxt UI Button](https://ui.nuxt.com/docs/components/button)
